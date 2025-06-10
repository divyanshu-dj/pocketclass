// pages/api/payment.js
import { Stripe } from 'stripe';
const stripe = new Stripe('sk_test_51R8gqeCQh7zMEt74ODucNeLIb4yoCbMjMktHMZKsmyGmmiKAcSzTGmwlnP2GcoXvWQvQxDqlRz4JJ08c4xgkdNvP00O9CX9Cjf'
  );
  export default stripe;