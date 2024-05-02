// pages/api/payment.js
import { Stripe } from 'stripe';
console.log(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
  );
  export default stripe;