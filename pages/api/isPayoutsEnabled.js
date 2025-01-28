import stripe from "../../utils/stripe";

export default async function isPayoutsEnabled(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    try {
      const { accountId } = req.body;

      // Check if the accountId is present
      if (!accountId) {
        return res.status(400).json({ error: 'Account ID is required' });
      }
  
      // Retrieve the account details from Stripe
      const account = await stripe.accounts.retrieve(accountId);
  
      // Respond with payouts enabled status
      res.status(200).json({ payouts_enabled: account.payouts_enabled });
    } catch (error) {
      console.error('Error checking payouts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }