import stripe from '../../utils/stripe';

async function anyPendingBanks() {
    try {
       
        const accounts = await stripe.accounts.list({ limit: 100 });
        
        for (const account of accounts.data) {
            if (account.external_accounts) {
                for (const bankAccount of account.external_accounts.data) {
                    if (bankAccount.status === 'pending') {
                        return true;
                    }
                }
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error retrieving Stripe accounts:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    try {
        const anyPending = await anyPendingBanks();
        res.status(200).json({ anyPending });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve pending bank accounts' });
    }
}
