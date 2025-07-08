// Function to get saved cards from the database using either the user's email or customer ID
import { collection, query, where, getDocs } from "firebase/firestore";
import stripe from "../../utils/stripe";

export default async function handler(req, res) {
  const { email, customerId } = req.query;

  if (!email && !customerId) {
    return res.status(400).json({ error: "Email or Customer ID is required" });
  }

  try {
    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });
      customer = customers.data[0];
    }

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    res.status(200).json(paymentMethods.data);
  } catch (error) {
    console.error("Error fetching saved cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
