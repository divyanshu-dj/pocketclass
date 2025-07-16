import { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ActionMenu = ({
  type,
  onMessageInstructor,
  onRescheduleClick,
  onCancelClick,
  onBookAgainClick,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-0" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="text-gray-500 hover:text-gray-700 text-xl px-2"
      >
        &#x22EE;
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md z-0">
          {type === "upcoming" ? (
            <>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => {
                  onMessageInstructor?.();
                  setOpen(false);
                }}
              >
                Message Students
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onBookAgainClick?.();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
            >
              Book Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ClassCard = ({
  appointment,
  type,
  classData,
  selectedId,
  formatDuration,
  onClick,
  animating,
  setRescheduleModal,
  onCancelSuccess,
}) => {
  const imageUrl = classData.Images?.[0] || "/placeholder.jpg";
  const router = useRouter();
  const { id: studentId } = router.query;
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleReschedule = () => {
    const now = moment().tz(appointment?.timeZone).add(24, "hours");
    const bookingStartDate = moment.utc(
      appointment.startTime,
      "YYYY-MM-DD HH:mm"
    );
    if (bookingStartDate.isBefore(now)) {
      toast.error(
        "You cannot reschedule an appointment less than 24 hours away."
      );
      return;
    }
    setRescheduleModal(true);
  };

  const handleMessageInstructor = async () => {
    const allEmails = appointment.all_emails || [];
    const uniqueEmails = [...new Set(allEmails)];
    const studentIds = [];

    for (const email of uniqueEmails) {
      const userQuery = query(
        collection(db, "Users"),
        where("email", "==", email)
      );
      const userSnap = await getDocs(userQuery);
      if (!userSnap.empty) {
        studentIds.push(userSnap.docs[0].id);
      }
    }

    if (studentIds.length === 0) {
      toast.error("No matching student accounts found.");
      return;
    }

    const chatRoomRef = collection(db, "chatrooms");

    if (studentIds.length === 1) {
      const q = query(
        chatRoomRef,
        where("student", "==", studentIds[0]),
        where("instructor", "==", classData.classCreator),
        where("class", "==", classData.id)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        router.push({
          pathname: "/chat",
          query: { cid: classData.classCreator, chid: snapshot.docs[0].id },
        });
        return;
      }

      const newChat = await addDoc(chatRoomRef, {
        student: studentIds[0],
        instructor: classData.classCreator,
        class: classData.id,
      });
      router.push({
        pathname: "/chat",
        query: { cid: classData.classCreator, chid: newChat.id },
      });
    } else {
      const q = query(
        chatRoomRef,
        where("instructor", "==", classData.classCreator),
        where("class", "==", classData.id),
        where("startTime", "==", appointment.startTime)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        router.push({
          pathname: "/chat",
          query: { cid: classData.classCreator, chid: snapshot.docs[0].id },
        });
        return;
      }

      const newChat = await addDoc(chatRoomRef, {
        instructor: classData.classCreator,
        class: classData.id,
        startTime: appointment.startTime,
        studentIds,
      });
      router.push({
        pathname: "/chat",
        query: { cid: classData.classCreator, chid: newChat.id },
      });
    }
  };

  const handleBookAgain = () => {
    if (appointment.class_id) {
      router.push(`/classes/id=${appointment.class_id}`);
    } else {
      toast.error("Class ID not found. Cannot proceed to booking.");
    }
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      const now = moment().tz(appointment?.timeZone).add(24, "hours");
      const bookingStartDate = moment.utc(
        appointment.startTime,
        "YYYY-MM-DD HH:mm"
      );
      const diff = bookingStartDate.diff(now, "hours");

      if (diff < 0) {
        toast.error("You cannot cancel less than 24 hours in advance.");
        return;
      }

      if (appointment.paymentMethod === "Package") {
        toast.error("Cannot cancel package bookings, please reschedule.");
        return;
      }

      const bookingRef = doc(db, "Bookings", appointment.id);
      const bookingSnap = await getDoc(bookingRef);
      if (!bookingSnap.exists()) {
        toast.error("Booking not found.");
        return;
      }

      const bookingData = bookingSnap.data();
      const studentRef = doc(db, "Users", bookingData.student_id);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        toast.error("Student not found.");
        return;
      }

      const studentData = studentSnap.data();
      const userEmails = [
        studentData.email,
        ...(bookingData.groupEmails || []),
      ];

      let refundAmount = null;

      if (appointment.paymentIntentId) {
        const refundRes = await fetch("/api/refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: appointment.paymentIntentId,
            bookingId: appointment.id,
            refundReason: refundReason || "Customer requested",
          }),
        });
        const refundData = await refundRes.json();
        if (!refundRes.ok || !refundData.success) {
          throw new Error(refundData.message || "Refund failed");
        }
        refundAmount = refundData.amount ? refundData.amount / 100 : null;
      }

      if (appointment.meetingLink) {
        await fetch("/api/calendar/delete-event", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instructorId: classData.classCreator,
            userEmails,
            classId: bookingData.class_id,
            start: moment
              .utc(bookingData.startTime)
              .format("YYYY-MM-DDTHH:mm:ss"),
            end: moment.utc(bookingData.endTime).format("YYYY-MM-DDTHH:mm:ss"),
            timeZone: bookingData.timeZone || "America/Toronto",
          }),
        });
      }

      await deleteDoc(bookingRef);

      if (reviewText.trim()) {
        await addDoc(collection(db, "Refunds"), {
          studentId,
          classId: classData.id,
          instructorId: classData.classCreator,
          text: reviewText.trim(),
          createdAt: new Date(),
          refundAmount,
        });
      }

      toast.success("Booking cancelled successfully.");
      onCancelSuccess(appointment.id);
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error(err.message || "Cancellation failed.");
    } finally {
      setIsCancelling(false);
      setShowReasonModal(false);
      setReviewText("");
    }
  };

  return (
    <>
      <div
        className={`relative group mb-4 cursor-pointer rounded-xl transition duration-300
    ${
      selectedId === appointment.id
        ? "ring-0 ring-logo-red ring-offset-0 shadow-md hover:shadow-[0_0_20px_rgba(255,0,0,0.9)] lg:ring-2 lg:ring-offset-1"
        : "hover:ring-2 hover:ring-logo-red hover:ring-offset-1 hover:shadow-md hover:shadow-[0_0_20px_rgba(255,0,0,0.9)]"
    }`}
        onClick={() => !animating && onClick(appointment)}
      >
        <div className="bg-white rounded-xl shadow-md flex flex-col lg:flex-row">
          <div className="relative lg:rounded-tl-xl lg:rounded-tr-none lg:rounded-bl-xl rounded-tl-xl rounded-tr-xl w-full lg:w-40 h-48 lg:h-auto flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt="Blurred"
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
            />
            <img
              src={imageUrl}
              alt="Class"
              className="relative z-10 w-full max-h-32 lg:max-h-24 object-contain"
            />
          </div>
          <div className="flex-1 p-4">
            <h3 className="text-lg justify-between flex font-semibold">
              {classData.Name}{" "}
              <div className=" z-20" onClick={(e) => e.stopPropagation()}>
                <ActionMenu
                  type={type}
                  onRescheduleClick={handleReschedule}
                  onMessageInstructor={handleMessageInstructor}
                  onCancelClick={() => setShowReasonModal(true)}
                  onBookAgainClick={handleBookAgain}
                />
              </div>
            </h3>
            <p className="text-sm text-gray-500">
              {moment(appointment.startTime)
                .tz(appointment.timezone || "America/Toronto")
                .format("dddd, MMM D, YYYY [at] h:mm A")}
            </p>
            <p className="text-sm text-gray-500">
              Duration:{" "}
              {formatDuration(
                appointment.startTime,
                appointment.endTime,
                appointment.timezone
              )}
            </p>
            <p className="text-sm text-gray-600">
              {classData.SubCategory || classData.Type} • {appointment.price}{" "}
              CAD
            </p>
            <p className="text-sm text-gray-500">{classData.Address}</p>
            <p className="text-sm text-gray-700 font-medium">
              {appointment.student_names.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="mb-4">
              Are you sure you want to cancel this booking?
            </p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded mb-4 resize-none"
              rows={4}
              placeholder="Leave an optional review about the class..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md"
                disabled={isCancelling}
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                disabled={isCancelling}
              >
                {isCancelling ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassCard;
