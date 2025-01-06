import stripe from "../../utils/stripe";
import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import moment from "moment";
import { message } from "antd";

export default async function (req, res) {
  try {
    const { payment, refundReason } = req.body;

    if (!payment) {
      return res.status(400).json({ error: "Payment Details are required" });
    }

    for (let i = 0; i < payment.length; i++) {
      const { bookingId, paymentIntentId } = payment[i];
      if (!bookingId) {
        continue;
      }
      if (!paymentIntentId) {
        continue;
      }

      const bookingRef = doc(db, "Bookings", bookingId);
      const booking = await getDoc(bookingRef);
      const bookingData = booking.data();

      const start_time = moment.utc(bookingData.startTime);
      const now = moment.utc();
      if (start_time.diff(now, "hours") < 24) {
        return res
          .status(400)
          .json({
            error: "Refund is not allowed within 24 hours of class start time",
          });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      if (!paymentIntent) {
        continue;
      }
      const refundAmount = paymentIntent.amount * 0.95;
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: refundAmount,
        reason: "requested_by_customer",
      });

      if (!refund) {
        continue;
      }
      await deleteDoc(bookingRef);
      await addDoc(collection(db, "Refunds"), {
        bookingId,
        amount: refundAmount,
        reason: refundReason,
        createdAt: new Date(),
        ...bookingData,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
    });
  } catch (error) {
    console.error("Error initiating refund:", error);
    res.status(500).json({ error: "Error initiating refund" });
  }
}
