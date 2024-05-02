
import stripe from "../../utils/stripe";
async function getBalanceObj(uid) {

  return await stripe.balance.retrieve({
    stripeAccount: uid,
  });

}
export default async function handler(req, res) {
  try {
    const balance = await getBalanceObj(req.body.accountId);

    res.status(200).json({...balance});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get balance" });
  }
}