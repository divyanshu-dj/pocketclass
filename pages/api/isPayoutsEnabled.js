import stripe from "../../utils/stripe";

  export default async function handler(req, res) {
    
  
    //check if the accountId is present
        const { accountId } = req.body;
        //check if account has payouts enabled
        const account = await stripe.accounts.retrieve(accountId);
        if(account.payouts_enabled){
            res.json({payouts_enabled:true})
        }
        else{
            res.json({payouts_enabled:false})
        }
  }