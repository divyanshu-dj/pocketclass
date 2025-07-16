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
  addDoc,
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
  PaymentElement,
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

// GiftCardPaymentForm component for handling gift card payments
const GiftCardPaymentForm = ({ stripeOptions, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet?gift_card_success=true`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment failed:", error);
        toast.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);

        // Add gift card to Firestore after successful payment
        await addDoc(collection(db, "giftCards"), {
          code: stripeOptions.giftCardCode,
          amount: stripeOptions.giftCardAmount,
          available: stripeOptions.giftCardAmount,
          createdBy: user.uid,
          claimedBy: null,
          isUsed: false,
          createdAt: new Date(),
          paymentIntentId: paymentIntent.id,
        });

        toast.success("Gift card purchased successfully!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Complete Gift Card Purchase
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-purple-50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <GiftIcon className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-purple-900">
              Gift Card Details
            </span>
          </div>
          <p className="text-purple-700">
            Amount:{" "}
            <span className="font-bold">${stripeOptions.giftCardAmount}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <PaymentElement />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 px-6 py-3 bg-logo-red text-white rounded-lg hover:bg-logo-red/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Pay $${stripeOptions.giftCardAmount}`}
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
  const [showBuyGiftCard, setShowBuyGiftCard] = useState(false);
  const [giftCardAmount, setGiftCardAmount] = useState(50);
  const [stripeOptions, setStripeOptions] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [showAddGiftCard, setShowAddGiftCard] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [totalGiftCardBalance, setTotalGiftCardBalance] = useState(0);

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

  // Fetch gift cards
  const fetchGiftCards = async () => {
    if (!user) return;

    try {
      // Fetch gift cards created by user
      const createdGiftCardsQuery = query(
        collection(db, "giftCards"),
        where("createdBy", "==", user.uid)
      );
      const createdSnapshot = await getDocs(createdGiftCardsQuery);

      // Fetch gift cards claimed by user
      const claimedGiftCardsQuery = query(
        collection(db, "giftCards"),
        where("claimedBy", "==", user.uid)
      );
      const claimedSnapshot = await getDocs(claimedGiftCardsQuery);

      const createdGiftCards = [];
      const claimedGiftCards = [];
      let totalBalance = 0;

      createdSnapshot.docs.forEach((doc) => {
        const cardData = {
          id: doc.id,
          ...doc.data(),
          type: "created",
        };
        createdGiftCards.push(cardData);
      });

      claimedSnapshot.docs.forEach((doc) => {
        const cardData = {
          id: doc.id,
          ...doc.data(),
          type: "claimed",
        };
        claimedGiftCards.push(cardData);
        // Add to total balance only if it's claimed by the user and not used
        if (cardData.claimedBy === user.uid && !cardData.isUsed) {
          totalBalance += cardData.available || 0;
        }
      });

      // Combine all gift cards
      const allGiftCards = [...createdGiftCards, ...claimedGiftCards];
      
      console.log("All Gift Cards:", allGiftCards);
      console.log("Total Gift Card Balance:", totalBalance);
      setGiftCards(allGiftCards);
      setTotalGiftCardBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    }
  };

  // Add/Claim gift card function
  const addGiftCard = async (code) => {
    if (!code.trim()) {
      toast.error("Please enter a gift card code");
      return;
    }

    try {
      // Search for the gift card by code
      const giftCardQuery = query(
        collection(db, "giftCards"),
        where("code", "==", code.toUpperCase())
      );
      const querySnapshot = await getDocs(giftCardQuery);

      if (querySnapshot.empty) {
        toast.error("Gift card not found. Please check the code and try again.");
        return;
      }

      const giftCardDoc = querySnapshot.docs[0];
      const giftCardData = giftCardDoc.data();

      // Check if gift card is already claimed
      if (giftCardData.claimedBy && giftCardData.claimedBy !== user.uid) {
        toast.error("This gift card has already been claimed by another user.");
        return;
      }

      // Check if gift card is already claimed by current user
      if (giftCardData.claimedBy === user.uid) {
        toast.error("You have already claimed this gift card.");
        return;
      }

      // Check if gift card is used
      if (giftCardData.isUsed) {
        toast.error("This gift card has already been used.");
        return;
      }

      // Update the gift card to mark as claimed by current user
      await updateDoc(doc(db, "giftCards", giftCardDoc.id), {
        claimedBy: user.uid,
        claimedAt: new Date(),
      });

      toast.success("Gift card added successfully!");
      setShowAddGiftCard(false);
      setGiftCardCode("");
      fetchGiftCards(); // Refresh the gift cards list
    } catch (error) {
      console.error("Error adding gift card:", error);
      toast.error("Error adding gift card. Please try again.");
    }
  };

  // Generate 16-digit gift card code
  const generateGiftCardCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Buy gift card function - using the existing create-stripe-session endpoint
  const buyGiftCard = async (amount) => {
    try {
      setStripeLoading(true);

      // Generate the gift card code first
      const giftCardCode = generateGiftCardCode();

      // Create Stripe session using the existing endpoint
      const response = await fetch("/api/create-stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: amount,
          uEmail: user?.email,
          uName: user?.displayName || user?.email,
          uid: user?.uid,
          classId: "gift-card", // Special identifier for gift cards
          insId: "gift-card", // Special identifier for gift cards
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create gift card session");
      }

      const data = await response.json();

      if (data?.clientSecret) {
        console.log("Stripe session created successfully for gift card:", data);
        setStripeOptions({
          clientSecret: data.clientSecret,
          customer: data.customerId,
          customerSessionClientSecret: data.customerSessionSecret,
          giftCardCode: giftCardCode,
          giftCardAmount: amount,
          appearance: {
            theme: "stripe",
          },
          loader: "auto",
        });
      }
      setStripeLoading(false);
    } catch (error) {
      console.error("Error creating gift card session:", error);
      setStripeLoading(false);
      alert("Error processing gift card purchase");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedCards();
      fetchPackages();
      fetchGiftCards();
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
                  <h2 className="text-5xl font-bold mb-2">${totalGiftCardBalance.toFixed(2)}</h2>
                  <p className="text-blue-100 text-lg mb-6">Gift card balance</p>

                  <button 
                    onClick={() => setShowAddGiftCard(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full px-6 py-3 text-white font-medium">
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
                      Treat someone special to a Pocketclass gift card, valid at
                      all verified venues
                    </p>

                    <button
                      onClick={() => setShowBuyGiftCard(true)}
                      className="bg-gray-900 hover:bg-gray-800 transition-colors duration-200 text-white px-8 py-3 rounded-full font-medium"
                    >
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

            {/* Gift Cards section */}
            <div className="mt-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  My Gift Cards
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {giftCards.length} {giftCards.length === 1 ? "Card" : "Cards"}
                </span>
              </div>

              {giftCards.length > 0 ? (
                <div className="space-y-8">
                  {/* Claimed Gift Cards */}
                  {giftCards.filter(card => card.type === "claimed").length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Claimed Gift Cards ({giftCards.filter(card => card.type === "claimed").length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {giftCards.filter(card => card.type === "claimed").map((giftCard, index) => (
                          <div
                            key={giftCard.id || index}
                            className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden"
                          >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                            {/* Gift Card Header */}
                            <div className="relative z-10 mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <GiftIcon className="w-8 h-8 text-white" />
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    giftCard.isUsed || (giftCard.available <= 0)
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {giftCard.isUsed || (giftCard.available <= 0) ? "Used" : "Available"}
                                </div>
                              </div>
                              <h4 className="text-xl font-bold mb-1">Gift Card</h4>
                              <p className="text-green-200 text-sm">Claimed by you</p>
                            </div>

                            {/* Gift Card Details */}
                            <div className="relative z-10">
                              <div className="mb-4">
                                <div className="text-sm text-green-200 mb-1">Original Amount</div>
                                <div className="text-2xl font-bold mb-2">${giftCard.amount}</div>
                                <div className="text-sm text-green-200 mb-2">
                                  Remaining: <span className="font-bold text-lg">${giftCard.available}</span>
                                </div>
                                <div className="font-mono text-sm bg-white/20 rounded px-3 py-2">
                                  {giftCard.code}
                                </div>
                              </div>

                              <div className="text-sm text-green-200">
                                Claimed:{" "}
                                {new Date(
                                  giftCard.claimedAt?.seconds * 1000 ||
                                    giftCard.claimedAt ||
                                    giftCard.createdAt?.seconds * 1000 ||
                                    giftCard.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Gift Cards */}
                  {giftCards.filter(card => card.type === "created").length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        Created Gift Cards ({giftCards.filter(card => card.type === "created").length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {giftCards.filter(card => card.type === "created").map((giftCard, index) => (
                          <div
                            key={giftCard.id || index}
                            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden"
                          >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                            {/* Gift Card Header */}
                            <div className="relative z-10 mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <GiftIcon className="w-8 h-8 text-white" />
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    giftCard.claimedBy 
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {giftCard.claimedBy 
                                    ? "Claimed":
                                    "Available"}
                                </div>
                              </div>
                              <h4 className="text-xl font-bold mb-1">Gift Card</h4>
                              <p className="text-purple-200 text-sm">Created by you</p>
                            </div>

                            {/* Gift Card Details */}
                            <div className="relative z-10">
                              <div className="mb-4">
                                <div className="text-3xl font-bold mb-2">${giftCard.amount}</div>
                                {giftCard.claimedBy && giftCard.claimedBy !== giftCard.createdBy && (
                                  <div className="text-sm text-purple-200 mb-2">
                                    Remaining: ${giftCard.available || giftCard.amount}
                                  </div>
                                )}
                                <div className="font-mono text-sm bg-white/20 rounded px-3 py-2">
                                  {giftCard.code}
                                </div>
                              </div>

                              <div className="text-sm text-purple-200">
                                Created:{" "}
                                {new Date(
                                  giftCard.createdAt?.seconds * 1000 ||
                                    giftCard.createdAt
                                ).toLocaleDateString()}
                              </div>
                              {giftCard.claimedBy && giftCard.claimedBy !== giftCard.createdBy && (
                                <div className="text-sm text-purple-200 mt-1">
                                  Claimed:{" "}
                                  {new Date(
                                    giftCard.claimedAt?.seconds * 1000 ||
                                      giftCard.claimedAt
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GiftIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No gift cards found
                  </h4>
                  <p className="text-gray-600 mb-6">
                    You haven't created or received any gift cards yet. Buy one
                    for yourself or someone special!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowBuyGiftCard(true)}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Buy a Gift Card
                    </button>
                    <button
                      onClick={() => setShowAddGiftCard(true)}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Gift Card
                    </button>
                  </div>
                </div>
              )}
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
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 bg-logo-red text-white font-medium rounded-lg hover:bg-logo-red/90 transition-colors"
                  >
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

            {/* Add Gift Card Modal */}
            {showAddGiftCard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Add Gift Card
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddGiftCard(false);
                        setGiftCardCode("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Enter Gift Card Code
                    </label>
                    <input
                      type="text"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                      placeholder="Enter 16-digit gift card code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-red focus:border-transparent font-mono text-center tracking-wider"
                      maxLength={16}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Gift card codes are 16 characters long and case-sensitive
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddGiftCard(false);
                        setGiftCardCode("");
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addGiftCard(giftCardCode)}
                      disabled={!giftCardCode.trim() || giftCardCode.length !== 16}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Gift Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gift Card Amount Selection Modal */}
            {showBuyGiftCard && !stripeOptions && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Buy a Gift Card
                    </h3>
                    <button
                      onClick={() => setShowBuyGiftCard(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[25, 50, 100, 200].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setGiftCardAmount(amount)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            giftCardAmount === amount
                              ? "border-logo-red bg-red-50 text-logo-red"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-xl font-bold">${amount}</div>
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-gray-600 mb-2">
                        Or enter custom amount:
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min="10"
                          max="1000"
                          value={giftCardAmount}
                          onChange={(e) =>
                            setGiftCardAmount(Number(e.target.value))
                          }
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-red focus:border-transparent"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBuyGiftCard(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => buyGiftCard(giftCardAmount)}
                      disabled={stripeLoading || giftCardAmount < 10}
                      className="flex-1 whitespace-nowrap px-6 py-3 bg-logo-red text-white rounded-lg hover:bg-logo-red/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {stripeLoading
                        ? "Processing..."
                        : `Continue with $${giftCardAmount}`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stripe Payment Modal for Gift Card */}
            {stripeOptions && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <GiftCardPaymentForm
                  stripeOptions={stripeOptions}
                  onSuccess={() => {
                    fetchGiftCards(); // Refresh gift cards list
                    setStripeOptions(null);
                  }}
                  onClose={() => {
                    setStripeOptions(null);
                    setShowBuyGiftCard(false);
                  }}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </Elements>
  );
}
