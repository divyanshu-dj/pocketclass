// Endpoint to fetch current stripe balance; Available and Pending
import stripe from '../../utils/stripe';

export default async function (req, res) {
    try {
        const balance = await stripe.balance.retrieve();
        res.status(200).json({
        available: balance.available,
        pending: balance.pending,
        });
    } catch (error) {
        console.error('Error fetching Stripe balance:', error);
        res.status(500).json({ error: 'Failed to fetch Stripe balance' });
    }
}