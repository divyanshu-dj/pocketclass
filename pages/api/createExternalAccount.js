// pages/api/createExternalAccount.js
import stripe from "../../utils/stripe";
const createStripeAccount = async (email) => {
  const account = await stripe.accounts.create({
    type: 'standard',
    country: "CA",
    email: email,
  });
  return account;
};
const generateOnboardingLink = async (accountId) => {
  let url = !(process.env.NODE_ENV === 'DEV') ? 'https://pocketclass.ca/stripeAdded' : 'https://pocketclass.ca/stripeAdded';
  let refreshUrl = !(process.env.NODE_ENV === 'DEV') ? 'https://pocketclass.ca/stripeRefresh' : 'https://pocketclass.ca/stripeRefresh';
  const loginLink = await stripe.accountLinks.create(
    {account:accountId,
    
      return_url: url,
      type: 'account_onboarding',
      
      refresh_url: refreshUrl,
    }

  );
  //set payout schedule to manual
  await stripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          interval: 'manual',
        },
      },
    },
  });

  const finalLink=  loginLink.url
  return finalLink;
};
export default async function handler(req, res) {
  

  // Create a Stripe account for the user
  const stripeAccount = await createStripeAccount(req.body.email);
  //save the stripe account id to the user
  
  // Generate onboarding link
  const onboardingLink = await generateOnboardingLink(stripeAccount.id);
  // Send the onboarding link to the client
  res.json(onboardingLink );
}
