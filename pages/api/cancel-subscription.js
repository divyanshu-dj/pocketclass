import Stripe from 'stripe';
import { db } from '../../firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: 'Subscription ID is required' });
    }

    // Cancel the subscription at period end (so user keeps access until end of billing period)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user document
    if (userId) {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        subscriptionStatus: 'active', // Still active until period end
        subscriptionWillCancel: true,
        subscriptionCancelAt: new Date(subscription.current_period_end * 1000),
        updatedAt: serverTimestamp()
      });
    }

    console.log(`Scheduled cancellation for subscription ${subscriptionId} at period end`);

    res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of your current billing period',
      cancelAt: new Date(subscription.current_period_end * 1000)
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ 
      message: 'Failed to cancel subscription', 
      error: error.message 
    });
  }
}
