import Stripe from 'stripe';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subscription ID and User ID are required' 
      });
    }

    console.log('Reactivating subscription:', subscriptionId);

    // Reactivate the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    console.log('Stripe subscription reactivated:', subscription.id);

    // Update Firestore to reflect the reactivation
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscriptionWillCancel: false,
      updatedAt: new Date()
    });

    console.log('Updated Firestore for user:', userId);

    res.status(200).json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end
      }
    });

  } catch (error) {
    console.error('Error reactivating subscription:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription or already active'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription'
    });
  }
}
