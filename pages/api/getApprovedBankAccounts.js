import stripe from '../../utils/stripe';


// Function to retrieve the bank accounts by connected account ID
async function getBankAccountsByConnectedAccountId(connectedAccountId) {
    if (!connectedAccountId) {
        throw new Error('Connected account ID is required');
    }
    try {
        const bankAccounts = await stripe.accounts.listExternalAccounts(
            connectedAccountId,
            { object: 'bank_account' }
        );
        return bankAccounts;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default async function handler(req, res) {
    try {
        const bankAccounts = await getBankAccountsByConnectedAccountId(req.body.connectedAccountId);
    
        res.status(200).json(bankAccounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get bank accounts' });
    }
}
