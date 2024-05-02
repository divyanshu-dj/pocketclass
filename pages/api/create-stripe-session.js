import stripe from '../../utils/stripe';;
export default async function (req, res) {
	try {
		const { uid, uEmail, uName, classId, insId, price, } = req.body;
		console.log(price);
		// let application_fee_amount = price * 0.2;
		// //get the instructor's stripe account from the database
		//  const instructor = await getDoc(doc(db, 'Users', insId));
		//  const instructorData = instructor.data();
		//  const instructorStripeAccountId = instructorData.stripeAccountId;
		const paymentIntent = await stripe.paymentIntents.create({
			amount: price * 100,
			currency: "cad",
			automatic_payment_methods: {
				enabled: true,
			},
			// transfer_data: {
			// 	destination: instructorStripeAccountId ,
			// 	amount: (price -application_fee_amount)*100,
			
			// },
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
