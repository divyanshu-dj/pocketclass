const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function (req, res) {
	try {
		const { uid, uEmail, uName, classId, insId, price } = req.body;
		const paymentIntent = await stripe.paymentIntents.create({
			amount: price,
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
			metadata: {
				price: price,
				customer_id: uid,
				customer_name: uName,
				customer_email: uEmail,
				instructor_id: insId,
				class_id: classId,
			},
		});

		res.status(200).json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error("Error creating Stripe session:", error);
		res.status(500).json({ error: "Error creating Stripe session" });
	}
}
