import stripe from "../../utils/stripe";
export default async function getPayouts(req, res) {
  try {
    const payouts = await stripe.payouts.list(
      {
        limit: 10,
      },
      {
        stripeAccount: req.body.accountId || "",
      }
    );
    // decrement date 1 day for each payout to avoid same day payouts
    const payoutsWithDates = payouts.data.map((payout) => {
      const date = new Date(payout.created * 1000);
      date.setDate(date.getDate() - 1);
      return {
        ...payout,
        amount: payout.amount / 100,
        created: date,
      };
    });

    // sort payouts by date ascending
    payoutsWithDates.sort((a, b) => {
      return new Date(a.created) - new Date(b.created);
    });
    res.status(200).json(payoutsWithDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get payouts" });
  }
}
