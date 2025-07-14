import { useEffect, useState } from "react";
import moment from "moment-timezone";
import InvoiceModal from "./StudentClassesComponents/InvoiceModal";
import RenderDetails from "./StudentClassesComponents/DetailsPanel";
import ClassCard from "./StudentClassesComponents/ClassCard";
import NewHeader from "../NewHeader";
import RescheduleClass from "../RescheduleClass";

const isMobileOrTablet = () => {
  if (typeof window === "undefined") return false; // Default to desktop on server
  return window.innerWidth < 1024;
};

const SkeletonCard = () => (
  <div className="mb-4 p-4 border border-gray-200 rounded-md animate-pulse bg-gray-100">
    <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const RenderDetailsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-64 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const StudentClasses = ({ appointments, classDetails, reviews, isLoading }) => {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);

  useEffect(() => {
    if (invoiceOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [invoiceOpen]);

  const EmptyStateCard = ({ type }) => {
    const label = type === "upcoming" ? "upcoming" : "past";
    const heading = `No ${label} appointments`;
    const subtext = `Your ${label} appointments will appear here when you book.`;

    return (
      <div className="border border-gray-200 rounded-lg p-6 text-center bg-white shadow-sm mx-auto mt-2">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-logo-red"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{heading}</h3>
        <p className="text-sm text-gray-500 mb-4">{subtext}</p>
        <a
          href="/browse"
          className="inline-block px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          Search classes
        </a>
      </div>
    );
  };

  const formatDuration = (startTime, endTime, timezone) => {
    const start = moment(startTime).tz(timezone || "America/Toronto");
    const end = moment(endTime).tz(timezone || "America/Toronto");
    const duration = moment.duration(end.diff(start));
    const hours = duration.hours();
    const minutes = duration.minutes();
    if (hours && minutes)
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    if (hours) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return `0 minutes`;
  };

  useEffect(() => {
    const now = moment().tz("America/Toronto");
    const upcoming = [];
    const past = [];
    appointments.forEach((appointment) => {
      const startTime = moment
        .utc(appointment.startTime)
        .tz(appointment.timezone || "America/Toronto");
      if (startTime.isAfter(now)) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    });
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
    if (upcoming.length > 0) setSelectedAppointment(upcoming[0]);
    else if (past.length > 0) setSelectedAppointment(past[0]);
  }, [appointments]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMobileOrTablet()) setShowDetailsMobile(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (appointment) => {
    if (isMobileOrTablet()) {
      setSelectedAppointment(appointment);
      setShowDetailsMobile(true);
    } else {
      setSelectedAppointment(appointment);
    }
  };

  const handleBackMobile = () => {
    setShowDetailsMobile(false);
  };

  const renderAppointmentCard = (appointment, type) => {
    const classData = classDetails[appointment.class_id];
    if (!classData) return null;

    return (
      <div
        key={appointment.id}
        className={`transition-opacity duration-700 ease-in ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <ClassCard
          appointment={appointment}
          type={type}
          classData={classData}
          selectedId={selectedAppointment?.id}
          formatDuration={formatDuration}
          onClick={handleCardClick}
          rescheduleModal={rescheduleModal}
          setRescheduleModal={setRescheduleModal}
          onCancelSuccess={() => {}}
        />
      </div>
    );
  };

  if (isMobileOrTablet()) {
    return (
      <div className="w-[100vw] overflow-hidden">
        <NewHeader />
        <div
          className="flex transition-transform duration-300 h-[100vh] overflow-hidden"
          style={{
            width: "200vw",
            transform: showDetailsMobile
              ? "translateX(-100vw)"
              : "translateX(0)",
          }}
        >
          {/* Booking List Panel */}
          <div className="w-[100vw] h-[100vh] overflow-hidden bg-white flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <h1 className="text-2xl font-bold mb-4">Bookings</h1>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Upcoming
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
                  {upcomingAppointments.length}
                </span>
              </h2>
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) =>
                  renderAppointmentCard(appt, "upcoming")
                )
              ) : (
                <EmptyStateCard type="upcoming" />
              )}
              <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center gap-2">
                Past
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
                  {pastAppointments.length}
                </span>
              </h2>
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appt) =>
                  renderAppointmentCard(appt, "past")
                )
              ) : (
                <EmptyStateCard type="past" />
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-[100vw] h-full flex flex-col bg-white p-4">
            <div className="flex-1 overflow-y-auto">
              {!isLoading && selectedAppointment && (
                <RenderDetails
                  selectedAppointment={selectedAppointment}
                  feedback={feedback}
                  setFeedback={setFeedback}
                  setHovered={setHovered}
                  hovered={hovered}
                  rating={rating}
                  classDetails={classDetails}
                  formatDuration={formatDuration}
                  invoiceOpen={invoiceOpen}
                  setInvoiceOpen={setInvoiceOpen}
                  setRating={setRating}
                  ismobile={true}
                  handleBackMobile={handleBackMobile}
                  setRescheduleModal={setRescheduleModal}
                />
              )}
            </div>
            {!isLoading && selectedAppointment && (
              <InvoiceModal
                isOpen={invoiceOpen}
                onClose={() => setInvoiceOpen(false)}
                appointment={selectedAppointment}
                classData={classDetails[selectedAppointment?.class_id]}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div>
      <NewHeader />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 min-h-[75vh]">
        {/* Left Panel */}
        <div
          className={`w-full ${
            isLoading || appointments.length > 0 ? "lg:w-1/2" : "lg:w-full"
          } flex-shrink-0`}
        >
          <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Upcoming
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
              {upcomingAppointments.length}
            </span>
          </h2>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) =>
              renderAppointmentCard(appt, "upcoming")
            )
          ) : (
            <EmptyStateCard type="upcoming" />
          )}

          <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center gap-2">
            Past
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
              {pastAppointments.length}
            </span>
          </h2>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : pastAppointments.length > 0 ? (
            pastAppointments.map((appt) => renderAppointmentCard(appt, "past"))
          ) : (
            <EmptyStateCard type="past" />
          )}
        </div>

        {/* Right Panel with fade animation */}
        <div className="w-full xl:pr-0 pr-4 lg:w-1/2 flex-shrink-0 relative min-h-[300px]">
          {/* Skeleton */}
          <div
            className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${
              isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <RenderDetailsSkeleton />
          </div>

          {/* Real content */}
          <div
            className={`transition-opacity duration-700 delay-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            {selectedAppointment && (
              <>
                <RenderDetails
                  selectedAppointment={selectedAppointment}
                  feedback={feedback}
                  setFeedback={setFeedback}
                  setHovered={setHovered}
                  hovered={hovered}
                  rating={rating}
                  classDetails={classDetails}
                  formatDuration={formatDuration}
                  invoiceOpen={invoiceOpen}
                  setInvoiceOpen={setInvoiceOpen}
                  setRating={setRating}
                  ismobile={false}
                  handleBackMobile={handleBackMobile}
                  setRescheduleModal={setRescheduleModal}
                />
                <InvoiceModal
                  isOpen={invoiceOpen}
                  onClose={() => setInvoiceOpen(false)}
                  appointment={selectedAppointment}
                  classData={classDetails[selectedAppointment?.class_id]}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {rescheduleModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 pt-2 pb-4 rounded shadow-lg max-h-[80vh] overflow-y-auto">
            <RescheduleClass
              classId={selectedAppointment?.class_id}
              setRescheduleModal={setRescheduleModal}
              instructorId={
                classDetails[selectedAppointment?.class_id]?.classCreator
              }
              bookingId={selectedAppointment?.id}
            />
            <button
              onClick={() => setRescheduleModal(false)}
              className="mt-4 w-full p-2 hover:bg-logo-red text-logo-red border hover:text-white border-logo-red border-solid rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
