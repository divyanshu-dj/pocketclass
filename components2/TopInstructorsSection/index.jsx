"use client";

import {
  collection,
  query,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import InstructorSection from "../InstructorSection/index";
import { db } from "../../firebaseConfig";

function TopClassesSection({
  showAll = false,
  activeFilter = null,
  onClassesLoad,
}) {
  const [classes, setClasses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filteredClasses = activeFilter
      ? classes.filter((classItem) => classItem.Type === activeFilter)
      : classes;
    onClassesLoad?.(filteredClasses.length);
  }, [classes, activeFilter, onClassesLoad]);

  // Fetch reviews
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Reviews"), (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
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
                classData.instructorName = instructorDoc.data().name || "N/A";
              }
            }

            // Calculate average rating for this class
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

            return classData;
          })
        );

        // Sort classes by rating
        const sortedClasses = classesWithInstructors.sort(
          (a, b) => b.averageRating - a.averageRating
        );
        setClasses(sortedClasses);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndInstructors();
  }, [reviews]);

  // const displayedClasses = showAll ? classes.slice(0, 12) : classes.slice(0, 4);

  const displayedClasses = showAll
    ? activeFilter
      ? classes
          .filter((classItem) => classItem.Type === activeFilter)
          .slice(0, 12)
      : classes.slice(0, 12)
    : activeFilter
    ? classes.filter((classItem) => classItem.Type === activeFilter).slice(0, 4)
    : classes.slice(0, 4);

  return (
    <div className="grow-0 shrink-0">
      <div className="">
        <p className="section-heading !text-left">Top-Rated Classes</p>
        <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-[#261f22] mt-4 m-0 p-0">
          Discover amazing learning experiences
        </p>
      </div>
      <div>
        <div
          className={`flex gap-8 max-w-[100%] ${
            showAll ? "overflow-auto" : ""
          } box-border mt-8`}
        >
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
                  loading={false}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default TopClassesSection;
