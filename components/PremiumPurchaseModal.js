import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  XIcon,
  StarIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from "@heroicons/react/outline";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;

  // Handle Firestore Timestamp objects
  if (timestamp.seconds && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000);
  }

  // Handle Date objects
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle ISO strings
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }

  // Handle timestamp objects with toDate method
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  return null;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PremiumPurchaseModal = ({
  isOpen,
  onClose,
  user,
  userData,
  onPurchaseSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [intentType, setIntentType] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Premium pricing
  const PREMIUM_PRICE = 5.0;
  const PROCESSING_FEE = PREMIUM_PRICE * 0.029 + 0.8; // 2.9% + $0.80
  const totalAmount = PREMIUM_PRICE + PROCESSING_FEE;

  const handleStartPurchase = async () => {
    if (!user?.uid) {
      toast.error("Please log in to purchase premium");
      return;
    }

    setLoading(true);
    try {
      // Create subscription instead of one-time payment
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create subscription");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setIntentType(data.intentType);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error(
        error.message || "Failed to initialize payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#E63F2B",
    },
  };

  const stripeOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Upgrade to Premium
              </h3>
              <p className="text-sm text-gray-500">
                Unlock all automation features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {!showPaymentForm ? (
          // Purchase Summary
          <div className="p-6">
            {/* Premium Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Premium Features Include:
              </h4>
              <div className="space-y-3">
                {[
                  "New booking confirmations",
                  "Class reschedule notifications",
                  "Cancellation notifications",
                  "Thank you messages",
                  "Birthday special offers",
                  "Win-back campaigns",
                  "Welcome new student emails",
                  "Reminder to rebook automation",
                  "Advanced engagement tools",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Pricing Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Premium Subscription (1 month)
                  </span>
                  <span className="text-gray-900">
                    ${PREMIUM_PRICE.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Processing Fee (2.9% + $0.80)
                  </span>
                  <span className="text-gray-600">
                    ${PROCESSING_FEE.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#E63F2B]">
                      ${totalAmount.toFixed(2)} CAD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-blue-900 mb-2">
                Subscription Details
              </h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Monthly recurring: $5.95 CAD per month</li>
                <li>• Automatic renewal: Yes (cancel anytime)</li>
                <li>• Access: Immediate activation after payment</li>
                <li>
                  • Cancellation: Cancel anytime, access until period ends
                </li>
              </ul>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handleStartPurchase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E63F2B] to-[#FF6B5A] text-white py-4 rounded-lg font-semibold text-lg hover:from-[#D63825] hover:to-[#E55B4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <CreditCardIcon className="w-5 h-5" />
                  <span>Start Premium Subscription - $5.95/month</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // Payment Form
          <div className="p-6">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Complete Your Subscription
              </h4>
              <p className="text-sm text-gray-600">
                Monthly: $5.95 CAD (recurring)
              </p>
            </div>

            {clientSecret && (
              <Elements options={stripeOptions} stripe={stripePromise}>
                <PremiumCheckoutForm
                  clientSecret={clientSecret}
                  intentType={intentType}
                  userId={user.uid}
                  totalAmount={totalAmount}
                  onSuccess={onPurchaseSuccess}
                  onError={() => {
                    setShowPaymentForm(false);
                    setClientSecret("");
                  }}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PremiumCheckoutForm = ({
  clientSecret,
  intentType,
  userId,
  totalAmount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment form not initialized properly.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/automations?subscription=success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setMessage(result.error.message);
        console.error("Subscription error:", result.error);
        onError();
      } else {
        toast.success("Premium subscription activated! 🎉");
        onSuccess();
        window.location.href = "/automations?subscription=success";
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      setMessage("An unexpected error occurred.");
      onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#E63F2B] text-white py-3 rounded-lg font-semibold hover:bg-[#D63825] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Processing..."
          : `${
              intentType === "payment" ? "Subscribe Now" : "Set up Subscription"
            } - $5.95/month`}
      </button>
    </form>
  );
};

export default PremiumPurchaseModal;
