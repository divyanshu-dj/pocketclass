import stripe from "../../utils/stripe";
import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";

export default async function (req, res) {
  try {
    console.log("Processing bookings for payment transfer:");
    const bookingsRef = collection(db, "Bookings");
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = [];
    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();
      if (
        moment.utc(booking.startTime).isBefore(moment.utc()) &&
        !booking.isTransfered
      ) {
        bookings.push({ id: doc.id, ...booking });
      }
    });

    const results = [];

    for (const booking of bookings) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          booking.paymentIntentId
        );
        if (!paymentIntent) {
          console.warn(
            `No charges found for PaymentIntent ID: ${booking.paymentIntentId}`
          );
          results.push({
            bookingId: booking.id,
            status: "failed",
            reason: "PaymentIntent not found",
          });
          continue;
        }

        let transferAmount = paymentIntent.amount * 1;
        if (booking.paymentMethod === "Package"){
          transferAmount = booking.price*100;
        }
        const instructorId = booking.instructor_id;
        const Instructor = await getDoc(doc(db, "Users", instructorId));
        const instructor = Instructor.data();
        if (!transferAmount || transferAmount <= 0) {
          console.warn(`Invalid transfer amount for booking ID: ${booking.id}`);
          results.push({
            bookingId: booking.id,
            status: "failed",
            reason: "Invalid transfer amount",
          });
          continue;
        }
        if (!instructor) {
          console.warn(`Instructor not found for ID: ${instructorId}`);
          results.push({
            bookingId: booking.id,
            status: "failed",
            reason: "Instructor not found",
          });
          continue;
        }
        if (!instructor.stripeAccountId) {
          console.warn(`Instructor has no Stripe account for ID: ${instructorId}`);
          results.push({
            bookingId: booking.id,
            status: "failed",
            reason: "No Stripe account",
          });
          continue;
        }

        const stripeAccountId = instructor.stripeAccountId;
        const transfer = await stripe.transfers.create({
          amount: transferAmount,
          currency: "cad",
          destination: stripeAccountId,
          metadata:{
            bookingId: booking.id,
            paymentIntentId: booking.paymentIntentId, // <-- reference the PaymentIntent
          },
        });

        await updateDoc(doc(db, "Bookings", booking.id), {
          isTransfered: true,
        });

        await addDoc(collection(db, "Transfers"), {
          bookingId: booking.id,
          amount: transferAmount,
          createdAt: new Date(),
          ...booking,
          transferId: transfer.id,
        });

        results.push({
          bookingId: booking.id,
          status: "success",
        });
      } catch (error) {
        console.error(`Error processing booking ID: ${booking.id}`, error);
        results.push({
          bookingId: booking.id,
          status: "failed",
          reason: error.message,
        });
        continue;
      }
    }

    console.log("Payment transfer process completed");
    return res.status(200).json({
      message: "Payment transfer process completed",
      results,
    });
  } catch (error) {
    console.error("Error transferring payment:", error);
    return res.status(500).json({ error: "Error transferring payment" });
  }
}
