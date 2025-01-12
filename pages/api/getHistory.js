import stripe from "../../utils/stripe";

export default async function handler(req, res) {
  const accountId = req.body.accountId;

  if (!accountId) {
    return res.status(400).json({ error: "Missing stripe account ID" });
  }

  try {
    const transactions = await stripe.balanceTransactions.list(
      {
        limit: 20,
      },
      {
        stripeAccount: accountId,
      }
    );

    res.status(200).json({ transactions: transactions.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction history" });
  }
}
