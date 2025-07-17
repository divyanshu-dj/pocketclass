"use client";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  FaStar,
  FaShoppingCart,
  FaClock,
  FaRegCalendarAlt,
  FaRegCommentDots,
  FaSchool,
  FaTimesCircle,
} from "react-icons/fa";

const RenderDetails = ({
  selectedAppointment,
  classDetails,
  ismobile,
  setRating,
  formatDuration,
  rating,
  feedback,
  setFeedback,
  hovered,
  setHovered,
  setInvoiceOpen,
  invoiceOpen,
  handleBackMobile,
  setRescheduleModal,
}) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [reviewText, setReviewText] = useState("");

  if (!selectedAppointment) return null;
  const studentId = selectedAppointment?.student_id;
  const classData = classDetails[selectedAppointment.class_id];
  if (!classData) return null;

  const imageUrl = classData.Images?.[0] || "/placeholder.jpg";
  const isUpcoming = moment(selectedAppointment.startTime)
    .tz(selectedAppointment.timeZone || "America/Toronto")
    .isAfter(moment().tz("America/Toronto"));

  const handleMessageInstructor = async () => {
    const allEmails = selectedAppointment.all_emails || [];
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
        where("startTime", "==", selectedAppointment.startTime)
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
        startTime: selectedAppointment.startTime,
        studentIds,
      });
      router.push({
        pathname: "/chat",
        query: { cid: classData.classCreator, chid: newChat.id },
      });
    }
  };

  const handleBookAgain = () => {
    if (selectedAppointment.class_id) {
      router.push(`/classes/id=${selectedAppointment.class_id}`);
    } else {
      toast.error("Class ID not found.");
    }
  };

  return (
    <div className={`w-full z-40 ${ismobile ? "overflow-hidden" : ""}`}>
      <div
        className={`h-full flex flex-col ${
          ismobile ? "" : "rounded-xl overflow-hidden shadow-md"
        }`}
      >
        <div className="relative h-64">
          <img
            src={imageUrl}
            alt="Class"
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          />
          <img
            src={imageUrl}
            alt="Class"
            className="relative w-full h-full object-contain z-[2]"
          />
          <div className="absolute blur-sm inset-0 bg-black bg-opacity-25 z-[3]" />
          {ismobile && (
            <div className="absolute top-0 left-0 z-[4]">
              <button
                className="m-3 p-2 text-logo-red font-semibold text-sm rounded-full shadow-md flex items-center gap-2"
                onClick={handleBackMobile}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="absolute z-[4] bottom-0 w-full p-2 pl-4 text-left text-3xl text-white font-semibold">
            {classData.Name}
          </div>
        </div>

        <div
          className={`flex-1 flex flex-col justify-between ${
            ismobile ? "px-4 pt-4" : "p-4"
          }`}
        >
          <div>
            <p className="text-2xl mb-2">
              {moment(selectedAppointment.startTime)
                .tz(selectedAppointment.timeZone || "America/Toronto")
                .format("dddd, MMM D, YYYY [at] h:mm A")}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {formatDuration(
                selectedAppointment.startTime,
                selectedAppointment.endTime,
                selectedAppointment.timeZone
              )}{" "}
              duration
            </p>
          </div>

          <div className="bg-white border-t mt-6 pt-4">
            <div className="flex flex-col gap-3">
              <ActionItem
                icon={<FaRegCommentDots className="text-lg" />}
                title="Message Students"
                subtitle="Send updates"
                onClick={handleMessageInstructor}
              />
              <ActionItem
                icon={
                  classData.Mode === "Offline" ? (
                    <FaRegCalendarAlt className="text-lg" />
                  ) : (
                    <FaRegCommentDots className="text-lg" />
                  )
                }
                title={
                  classData.Mode === "Offline"
                    ? "Class Location"
                    : "Online Meeting Link"
                }
                subtitle={
                  classData.Mode === "Offline" ? (
                    classData.Address
                  ) : selectedAppointment?.meetingLink ? (
                    <a
                      href={selectedAppointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {selectedAppointment.meetingLink}
                    </a>
                  ) : (
                    "Meeting link not available"
                  )
                }
              />
              <ActionItem
                icon={<FaSchool className="text-lg" />}
                title="Go to Class"
                subtitle="Redirect to class page."
                onClick={handleBookAgain}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ icon, title, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-start gap-4 px-4 py-3 border-b cursor-pointer hover:shadow-sm transition"
  >
    <div className="bg-[#FDECEA] text-logo-red p-2 rounded-full">{icon}</div>
    <div>
      <p className="font-semibold text-sm text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default RenderDetails;
