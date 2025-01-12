import stripe from "../../utils/stripe";

export default async function getPendingPayment(req, res) {
  try {
    const { paymentIntentIds } = req.body;

    if (!Array.isArray(paymentIntentIds) || paymentIntentIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing paymentIntentIds" });
    }

    const paymentIntents = await Promise.all(
      paymentIntentIds.map((paymentIntentId) =>
        stripe.paymentIntents.retrieve(paymentIntentId)
      )
    );

    res.status(200).json({ paymentIntents });
  } catch (error) {
    console.error("Error fetching payment intents:", error);
    res.status(500).json({ error: "Failed to fetch payment intents" });
  }
}
