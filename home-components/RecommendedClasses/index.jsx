"use client";

import {
  collection,
  query,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  onSnapshot,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import InstructorSection from "../InstructorSection/index";
import { db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";

function RecommendedClassesSection({
  activeFilter = null,
  onClassesLoad,
}) {
  const [classes, setClasses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const filteredClasses = activeFilter
      ? classes.filter((classItem) => ((classItem.Type === activeFilter) || (classItem.SubCategory === activeFilter)))
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
    setLoading(true);
    const fetchRecommendedClasses = async () => {
      try {
        // Get user's recently viewed classes for recommendation analysis
        const recentlyViewedClasses =
          JSON.parse(localStorage.getItem("recentlyViewedClasses")) || [];
        
        let userRecentlyViewed = [];
        if (user && user.uid) {
          // Get user's recently viewed classes from Firestore
          const userViewedClassesRef = firestoreDoc(db, "Users", user.uid);
          const userViewedClassesDoc = await getDoc(userViewedClassesRef);
          if (userViewedClassesDoc.exists()) {
            const userViewedClassesData = userViewedClassesDoc.data();
            if (userViewedClassesData.recentlyViewedClasses) {
              userRecentlyViewed = userViewedClassesData.recentlyViewedClasses;
            }
          }
        }

        // Combine and get unique categories/subcategories from viewed classes
        const allViewedClasses = [...recentlyViewedClasses, ...userRecentlyViewed];
        const viewedClassIds = allViewedClasses.map(item => typeof item === 'string' ? item : item.id);
        
        // Get categories and subcategories from viewed classes
        const viewedCategories = new Set();
        const viewedSubCategories = new Set();
        
        if (viewedClassIds.length > 0) {
          const viewedClassesData = await Promise.all(
            viewedClassIds.slice(0, 10).map(async (classId) => {
              try {
                const classRef = firestoreDoc(db, "classes", classId);
                const classDoc = await getDoc(classRef);
                if (classDoc.exists()) {
                  const data = classDoc.data();
                  if (data.Category) viewedCategories.add(data.Category);
                  if (data.SubCategory) viewedSubCategories.add(data.SubCategory);
                  if (data.Type) viewedCategories.add(data.Type);
                  return data;
                }
              } catch (error) {
                console.error(`Error fetching viewed class ${classId}:`, error);
              }
              return null;
            })
          );
        }

        // Fetch all classes for recommendation
        const classesQuery = query(collection(db, "classes"));
        const classesSnapshot = await getDocs(classesQuery);

        const classesWithInstructors = await Promise.all(
          classesSnapshot.docs.map(async (doc) => {
            const classData = {
              id: doc.id,
              ...doc.data(),
            };

            // Skip if this class is already in recently viewed
            if (viewedClassIds.includes(classData.id)) {
              return null;
            }

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

            // Calculate recommendation score
            let score = 0;
            
            // Base score from rating and reviews
            score += avgRating * 0.4; // Weight rating heavily
            
            // Bonus for TopRated classes
            if (classData.TopRated) {
              score += 2.5;
            }
            
            // Category/SubCategory matching bonus
            if (viewedCategories.has(classData.Category) || viewedCategories.has(classData.Type)) {
              score += 3; // Strong preference for same category
            }
            if (viewedSubCategories.has(classData.SubCategory)) {
              score += 6; // Moderate preference for same subcategory
            }
            

            classData.recommendationScore = score;
            return classData;
          })
        );

        // Filter out null values and sort by recommendation score
        const validClasses = classesWithInstructors
          .filter(classItem => classItem !== null)
          .sort((a, b) => {
            // Primary sort: recommendation score
            if (b.recommendationScore !== a.recommendationScore) {
              return b.recommendationScore - a.recommendationScore;
            }
            // Secondary sort: average rating
            return b.averageRating - a.averageRating;
          });

        // If no viewed classes, show top-rated classes
        if (viewedClassIds.length === 0) {
          const topRatedClasses = validClasses
            .filter(classItem => classItem.TopRated || classItem.averageRating >= 4)
            .slice(0, 20);
          setClasses(topRatedClasses);
        } else {
          // Show personalized recommendations
          setClasses(validClasses.slice(0, 20));
        }

      } catch (error) {
        console.error("Error fetching recommended classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedClasses();
  }, [reviews, user]);

  const displayedClasses = activeFilter
    ? classes.filter((classItem) => ((classItem.Type === activeFilter) || (classItem.SubCategory === activeFilter)))
    : classes;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Always show recommendations section
  return (
    <div className="bg-[#fdebeb] box-border flex justify-start items-stretch flex-col w-[100.00%] section-spacing py-8">
      <div className="flex justify-between items-center">
        <div>
          {!activeFilter && (
            <p className="section-heading !text-left">Recommended For You</p>
          )}
          <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-[#261f22] mt-4 m-0 p-0">
            {displayedClasses.length > 0 && !loading 
              ? "Discover classes tailored to your interests"
              : "Explore amazing learning experiences"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 shadow-md hover:shadow-lg transition-shadow hover:bg-gray-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#261f22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 shadow-md hover:shadow-lg transition-shadow hover:bg-gray-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#261f22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div 
          ref={scrollContainerRef}
          id="classes-recommended" 
          className="gap-8 max-w-[100%] box-border mt-8 overflow-x-auto scrollbar-hide flex"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

export default RecommendedClassesSection;
