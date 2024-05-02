import stripe from "../../utils/stripe";
// Import any necessary modules or libraries

// Define your API endpoint

export default async function makePayoutToClient(req, res) {
  // Retrieve the balance from the request body
  const { balance,account,currency } = req.body;
  console.log(req.body);

  // Perform any necessary validation or checks on the balance

  // Make the payout to the client using the balance
  // Replace this with your actual payout logic
  const payoutResult = await makePayout(balance,account,currency);
 if(payoutResult==='insufficient balance'){
        res.status(400).json({ result: 'insufficient balance' });
    }
  // Return the payout result as the response
  else{
  res.status(200).json({ result: payoutResult });
  }
}

// Define your payout logic function
async function  makePayout(balance,account,currency) {
  // Replace this with your actual payout logic
  // For example, you can deduct the balance from the client's account
  // and transfer it to their preferred payment method
  // Return the result of the payout
  // payout to client account bank account
    //check if account has enough balance
    try{
    const balanceObj = await stripe.balance.retrieve({
        stripeAccount: account,
      });
    
      if(balanceObj.available[0].amount/100<balance){
            return 'insufficient balance';
      }
      console.log(balanceObj)
   const payout= await stripe.payouts.create({
    amount: balance*100, // Amount in cents
    currency: currency,
    
   },
   {
         stripeAccount: account,
   }
   );
    
   
    return payout;
}
catch(error){
    
    return 'insufficient balance';
}
}
