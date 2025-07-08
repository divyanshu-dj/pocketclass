import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  PlusIcon,
  GiftIcon,
  CreditCardIcon,
  XIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import NewHeader from "../components/NewHeader";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// AddCardForm component
const AddCardForm = ({ user, onCardAdded, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create SetupIntent
      const response = await fetch("/api/createSetupIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          customerId: user.stripeCustomerId || null,
        }),
      });

      const { clientSecret, customerId } = await response.json();

      // Confirm the SetupIntent
      const { error, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.displayName || user.email,
              email: user.email,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else {
        // Get payment method details
        const paymentMethodID = setupIntent.payment_method;
        const updatePaymentMethod = await fetch("api/updatePaymentMethod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethodId: paymentMethodID,
            customerId: customerId,
          }),
        });
        if (!updatePaymentMethod.ok) {
          throw new Error("Failed to update payment method");
        } else {
          toast.success("Card saved successfully!");
        }
        onCardAdded();
        onClose();
      }
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("Failed to save card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 px-4 py-3 bg-logo-red text-white rounded-lg hover:bg-logo-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function wallet() {
  const [user, userLoading] = useAuthState(auth);
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [packages, setPackages] = useState([]);

  // Helper function to get card brand colors and styles
  const getCardBrandStyle = (brand) => {
    const styles = {
      visa: {
        gradient: "from-blue-600 to-blue-800",
        accent: "text-blue-100",
        logo: "VISA",
      },
      mastercard: {
        gradient: "from-red-500 to-orange-600",
        accent: "text-red-100",
        logo: "MC",
      },
      amex: {
        gradient: "from-green-600 to-green-800",
        accent: "text-green-100",
        logo: "AMEX",
      },
      discover: {
        gradient: "from-orange-500 to-orange-700",
        accent: "text-orange-100",
        logo: "DISC",
      },
      default: {
        gradient: "from-gray-600 to-gray-800",
        accent: "text-gray-100",
        logo: "CARD",
      },
    };
    return styles[brand?.toLowerCase()] || styles.default;
  };
  const fetchSavedCards = async () => {
    try {
      const response = await fetch(
        `/api/getSavedCards?email=${user.email}&customerId=${
          user.stripeCustomerId || ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch saved cards");
      }
      const data = await response.json();
      console.log("Saved Cards:", data);
      setSavedCards(data.savedCards || data || []);
    } catch (error) {
      console.error("Error fetching saved cards:", error);
    }
  };

  const fetchPackages = async () => {
    if (!user) return;

    try {
      const packagesRef = collection(db, "Packages");
      const q = query(packagesRef, where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userPackages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("User Packages:", userPackages);
      //   Get Class details for each package, and store it in the package object
      const classPromises = userPackages.map(async (pkg) => {
        if (pkg.class_id) {
          const classDoc = await getDoc(doc(db, "classes", pkg.class_id));
          console.log("Class Document:", classDoc.data());
          if (classDoc.exists()) {
            return {
              ...pkg,
              class_name: classDoc.data().Name || "Class",
              class_id: pkg.class_id,
            };
          } else {
            return {
              ...pkg,
              class_name: "Class Not Found",
              class_id: pkg.class_id,
            };
          }
        }
        return pkg;
      });
      setPackages(await Promise.all(classPromises));
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedCards();
      fetchPackages();
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please log in to view your wallet.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="mx-auto">
        <Head>
          <title>Wallet</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/pc_favicon.ico" />
        </Head>
        <NewHeader />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            </div>

            {/* Wallet Balance Card */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-logo-red via-logo-red/90 to-logo-red/80 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-5xl font-bold mb-2">$0.00</h2>
                  <p className="text-blue-100 text-lg mb-6">Wallet balance</p>

                  <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full px-6 py-3 text-white font-medium">
                    <PlusIcon className="w-5 h-5" />
                    Add a gift card
                  </button>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              </div>
            </div>

            {/* Buy a gift card section */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Buy a gift card
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 max-w-md">
                      Treat someone special to a Fresha gift card, valid at all
                      verified venues
                    </p>

                    <button className="bg-gray-900 hover:bg-gray-800 transition-colors duration-200 text-white px-8 py-3 rounded-full font-medium">
                      Buy now
                    </button>
                  </div>

                  <div className="ml-8">
                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <GiftIcon className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cards</h3>

              {/* Add debit/credit card button */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-4 w-full text-left hover:bg-gray-50 transition-colors duration-200 rounded-xl p-2"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCardIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    Add debit/credit card
                  </span>
                </button>

                {savedCards.length > 0 && (
                  <div className="flex-row flex overflow-auto space-x-4 mt-6">
                    {savedCards.map((cardData, index) => {
                      // Handle both direct card objects and nested card structures
                      const card = cardData.card || cardData;
                      const brand = card.brand || cardData.brand;
                      const last4 = card.last4 || cardData.last4;
                      const expMonth = card.exp_month || cardData.exp_month;
                      const expYear = card.exp_year || cardData.exp_year;
                      const funding = card.funding || cardData.funding;
                      const holderName =
                        cardData.billing_details?.name ||
                        cardData.name ||
                        "Card Holder";

                      const brandStyle = getCardBrandStyle(brand);

                      return (
                        <div
                          key={cardData.id || index}
                          className={`relative bg-gradient-to-br ${brandStyle.gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 min-h-[140px] cursor-pointer`}
                        >
                          {/* Card Brand Logo */}
                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`text-xs font-bold ${brandStyle.accent} px-2 py-1 bg-white/20 rounded`}
                            >
                              {brandStyle.logo}
                            </div>
                            <div
                              className={`text-xs ${brandStyle.accent} capitalize`}
                            >
                              {funding || "Card"}
                            </div>
                          </div>

                          {/* Card Number */}
                          <div className="mb-4">
                            <div className="text-lg font-mono tracking-wider whitespace-nowrap">
                              •••• •••• •••• {last4}
                            </div>
                          </div>

                          {/* Card Details */}
                          <div className="flex justify-between items-end">
                            <div>
                              <div
                                className={`text-xs ${brandStyle.accent} mb-1`}
                              >
                                EXPIRES
                              </div>
                              <div className="text-sm font-medium">
                                {String(expMonth).padStart(2, "0")}/
                                {String(expYear).slice(-2)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-xs ${brandStyle.accent} mb-1`}
                              >
                                CARDHOLDER
                              </div>
                              <div className="text-sm font-medium truncate max-w-[120px]">
                                {holderName.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full"></div>
                          <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/5 rounded-full"></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Packages section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  My Packages
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {packages.length}{" "}
                  {packages.length === 1 ? "Package" : "Packages"}
                </span>
              </div>

              {packages.length > 0 ? (
                <div className="grid whitespace-nowrap  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((packageData, index) => (
                    <div
                      key={packageData.id || index}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Package Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {packageData.package_name || "Package"}
                          </h4>
                          <p className="text-sm whitespace-normal text-gray-600 mb-3">
                            {/* Show only first 20 characters of class name */}
                            {packageData.class_name?.slice(0, 18) ||
                              "Class Package"}
                            {packageData.class_name &&
                            packageData.class_name.length > 18
                              ? "..."
                              : ""}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            packageData.status === "active"
                              ? "bg-green-100 text-green-800"
                              : packageData.status === "expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {packageData.status || "Active"}
                        </div>
                      </div>

                      {/* Package Details */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Sessions
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-logo-red h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((packageData.classes_left || 0) /
                                      (packageData.num_sessions || 1)) *
                                      100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {packageData.classes_left || 0}/
                              {packageData.num_sessions || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Price Paid
                          </span>
                          <span className="text-lg font-bold text-logo-red">
                            ${packageData.packagePrice || "0.00"}
                          </span>
                        </div>

                        {packageData.expiry_date && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Expires
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(
                                packageData.expiry_date.seconds * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {packageData.purchase_date && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Purchased
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(
                                packageData.purchase_date.seconds * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Package Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex gap-3">
                          <button
                            onClick={
                              // Handle booking session logic here
                              // For now, just show an alert
                              () =>
                                (window.location.href = `/classes/id=${packageData.class_id}`)
                            }
                            className="flex-1 px-4 py-2 bg-logo-red text-white text-sm font-medium rounded-lg hover:bg-logo-red/90 transition-colors"
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GiftIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No packages found
                  </h4>
                  <p className="text-gray-600 mb-6">
                    You haven't purchased any packages yet. Browse classes to
                    find packages that suit your needs.
                  </p>
                  <button className="px-6 py-3 bg-logo-red text-white font-medium rounded-lg hover:bg-logo-red/90 transition-colors">
                    Browse Classes
                  </button>
                </div>
              )}
            </div>

            {/* Add Card Form Modal */}
            {showAddCard && (
              <AddCardForm
                user={user}
                onCardAdded={() => {
                  fetchSavedCards();
                }}
                onClose={() => setShowAddCard(false)}
              />
            )}
          </div>
        </div>
      </div>
    </Elements>
  );
}
