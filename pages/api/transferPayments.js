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

    for (const booking of bookings) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        booking.paymentIntentId
      );
      if (!paymentIntent) {
        return res.status(404).json({
          error: "No charges found for the specified PaymentIntent ID",
        });
      }
      const transferAmount = paymentIntent.amount * 1;
      const instructorId = booking.instructor_id;
      const Instructor = await getDoc(doc(db, "Users", instructorId));
      const instructor = Instructor.data();
      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }
      if (!instructor.stripeAccountId) {
        return res
          .status(404)
          .json({ error: "Instructor has no Stripe account" });
      }
      const stripeAccountId = instructor.stripeAccountId;
      const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: "usd",
        destination: stripeAccountId,
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
    }
    return res
      .status(200)
      .json({ message: "Payment transferred successfully" });
  } catch (error) {
    console.error("Error transferring payment:", error);
    return res.status(500).json({ error: "Error transferring payment" });
  }
}
