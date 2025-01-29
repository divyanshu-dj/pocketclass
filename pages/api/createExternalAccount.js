import stripe from "../../utils/stripe";

const createStripeAccount = async (email) => {
  return await stripe.accounts.create({
    type: "standard",
    country: "CA",
    email: email,
  });
};

const generateOnboardingLink = async (accountId) => {
  const url = "https://pocketclass.ca/stripeAdded";
  const refreshUrl = "https://pocketclass.ca/stripeRefresh";

  const loginLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: url,
    type: "account_onboarding",
    refresh_url: refreshUrl,
  });

  // Set payout schedule to manual
  await stripe.accounts.update(accountId, {
    settings: { payouts: { schedule: { interval: "manual" } } },
  });

  return loginLink.url;
};

export default async function handler(req, res) {
  try {
    const { email, accountId } = req.body;
    let stripeAccountId = accountId;

    if (!stripeAccountId) {
      const stripeAccount = await createStripeAccount(email);
      stripeAccountId = stripeAccount.id;
    } else {
      try {
        await stripe.accounts.retrieve(stripeAccountId);
      } catch (error) {
        const stripeAccount = await createStripeAccount(email);
        stripeAccountId = stripeAccount.id;
      }
    }

    const onboardingLink = await generateOnboardingLink(stripeAccountId);
    res.json({ accountId: stripeAccountId, onboardingLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
