import stripe from "../../utils/stripe";
import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import moment from "moment";

export default async function (req, res) {
  try {
    console.log("Processing bookings for payment transfer:");
    const bookingsRef = collection(db, "Bookings");
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = [];

    bookingsSnapshot.forEach((docSnap) => {
      const booking = docSnap.data();
      if (
        moment.utc(booking.startTime).isBefore(moment.utc()) &&
        !booking.isTransfered
      ) {
        bookings.push({ id: docSnap.id, ...booking });
      }
    });

    const results = [];

    for (const booking of bookings) {
      try {
        const instructorId = booking.instructor_id;
        const InstructorDoc = await getDoc(doc(db, "Users", instructorId));
        const instructor = InstructorDoc.data();

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

        // Determine transfer amount
        let transferAmount = booking.price && booking.price > 0 ? booking.price * 100 : 0;

        if (!transferAmount || transferAmount <= 0) {
          console.warn(`Invalid transfer amount for booking ID: ${booking.id}`);
          results.push({
            bookingId: booking.id,
            status: "failed",
            reason: "Invalid transfer amount",
          });
          continue;
        }

        const metadata = {
          bookingId: booking.id,
          paymentMethod: booking.paymentMethod || "Stripe", // default to Stripe if undefined
        };

        // If it's a Stripe payment, retrieve and validate the PaymentIntent
        if (booking.paymentMethod !== "Giftcard") {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            booking.paymentIntentId
          );

          if (!paymentIntent) {
            console.warn(
              `No PaymentIntent found for ID: ${booking.paymentIntentId}`
            );
            results.push({
              bookingId: booking.id,
              status: "failed",
              reason: "PaymentIntent not found",
            });
            continue;
          }

          metadata.paymentIntentId = booking.paymentIntentId;
        }

        // Perform transfer
        const transfer = await stripe.transfers.create({
          amount: transferAmount,
          currency: "cad",
          destination: instructor.stripeAccountId,
          metadata,
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
          price: booking.price,
          transferId: transfer.id,
          status: "success",
          booking: booking,
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
