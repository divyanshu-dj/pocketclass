"use client";

import {
  collection,
  query,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import InstructorSection from "../InstructorSection/index";
import { db } from "../../firebaseConfig";

function TopClassesSection({
  activeFilter = null,
  onClassesLoad,
  displayCount = 4,
}) {
  const [classes, setClasses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  // 🧭 Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        }
      );
    }
  }, []);

  // 🧠 Calculate distance using Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // 👂 Listen to review updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Reviews"), (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchClassesAndInstructors = async () => {
      try {
        const classesQuery = query(collection(db, "classes"));

        const classesSnapshot = await getDocs(classesQuery);

        const classesWithInstructors = await Promise.all(
          classesSnapshot.docs.map(async (doc) => {
            const classData = {
              id: doc.id,
              ...doc.data(),
            };

            // Instructor Info
            if (classData.classCreator) {
              const instructorRef = firestoreDoc(
                db,
                "Users",
                classData.classCreator
              );
              const instructorDoc = await getDoc(instructorRef);
              if (instructorDoc.exists()) {
                classData.name = classData.Name || "N/A";
                classData.profileImage = classData.Images?.[0] || "N/A";
                classData.category = classData.Category || "N/A";
                classData.instructorName =
                  instructorDoc.data().firstName || "Instructor";
                classData.instructorImage = instructorDoc.data().profileImage;
              }
            }

            // Ratings
            const classReviews = reviews.filter(
              (rev) => rev.classID === classData.id
            );
            const avgRating =
              classReviews.length > 0
                ? classReviews.reduce(
                    (acc, rev) =>
                      acc +
                      (rev.qualityRating +
                        rev.recommendRating +
                        rev.safetyRating) /
                        3,
                    0
                  ) / classReviews.length
                : 0;

            classData.averageRating = avgRating;
            classData.reviewCount = classReviews.length;

            // Distance from user
            if (userLocation && classData.latitude && classData.longitude) {
              const classLat = parseFloat(classData.latitude);
              const classLon = parseFloat(classData.longitude);
              classData.distance = getDistance(
                userLocation.latitude,
                userLocation.longitude,
                classLat,
                classLon
              );
            } else {
              classData.distance = Infinity;
            }

            return classData;
          })
        );

        // Sort by distance then rating
        const sortedClasses = classesWithInstructors
          .filter((c) => c.distance !== Infinity)
          .sort((a, b) => {
            if (a.distance === b.distance) {
              return b.averageRating - a.averageRating;
            }
            return a.distance - b.distance;
          });

        setClasses(sortedClasses);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchClassesAndInstructors();
    }
  }, [reviews, activeFilter, userLocation]);

  // Filter based on activeFilter
  const filteredClasses = activeFilter
    ? classes.filter(
        (classItem) =>
          classItem.Type === activeFilter ||
          classItem.SubCategory === activeFilter
      )
    : classes;

  // Inform parent of count AFTER filtering
  useEffect(() => {
    onClassesLoad?.(filteredClasses.length);
  }, [filteredClasses, onClassesLoad]);

  const displayedClasses = filteredClasses.slice(0, displayCount || 4);

  return (
    <div className="grow-0 shrink-0">
      <div>
        {!activeFilter && (
          <p className="section-heading !text-left">Top-Rated Nearby Classes</p>
        )}
        <p className="text-lg font-bold text-[#261f22] mt-4">
          Discover amazing learning experiences near you
        </p>
      </div>
      <div>
        <div id="classes-grid" className="gap-8 max-w-[100%] box-border mt-8">
          {loading
            ? Array(4)
                .fill(null)
                .map((_, index) => (
                  <InstructorSection key={index} loading={true} />
                ))
            : displayedClasses.map((classItem) => (
                <InstructorSection
                  key={classItem.id}
                  classId={classItem.id}
                  instructor={classItem}
                  reviews={reviews}
                  loading={false}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default TopClassesSection;
