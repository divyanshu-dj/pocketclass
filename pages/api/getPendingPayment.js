import stripe from "../../utils/stripe";

export default async function getPendingPayment(req, res) {
  try {
    const { paymentIntentIds } = req.body;

    // Validate input
    if (!Array.isArray(paymentIntentIds) || paymentIntentIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing paymentIntentIds" });
    }

    // Retrieve payment intents
    const results = await Promise.all(
      paymentIntentIds.map(async (paymentIntentId) => {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          return {paymentIntent };
        } catch (error) {
          console.error(`Error fetching payment intent ${paymentIntentId}:`, error.message);
          return { paymentIntentId, error: error.message };
        }
      })
    );

    // Separate successful and failed retrievals
    const success = results.filter((result) => result.paymentIntent);
    const failed = results.filter((result) => result.error);

    res.status(200).json(success);
  } catch (error) {
    console.error("Error fetching payment intents:", error);
    res.status(500).json({ error: "Failed to fetch payment intents" });
  }
}
