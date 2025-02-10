import * as React from "react";
import moment from "moment";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export function ConfirmBookingDetails({ bookingDetails }) {
  // Get Class Details
  const [classDetails, setClassDetails] = React.useState(null);
  React.useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const docRef = doc(db, "classes", bookingDetails?.class_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setClassDetails(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log(bookingDetails);
    fetchClassDetails();
  }, [bookingDetails]);
  return (
    <div className="w-[39%] max-md:w-full">
      <div>
        <h2 className="mb-6 text-2xl font-bold leading-8 text-stone-800">
          Your package details
        </h2>
        <div className="flex gap-6">
          <div>
            <div className="text-base font-medium text-stone-800">
              Class Name: {classDetails?.Name}
            </div>
            <div className="text-base font-medium text-stone-800">
              Sessions Included: {bookingDetails?.num_sessions}
            </div>
            <div className="text-base text-stone-800">
              Package Price: {bookingDetails?.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
