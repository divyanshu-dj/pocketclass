import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { CancellationPolicy } from "../../components/CancellationPackagePolicy";
import { ConfirmBookingDetails } from "../../components/ConfirmPackageDetails";
import { BookingSuccess } from "../../components/BookingSuccess";
import NewHeader from "../../components/NewHeader";
import Footer from "../../components/Footer";

export default function PaymentSuccess() {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      setId(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {

        if (!id) {
          console.error("Booking ID is undefined.");
          return;
        }

        const docRef = doc(db, "Packages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBookingDetails(docSnap.data());
        } else {
          console.error("No document found with the given ID.");
          setError("No booking details found.");
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message);
      }
    };

    if (id) fetchBookingDetails();
  }, [id]);

  return (
    <div className="flex overflow-hidden relative flex-col min-h-screen bg-white">
      <div className="flex relative flex-col items-center w-full">
        <div className="absolute opacity-30 pointer-events-none bg-[40px_40px] bg-[radial-gradient(circle,#FFE4E1_2px,transparent_2px)] size-full" />
        <BookingSuccess />
        <div className="mx-0 my-12 w-full h-px bg-black bg-opacity-10 max-w-[1191px]" />
        <div className="px-16 py-0 mb-16 w-full max-w-[1183px] max-md:px-8 max-md:py-0 max-sm:px-4 max-sm:py-0">
          <div className="flex gap-14 max-md:flex-col">
            <ConfirmBookingDetails bookingDetails={bookingDetails} />
            <CancellationPolicy bookingDetails={bookingDetails} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
