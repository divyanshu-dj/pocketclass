import Stripe from "stripe";
import { db } from "../../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, userEmail, userName } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create or retrieve Stripe customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
          metadata: {
            firebase_uid: userId,
          },
        });
      }
    } catch (error) {
      console.error("Error creating/retrieving customer:", error);
      return res.status(500).json({ message: "Customer creation failed" });
    }

    // Check if user already has an active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    if (existingSubscriptions.data.length > 0) {
      return res
        .status(400)
        .json({ message: "User already has an active subscription" });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: "price_1Rmz9bAx0xW0obEdrprA5Juk",
        },
      ],
      payment_behavior: "default_incomplete",
      collection_method: "charge_automatically",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      trial_period_days: 30,
      trial_settings: {
        end_behavior: { missing_payment_method: "cancel" },
      },
      expand: ["pending_setup_intent"],
      metadata: {
        firebase_uid: userId,
        subscription_type: "premium_monthly",
      },
    });

    // Calculate trial end date
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);

    // Store subscription info in Firestore
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionWillCancel: false,
      subscriptionType: "premium_monthly",
      isPremium: true, // Grant premium access during trial
      premiumExpire: trialEnd,
      trialEnd: trialEnd,
      isTrialing: true,
      updatedAt: serverTimestamp(),
    });

    console.log(`Created trial subscription ${subscription.id} for user ${userId}, trial ends: ${trialEnd.toISOString()}`);
    res.status(200).json({
      clientSecret: subscription.pending_setup_intent?.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
      intentType: "setup",
      trialEnd: trialEnd.toISOString(),
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      message: "Subscription creation failed",
      error: error.message,
    });
  }
}
