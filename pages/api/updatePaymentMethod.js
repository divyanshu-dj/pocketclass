// // const paymentMethod = await stripe.paymentMethods.update(
//   '{{PAYMENT_METHOD_ID}}',
//   {
//     allow_redisplay: 'always',
//   }
// );

import stripe from '../../utils/stripe';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID and customer ID are required' });
    }

    // Update the payment method to allow redisplay
    const updatedPaymentMethod = await stripe.paymentMethods.update(paymentMethodId, {
      allow_redisplay: 'always',
    });

    res.status(200).json({
      success: true,
      paymentMethod: updatedPaymentMethod,
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ success: false, error: 'Failed to update payment method' });
  }
}