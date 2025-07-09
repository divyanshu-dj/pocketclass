import stripe from "../../utils/stripe";

export default async function handler(req, res) {
  const { customerId, email } = req.body;

  if (!customerId && !email) {
    return res.status(400).json({ error: "Customer ID or email is required" });
  }

  try {
    let customer;

    if (customerId) {
      // Fetch existing customer
      customer = await stripe.customers.retrieve(customerId);
    } else {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email,
        });
      }
    }

    // Create a SetupIntent to save a card
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error creating SetupIntent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
