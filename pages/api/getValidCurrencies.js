import stripe from '../../utils/stripe';

async function getAccountList() {
    try {
        const accounts = await stripe.accounts.list();
       // remove restricted accounts
         const filteredAccounts = accounts.data.filter((account) => {
            return (
                account.details_submitted === true &&
                account.charges_enabled === true &&
                account.payouts_enabled === true
            );
        }
        );



        return filteredAccounts;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const accounts = await getAccountList();
            const validCurrency=accounts.map((account)=>{return account.default_currency})
            res.status(200).json(validCurrency);
        } 
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get accounts' });
    }
}
