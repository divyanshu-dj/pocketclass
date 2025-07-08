import stripe from "../../utils/stripe";
export default async function (req, res) {
  try {
    const { uid, uEmail, uName, classId, insId, price } = req.body;

    // Create or retrieve Stripe customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: uEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: uEmail,
          name: uName,
          metadata: {
            firebase_uid: uid,
          },
        });
      }
    } catch (error) {
      console.error("Error creating/retrieving customer:", error);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "cad",
      customer: customer?.id, // Add customer to PaymentIntent,
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: "on_session", // This saves the payment method
      metadata: {
        price: price,
        customer_id: uid,
        customer_name: uName,
        customer_email: uEmail,
        instructor_id: insId,
        class_id: classId,
      },
    });
    const customerSession = await stripe.customerSessions.create({
      customer: customer?.id,
      components: {
        payment_element: {
          enabled: true,
          features: {
            payment_method_redisplay: "enabled",
			payment_method_allow_redisplay_filters: ['always', 'limited', 'unspecified'],
            payment_method_save: "enabled",
            payment_method_save_usage: "off_session", // Can be on_session if interactive
            payment_method_remove: "enabled",
          },
        },
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer?.id,
	  customerSessionSecret: customerSession.client_secret,
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Error creating Stripe session" });
  }
}
