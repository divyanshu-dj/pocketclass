import stripe from '../../utils/stripe';

export default async function (req, res) {
    try {
        const { paymentIntentId } = req.body;


        if (!paymentIntentId) {
            return res.status(400).json({ error: "PaymentIntent ID is required" });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return res.status(404).json({ error: "No charges found for the specified PaymentIntent ID" });
        }

        res.status(200).json({
            success: true,
            paymentIntent,
        });
    } catch (error) {
        console.error("Error initiating refund:", error);
        res.status(500).json({ error: "Error initiating refund" });
    }
}
