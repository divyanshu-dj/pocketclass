import stripe from "../../utils/stripe";
const generateOnboardingLink = async (accountId) => {
    let url = process.env.NODE_ENV === 'production' ? 'https://pocketclass.ca/stripeAdded' : 'http://localhost:3000/stripeAdded';
  
    const loginLink = await stripe.accountLinks.create(
      {account:accountId,
      
        return_url: url,
        type: 'account_onboarding',
        
        refresh_url: url,
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
    
  
//This endpoint is called when the stripe  onboarding lin
    //save the stripe account id to the user
        const { accountId } = req.body;
    // Generate onboarding link
    const onboardingLink = await generateOnboardingLink(accountId);
    // Send the onboarding link to the client
    res.json(onboardingLink );
  }