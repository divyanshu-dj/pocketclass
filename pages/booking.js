"use client";

import React, { useState, useEffect } from "react";
import { Chevron, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useAuthState } from "react-firebase-hooks/auth";
import { use } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { set } from "date-fns";
import Header from "../components/Header";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function index() {
  const router = useRouter();
  const { instructorId, classId } = router.query;
  const [timer, setTimer] = useState(null);
  const [classData, setClassData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState({
    generalAvailability: [],
    adjustedAvailability: [],
  });
  const [mode, setMode] = useState("Individual");
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [stripeOptions, setStripeOptions] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [user, userLoading] = useAuthState(auth);
  const studentId = user?.uid;
  const studentName = user?.displayName;
  const today = new Date();
  const [daysWithNoSlots, setDaysWithNoSlots] = useState([]);
  const [minDays, setMinDays] = useState(0);
  const [maxDays, setMaxDays] = useState(30);

  useEffect(() => {
    if (classId) {
      const docRef = doc(db, "classes", classId);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setClassData(docSnap.data());
        }
      });
    }
  }, [classId]);
  const hasSlots = (date, schedule, bookedSlots, appointmentDuration, mode) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    var { generalAvailability, adjustedAvailability } = schedule;
    const dayName = moment(date).format("dddd");

    if (mode === "Individual") {
      generalAvailability = generalAvailability.map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => !slot.classId),
      }));

      adjustedAvailability = adjustedAvailability.map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => !slot.classId),
      }));
    } else if (mode === "Group") {
      generalAvailability = generalAvailability.map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => slot.classId === classId),
      }));

      adjustedAvailability = adjustedAvailability.map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => slot.classId === classId),
      }));
    }

    const adjustedDay = adjustedAvailability.find(
      (day) => day.date === dateStr
    );
    if (adjustedDay && adjustedDay.slots.length == 0) return false;
    else if (adjustedDay && adjustedDay.slots.length > 0) {
      return adjustedDay.slots.some((slot) => {
        const slotStart = moment(slot.startTime, "HH:mm");
        const slotEnd = moment(slot.endTime, "HH:mm");
        while (slotStart.isBefore(slotEnd)) {
          const nextSlot = slotStart
            .clone()
            .add(appointmentDuration, "minutes");
          if (
            !bookedSlots.some(
              (booked) =>
                booked.date === dateStr &&
                moment(booked.startTime, "HH:mm").isSame(slotStart)
            )
          ) {
            return true;
          } else if (
            bookedSlots.some(
              (booked) =>
                booked.date === dateStr &&
                moment(booked.startTime, "HH:mm").isSame(slotStart) &&
                booked.classId === classId
            ).length < classData?.groupSize &&
            mode === "Group"
          ) {
            return true;
          }
          slotStart.add(appointmentDuration, "minutes");
        }
        return false;
      });
    }
    const generalDay = generalAvailability.find((day) => day.day === dayName);
    if (generalDay && generalDay.slots.length == 0) return false;
    if (!generalDay) return false;
    if (generalDay && generalDay.slots.length > 0) {
      return generalDay.slots.some((slot) => {
        const slotStart = moment(slot.startTime, "HH:mm");
        const slotEnd = moment(slot.endTime, "HH:mm");
        while (slotStart.isBefore(slotEnd)) {
          const nextSlot = slotStart
            .clone()
            .add(appointmentDuration, "minutes");
          if (
            !bookedSlots.some(
              (booked) =>
                booked.date === dateStr &&
                moment(booked.startTime, "HH:mm").isSame(slotStart)
            )
          ) {
            return true;
          } else if (
            bookedSlots.some(
              (booked) =>
                booked.date === dateStr &&
                moment(booked.startTime, "HH:mm").isSame(slotStart) &&
                booked.classId === classId
            ).length < classData?.groupSize &&
            mode === "Group"
          ) {
            return true;
          }
          slotStart.add(appointmentDuration, "minutes");
        }
        return false;
      });
    }

    return false;
  };

  useEffect(() => {
    const daysToCheck = [];
    for (let i = minDays; i < maxDays; i++) {
      const date = moment(today).add(i, "days").toDate();
      if (!hasSlots(date, schedule, bookedSlots, appointmentDuration, mode)) {
        daysToCheck.push(date);
      }
    }
    setDaysWithNoSlots(daysToCheck);
  }, [schedule, bookedSlots, appointmentDuration, mode, classData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId || !classId) return;
      const docRef = doc(db, "Schedule", instructorId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSchedule({
          generalAvailability: data.generalAvailability || [],
          adjustedAvailability: data.adjustedAvailability || [],
        });
        setMinDays(data.minDays || 0);
        setMaxDays(data.maxDays || 30);
        setAppointmentDuration(data.appointmentDuration || 30);
        const date = moment(today).add(data.minDays, "days");
        setSelectedDate(new Date(date));
      }

      const now = moment.utc();
      const bookingsQuery = query(
        collection(db, "Bookings"),
        where("instructor_id", "==", instructorId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);

      const validBookings = [];
      bookingsSnapshot.forEach(async (docSnapshot) => {
        const booking = docSnapshot.data();
        const bookingRef = docSnapshot.ref;

        const bookingStartTime = moment.utc(booking.startTime); // Convert to UTC
        const bookingExpiry = booking.expiry
          ? moment.utc(booking.expiry)
          : null;

        if (
          booking.status === "Pending" &&
          bookingExpiry &&
          bookingExpiry.isBefore(now)
        ) {
          await deleteDoc(bookingRef);
        } else {
          validBookings.push({
            startTime: bookingStartTime.format("HH:mm"),
            endTime: moment.utc(booking.endTime).format("HH:mm"),
            date: bookingStartTime.format("YYYY-MM-DD"),
          });
        }
      });

      setBookedSlots(validBookings);
    };

    fetchData();
  }, [instructorId, classId]);

  // Generate slots
  useEffect(() => {
    const generateSlots = () => {
      const { generalAvailability, adjustedAvailability } = schedule;
      const minDate = moment().add(minDays, "days").startOf("day");
      const maxDate = moment().add(maxDays, "days").endOf("day");
      const startDate = moment(selectedDate).startOf("day");
      var endDate = startDate.clone().add(2, "days").endOf("day");

      if (startDate.isBefore(minDate) || startDate.isAfter(maxDate)) {
        setGroupedSlots([]);
        return;
      }

      let slots = [];

      for (
        let currentDate = startDate.clone();
        currentDate.isBefore(endDate);
        currentDate.add(1, "day")
      ) {
        const dateStr = currentDate.format("YYYY-MM-DD");
        const adjustedDay = adjustedAvailability.find(
          (day) => day.date === dateStr
        );

        if (adjustedDay) {
          adjustedDay.slots.forEach((slot) =>
            slots.push(
              ...splitSlots(slot.startTime, slot.endTime, dateStr, slot.classId)
            )
          );

        } else {
          const dayName = currentDate.format("dddd");
          const generalDay = generalAvailability.find(
            (day) => day.day === dayName
          );
          if (generalDay) {
            generalDay.slots.forEach((slot) =>
              slots.push(
                ...splitSlots(
                  slot.startTime,
                  slot.endTime,
                  dateStr,
                  slot.classId
                )
              )
            );
          }
        }
      }

      if (mode === "Individual") {
        slots = slots.filter((slot) => !slot.classId);
      } else if (mode === "Group") {
        slots = slots.filter((slot) => slot.classId === classId);
      }

      setGroupedSlots(slots); // Directly set slots for the next 3 days
    };

    const splitSlots = (start, end, dateStr, classId) => {
      const slotStart = moment.utc(start, "HH:mm"); // Normalize start to UTC
      const slotEnd = moment.utc(end, "HH:mm"); // Normalize end to UTC
      const slots = [];

      while (slotStart.isBefore(slotEnd)) {
        const nextSlot = slotStart.clone().add(appointmentDuration, "minutes");
        if (nextSlot.isAfter(slotEnd)) break;

        const bookingsForSlot = bookedSlots.filter(
          (booked) =>
            booked.date === dateStr &&
            moment.utc(booked.startTime, "HH:mm").isSame(slotStart)
        );

        const isBooked = bookingsForSlot.length > 0;

        if (
          !isBooked ||
          (mode === "Group" && bookingsForSlot.length < classData.groupSize)
        ) {
          slots.push({
            startTime: slotStart.format("HH:mm"),
            endTime: nextSlot.format("HH:mm"),
            date: dateStr,
            classId: classId,
          });
        }

        slotStart.add(appointmentDuration, "minutes");
      }

      return slots;
    };

    if (
      (schedule.generalAvailability.length ||
        schedule.adjustedAvailability.length) &&
      selectedDate
    )
      generateSlots();
  }, [selectedDate, schedule, appointmentDuration, bookedSlots, mode]);

  const handleSlotClick = (date, slot) => {
    setSelectedSlot({ date, ...slot });
  };

  const initializeStripe = async () => {
    const now = moment.utc();
    if (!user && !userLoading) {
      toast.error("Please login to book a slot.");
      return;
    }

    const expiry = now.clone().add(5, "minutes").toISOString();
    setTimer(300);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        else {
          clearInterval(interval);
          setStripeOptions(null);
          toast.error("Booking session expired. Please try again.");
        }
        return 0;
      });
    }, 1000);

    const bookingData = {
      student_id: studentId,
      instructor_id: instructorId,
      class_id: classId,
      student_name: studentName,
      startTime: moment
        .utc(
          `${selectedSlot.date} ${selectedSlot.startTime}`,
          "YYYY-MM-DD HH:mm"
        )
        .toISOString(),
      endTime: moment
        .utc(`${selectedSlot.date} ${selectedSlot.endTime}`, "YYYY-MM-DD HH:mm")
        .toISOString(),
      status: "Pending",
      expiry,
    };

    const bookingsRef = collection(db, "Bookings");
    const slotQuery = query(
      bookingsRef,
      where("instructor_id", "==", instructorId),
      where(
        "startTime",
        "==",
        moment
          .utc(
            `${selectedSlot.date} ${selectedSlot.startTime}`,
            "YYYY-MM-DD HH:mm"
          )
          .toISOString()
      )
    );

    const querySnapshot = await getDocs(slotQuery);

    if (mode === "Group") {
      const existingGroupBookings = querySnapshot.docs.filter(
        (doc) => doc.data().class_id === classId
      ).length;

      if (existingGroupBookings >= classData?.groupSize) {
        toast.error(
          "This slot is fully booked for the group class. Please select a different time."
        );
        return;
      }
    } else {
      const isSlotBooked = querySnapshot.docs.some((doc) =>
        moment
          .utc(doc.data().startTime)
          .isSame(
            moment.utc(
              `${selectedSlot.date} ${selectedSlot.startTime}`,
              "YYYY-MM-DD HH:mm"
            )
          )
      );

      if (isSlotBooked) {
        toast.error(
          "This slot is already booked. Please select a different time."
        );
        return;
      }
    }

    const bookingRef = await addDoc(collection(db, "Bookings"), bookingData);
    const response = await fetch("/api/create-stripe-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: mode === "Group" ? classData.groupPrice : classData.Price }),
    });

    const data = await response.json();

    if (data?.clientSecret) {
      setStripeOptions({
        clientSecret: data.clientSecret,
        bookingRef: bookingRef.id,
      });
    }
  };

  const handleBookSlot = () => {
    initializeStripe();
  };
  const handlePrev = () => {
    setSelectedDate((prevDate) => {
      const date = new Date(prevDate); // Ensure prevDate is a Date object
      date.setDate(date.getDate() - 1);
      return date;
    });
  };

  const handleNext = () => {
    setSelectedDate((prevDate) => {
      const date = new Date(prevDate); // Ensure prevDate is a Date object
      date.setDate(date.getDate() + 1);
      return date;
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen max-h-screen overflow-hidden">
      {/* <h1 className="text-3xl font-bold text-[#E73F2B] mb-4">Book a Slot</h1> */}
      <Header />
      <div className="flex flex-row items-center justify-between mb-4 px-4 mt-6">
        <div className="text-2xl text-[#E73F2B] font-bold mb-1">
          Booking Schedule
        </div>

        <div>
          <button
            onClick={() => setMode("Individual")}
            className={`border-[#E73F2B] rounded-tl-lg rounded-bl-lg border-2 border-r-0 text-[#E73F2B] px-4 py-1 hover:bg-[#E73F2B] hover:text-white ${
              mode === "Individual" ? "bg-[#E73F2B] text-white" : ""
            }`}
          >
            Indivisual
          </button>
          <button
            onClick={() => setMode("Group")}
            className={`border-[#E73F2B] rounded-tr-lg rounded-br-lg border-2 text-[#E73F2B] px-4 py-1 hover:bg-[#E73F2B] hover:text-white ${
              mode === "Group" ? "bg-[#E73F2B] text-white" : ""
            }`}
          >
            Group
          </button>
        </div>
      </div>
      <div className="flex  flex-grow flex-col overflow-hidden lg:flex-row">
        {/* Calendar Section */}
        <div className="p-4 pb-8 border-gray-100 rounded-md bg-gray-50 flex-shrink-0 overflow-y-auto">
          <h2 className="text-xl font-bold text-[#E73F2B] mb-4">
            Select a Date
          </h2>
          <DayPicker
            className="bg-white p-2 rounded-lg flex items-center justify-center"
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(new Date(date))}
            disabled={{
              before: moment(today).add(minDays, "days").toDate(),
              after: moment(today).add(maxDays, "days").toDate(),
            }}
            modifiers={{
              noSlots: daysWithNoSlots.map((date) => new Date(date)),
            }}
            classNames={{
              day: "react-day-picker-day",
              noSlots: "bg-red-100 text-red-700 cross-icon",
            }}
            modifiersClassNames={{
              noSlots: "line-through cross-icon rounded-full",
            }}
          />
        </div>

        {/* Time Slots Section */}
        <div className="flex-grow p-4 flex flex-col bg-white overflow-y-auto">
          <h2 className="text-xl font-bold text-[#E73F2B] mb-6">
            Select a Time Slot
          </h2>
          <div className="flex-grow">
            <div className="space-y-6">
              {Object.entries(
                groupedSlots.reduce((acc, slot) => {
                  acc[slot.date] = acc[slot.date] || [];
                  acc[slot.date].push(slot);
                  return acc;
                }, {})
              ).map(([date, slots]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="text-lg font-bold mb-3">
                  {moment(date).format("dddd, MMM Do YYYY")}
                  </div>
                  {/* Slots for the Date */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {slots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => handleSlotClick(slot.date, slot)}
                        className={`p-3 border rounded cursor-pointer ${
                          selectedSlot?.startTime === slot.startTime &&
                          selectedSlot?.date === slot.date
                            ? "bg-[#E73F2B] text-white"
                            : "bg-gray-100 hover:bg-[#E73F2B] hover:text-white"
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {groupedSlots.length == 0 && (
              <div className="text-gray-600 m-2 text-lg">
                No Time Slots available for this day
              </div>
            )}

          </div>

          {/* Sticky Booking Div */}
          {selectedSlot && (
            <div className=" bg-gray-50 sticky bottom-0 left-0 right-0 border-2 border-red-300 rounded p-4 flex justify-between items-center">
              <p>
                <strong>Selected: </strong>
                {moment(selectedSlot.date).format("dddd, MMMM Do YYYY")}{" "}
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
              <button
                onClick={handleBookSlot}
                className="bg-[#E73F2B] text-white p-2 rounded"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Centered Stripe Checkout */}
      {stripeOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Elements stripe={stripePromise} options={stripeOptions}>
            <CheckoutForm
              bookingRef={stripeOptions.bookingRef}
              setStripeOptions={setStripeOptions}
              timer={timer}
              price={mode === "Group" ? classData.groupPrice : classData.Price}
              startTime={selectedSlot.startTime}
              endTime={selectedSlot.endTime}
              date={selectedSlot.date}
              setTimer={setTimer}
              mode={mode}
            />
          </Elements>
        </div>
      )}
    </div>
  );
}

const CheckoutForm = ({
  bookingRef,
  timer,
  setStripeOptions,
  startTime,
  endTime,
  date,
  setTimer,
  mode
}) => {
  const stripe = useStripe();
  const [user, userLoading] = useAuthState(auth);
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const sendEmail = async (targetEmails, targetSubject, targetHtmlContent) => {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: targetSubject,
          html: targetHtmlContent,
          to: targetEmails,
        }),
      });

      if (res.status === 200) {
        console.log("Email sent successfully");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.warn("Error sending email: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      },
      redirect: "if_required",
    });

    if (!error && paymentIntent?.status === "succeeded") {
      const bookingDocRef = doc(db, "Bookings", bookingRef);
      await updateDoc(bookingDocRef, { status: "Confirmed", expiry: null });

      const bookingSnapshot = await getDoc(bookingDocRef);
      const bookingData = bookingSnapshot.data();
      const classRef = doc(db, "classes", bookingData.class_id);
      const classSnapshot = await getDoc(classRef);
      const classData = classSnapshot.data();

      const instructorRef = doc(db, "Users", bookingData.instructor_id);
      const instructorSnapshot = await getDoc(instructorRef);
      const instructorData = instructorSnapshot.data();

      // Combine both emails
      const recipientEmails = `${user?.email}, ${instructorData.email}`;

      // HTML content for the email
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #E73F2B;">New Booking Confirmation</h2>
        <p>Hello,</p>
        <p>We are excited to confirm a new booking for the class <strong>${
          classData.Name
        }</strong>!</p>
        <h3>Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;" border="1">
          <tr>
            <td style="padding: 8px;"><strong>User Email:</strong></td>
            <td style="padding: 8px;">${user?.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Class Name:</strong></td>
            <td style="padding: 8px;">${classData.Name}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Start Time:</strong></td>
            <td style="padding: 8px;">${date + "/" + startTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>End Time:</strong></td>
            <td style="padding: 8px;">${date + "/" + endTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Price:</strong></td>
            <td style="padding: 8px;">${mode === "Group" ? classData.groupPrice : classData.Price}</td>
          </tr>
        </table>
        <p>Thank you for choosing <strong>Pocketclass</strong>!</p>
        <p style="color: #555;">Best Regards,<br>Pocketclass Team</p>
      </div>
    `;

      await sendEmail(
        recipientEmails,
        `New Booking for ${classData.Name} with Pocketclass!`,
        htmlContent
      );

      setStripeOptions(null);
      setLoading(false);
      toast.success("Booking confirmed!");
    } else {
      toast.error(error?.message || "Payment failed!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex flex-row justify-end text-[#E73F2B] mb-2">
        <button
          className="top-4 right- flex flex-row items-center gap-1 text-center"
          onClick={() => {
            setStripeOptions(null);
            setTimer(null);
          }}
        >
          <ChevronLeftIcon className="h-4 w-4 mt-1" />
          Go Back
        </button>
      </div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Complete Payment</h1>

        <div className="flex items-center">
          <p className="text-sm text-gray-500 mr-2">Expires in:</p>
          <p className="text-sm text-[#E73F2B] font-bold">
            {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
            {timer % 60}
          </p>
        </div>
      </div>
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement />
      <button
        className="mt-4 p-2 bg-[#E73F2B] text-white rounded w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};
