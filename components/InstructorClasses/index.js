import React, { useState, useEffect, useRef } from "react";
import InstructorCard from "./InstructorCard";
import { useRouter } from "next/router";
import NewHeader from "../NewHeader";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";

const ActionMenu = ({ onEdit, onDelete, onReschedule }) => {
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
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => {
              onEdit?.();
              setOpen(false);
            }}
          >
            Edit Class
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => {
              onReschedule?.();
              setOpen(false);
            }}
          >
            Manage Schedule
          </button>
          <button
            onClick={() => {
              onDelete?.();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

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

const ClassDetailsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-64 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const EmptyStateCard = () => {
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        No classes found
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Your created classes will appear here when you add them.
      </p>
      <a
        href="/createclass"
        className="inline-block px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
      >
        Create a class
      </a>
    </div>
  );
};

const ClassDetailsPanel = ({
  selectedClass,
  reviews,
  onEdit,
  onReschedule,
  onDelete,
}) => {
  if (!selectedClass) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Select a class to view details</p>
        </div>
      </div>
    );
  }

  const classReviews = reviews.filter(
    (review) => review.class_id === selectedClass.id
  );
  const averageRating =
    classReviews.length > 0
      ? classReviews.reduce((sum, review) => sum + review.rating, 0) /
        classReviews.length
      : 0;

  return (
    <div className="bg-white h-full">
      {/* Class Image */}
      {selectedClass.Images && selectedClass.Images.length > 0 ? (
        <div className="relative h-64 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
          {/* Blurred background image */}
          <img
            src={selectedClass.Images[0]}
            alt="Blurred"
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute inset-0 z-20 bg-black bg-opacity-10"></div>
          {/* Clear image on top */}
          <img
            src={selectedClass.Images[0]}
            alt="Class"
            className="relative z-10 max-h-full max-w-full object-contain"
          />
          {/* Class title overlay */}
          <div className="absolute z-40 bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold mb-1">{selectedClass.Name}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span>{selectedClass.Category}</span>
              {selectedClass.SubCategory && (
                <>
                  <span>•</span>
                  <span>{selectedClass.SubCategory}</span>
                </>
              )}
              <span>•</span>
              <span>${selectedClass.Price}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center mb-6 relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {selectedClass.Name?.charAt(0) || "C"}
            </div>
          </div>
          {/* Class title overlay for no image case */}
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold mb-1">{selectedClass.Name}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span>{selectedClass.Category}</span>
              {selectedClass.SubCategory && (
                <>
                  <span>•</span>
                  <span>{selectedClass.SubCategory}</span>
                </>
              )}
              <span>•</span>
              <span>${selectedClass.Price}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Date and Time */}
        {selectedClass.startTime && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {new Date(selectedClass.startTime).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(selectedClass.startTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </h2>
            {selectedClass.startTime && selectedClass.endTime && (
              <p className="text-gray-600">
                {Math.round(
                  (new Date(selectedClass.endTime) -
                    new Date(selectedClass.startTime)) /
                    (1000 * 60)
                )}{" "}
                minutes duration
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onEdit(selectedClass)}
            className="w-full flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Edit Class</p>
              <p className="text-sm text-gray-500">
                Update class details and settings
              </p>
            </div>
          </button>

          <button
            onClick={() => onReschedule(selectedClass)}
            className="w-full flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Schedule</p>
              <p className="text-sm text-gray-500">Change the class schedule</p>
            </div>
          </button>

          <button
            onClick={() => onDelete(selectedClass)}
            className="w-full flex items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-red-600">
                Delete Class
              </p>
              <p className="text-sm text-gray-500 group-hover:text-red-500">
                Permanently remove this class
              </p>
            </div>
          </button>
        </div>

        {/* Class Location */}
        {selectedClass.Address && (
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Class Location</p>
              <p className="text-gray-600">{selectedClass.Address}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {selectedClass.Description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {selectedClass.Description}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        {classReviews.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Reviews
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {classReviews.length} reviews
                  </p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InstructorClasses = ({
  classes,
  bookings,
  bookingsByMe,
  reviews,
  userData,
  setMyClass,
  isLoading,
}) => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);

  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClass(classes[0]);
    }
  }, [classes]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMobileOrTablet()) setShowDetailsMobile(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClassClick = (classData) => {
    if (isMobileOrTablet()) {
      setSelectedClass(classData);
      setShowDetailsMobile(true);
    } else {
      setSelectedClass(classData);
    }
  };

  const handleBackMobile = () => {
    setShowDetailsMobile(false);
  };

  const handleEdit = (classData) => {
    // Navigate to edit page - you'll need to create this route
    router.push(`/updateClass/${classData.id}`);
  };

  const handleReschedule = (classData) => {
    // Navigate to reschedule page
    router.push(`/schedule/${classData.id}`);
  };

  const handleDelete = async (classData) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${classData.Name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteDoc(doc(db, "classes", classData.id));
        setSelectedClass(null);
        setMyClass((prevClasses) =>
          prevClasses.filter((c) => c.id !== classData.id)
        );
        toast.success("Class deleted successfully");
      } catch (error) {
        console.error("Error deleting class:", error);
        toast.error("Failed to delete class. Please try again.");
      }
    }
  };

  const renderClassCard = (classData) => {
    const isSelected = selectedClass?.id === classData.id;
    const imageUrl = classData.Images?.[0] || "/placeholder.jpg";

    return (
      <div
        key={classData.id}
        className={`relative group mb-4 cursor-pointer rounded-xl transition duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${
          isSelected
            ? "ring-0 ring-logo-red ring-offset-0 shadow-[0_0_20px_rgba(255,0,0,0.9)] lg:ring-2 lg:ring-offset-1"
            : "hover:ring-2 hover:ring-logo-red hover:ring-offset-1 hover:shadow-[0_0_20px_rgba(255,0,0,0.9)]"
        }`}
        onClick={() => handleClassClick(classData)}
      >
        <div className="bg-white rounded-xl shadow-md flex flex-col lg:flex-row">
          <div className="relative lg:rounded-tl-xl lg:rounded-tr-none lg:rounded-bl-xl rounded-tl-xl rounded-tr-xl w-full lg:w-40 h-48 lg:h-auto flex items-center justify-center overflow-hidden">
            {classData.Images && classData.Images.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {classData.Name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <h3 className="text-lg justify-between flex font-semibold">
              {classData.Name}
              <div className="z-20" onClick={(e) => e.stopPropagation()}>
                <ActionMenu
                  onEdit={() => handleEdit(classData)}
                  onReschedule={() => handleReschedule(classData)}
                  onDelete={() => handleDelete(classData)}
                />
              </div>
            </h3>

            {/* Date/Time - if available */}
            {classData.startTime && (
              <p className="text-sm text-gray-500">
                {new Date(classData.startTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(classData.startTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            )}

            {/* Duration - calculated from start/end time */}
            {classData.startTime && classData.endTime && (
              <p className="text-sm text-gray-500">
                Duration:{" "}
                {Math.round(
                  (new Date(classData.endTime) -
                    new Date(classData.startTime)) /
                    (1000 * 60)
                )}{" "}
                minutes
              </p>
            )}

            <p className="text-sm text-gray-600">
              {classData.SubCategory || classData.category || classData.Type} •
              ${classData.Price}
            </p>

            {/* Location */}
            {classData.Address && (
              <p className="text-sm text-gray-500">{classData.Address}</p>
            )}

            {/* Instructor name */}
            <p className="text-sm text-gray-700 font-medium">
              {userData?.firstName && userData?.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.firstName || "You"}
            </p>
          </div>
        </div>
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
          {/* Classes List Panel */}
          <div className="w-[100vw] h-[100vh] overflow-hidden bg-white flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <h1 className="text-2xl font-bold mb-4">My Classes</h1>

              {userData?.mindbody?.accessToken && (
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => router.push("/mindbody-import")}
                    className="bg-logo-red text-white px-4 py-2 rounded-md hover:bg-logo-red-dark transition-colors"
                  >
                    Import Classes from Mindbody
                  </button>
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Classes
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
                  {classes.length}
                </span>
              </h2>

              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : classes.length > 0 ? (
                <div className="space-y-4">{classes.map(renderClassCard)}</div>
              ) : (
                <EmptyStateCard />
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-[100vw] h-full flex flex-col bg-white p-4">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackMobile}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Classes
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {!isLoading && selectedClass && (
                <ClassDetailsPanel
                  selectedClass={selectedClass}
                  reviews={reviews}
                  onEdit={handleEdit}
                  onReschedule={handleReschedule}
                  onDelete={handleDelete}
                />
              )}
            </div>
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
            isLoading || classes.length > 0 ? "lg:w-1/2" : "lg:w-full"
          } flex-shrink-0`}
        >
          <h1 className="text-2xl font-bold mb-4">My Classes</h1>

          {userData?.mindbody?.accessToken && (
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => router.push("/mindbody-import")}
                className="bg-logo-red text-white px-4 py-2 rounded-md hover:bg-logo-red-dark transition-colors"
              >
                Import Classes from Mindbody
              </button>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Classes
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 text-sm">
              {classes.length}
            </span>
          </h2>

          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : classes.length > 0 ? (
            <div className="space-y-4">{classes.map(renderClassCard)}</div>
          ) : (
            <EmptyStateCard />
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
            <ClassDetailsSkeleton />
          </div>

          {/* Real content */}
          <div
            className={`transition-opacity duration-700 delay-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            <ClassDetailsPanel
              selectedClass={selectedClass}
              reviews={reviews}
              onEdit={handleEdit}
              onReschedule={handleReschedule}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorClasses;
