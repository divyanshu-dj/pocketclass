import Stripe from 'stripe';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  console.log('Received webhook request:', req.method, req.url);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  
  if (timestamp.seconds && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  return null;
};

async function handleSubscriptionChange(subscription) {
  const userId = subscription.metadata?.firebase_uid;
  if (!userId) {
    console.error('No firebase_uid in subscription metadata');
    return;
  }

  const userRef = doc(db, 'Users', userId);
  
  // Calculate premium expiry (current period end)
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  console.log(`Updating subscription for user ${userId}, status: ${subscription.status}, expires: ${currentPeriodEnd.toISOString()}`);
  
  await updateDoc(userRef, {
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    premiumExpire: currentPeriodEnd,
    subscriptionCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
    subscriptionCurrentPeriodEnd: currentPeriodEnd,
    isPremium: subscription.status === 'active',
    updatedAt: serverTimestamp()
  });

  console.log(`Updated subscription for user ${userId}: status=${subscription.status}, expires=${currentPeriodEnd.toISOString()}`);
}

async function handleSuccessfulPayment(invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata?.firebase_uid;
  
  if (!userId) {
    console.error('No firebase_uid in subscription metadata');
    return;
  }

  const userRef = doc(db, 'Users', userId);

  console.log(`Processing successful payment for user ${userId}, amount: $${invoice.amount_paid / 100}`);
  
  // Extend premium expiry to next billing period
  console.log(`Current period end: ${subscription.current_period_end}`);
  console.log(`Next billing date: ${new Date(subscription.current_period_end * 1000).toISOString()}`);
  const nextBillingDate = new Date((subscription.current_period_end) * 1000);
  
  await updateDoc(userRef, {
    premiumExpire: nextBillingDate,
    subscriptionStatus: 'active',
    isPremium: true,
    lastPaymentAt: serverTimestamp(),
    lastPaymentAmount: invoice.amount_paid / 100, // Convert from cents
    subscriptionCurrentPeriodEnd: nextBillingDate,
    updatedAt: serverTimestamp()
  });

  console.log(`Premium renewed for user ${userId} until ${nextBillingDate.toISOString()}, amount: $${invoice.amount_paid / 100}`);
}

async function handleFailedPayment(invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata?.firebase_uid;
  
  if (!userId) {
    console.error('No firebase_uid in subscription metadata');
    return;
  }

  const userRef = doc(db, 'Users', userId);
  
  await updateDoc(userRef, {
    subscriptionStatus: 'past_due',
    lastFailedPaymentAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  console.log(`Payment failed for user ${userId}, subscription status: past_due`);
}

async function handleSubscriptionCanceled(subscription) {
  const userId = subscription.metadata?.firebase_uid;
  if (!userId) {
    console.error('No firebase_uid in subscription metadata');
    return;
  }

  const userRef = doc(db, 'Users', userId);
  
  // Keep premium until current period ends
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const today = new Date();
  
  await updateDoc(userRef, {
    subscriptionStatus: 'canceled',
    subscriptionCanceledAt: serverTimestamp(),
    isPremium: currentPeriodEnd > today, // Keep premium if still in current period
    updatedAt: serverTimestamp()
  });

  console.log(`Subscription canceled for user ${userId}, premium until ${currentPeriodEnd.toISOString()}`);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
