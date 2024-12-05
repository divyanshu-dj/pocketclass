import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Progress } from "antd";

function ReviewDisplaySection({ classId = null }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!classId) return;

      const reviewsRef = collection(db, "Reviews");
      const q = query(reviewsRef, where("classID", "==", classId));
      const querySnapshot = await getDocs(q);

      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(reviewsData);
    };

    fetchReviews();
  }, [classId]);

  const getReviewRating = (review) => {
    return Math.round(
      (review.safetyRating + review.recommendRating + review.qualityRating) / 3
    );
  };

  const starCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    const rating = getReviewRating(review);
    console.log("rating: ", rating);
    starCounts[rating]++;
  });

  const totalReviews = reviews.length;

  return (
    <div className="flex flex-col gap-2 ml-8">
      {[5, 4, 3, 2, 1].map((stars) => (
        <div key={stars} className="flex items-center gap-4">
          <span className="w-12" style={{ textAlign: "center" }}>
            {stars}
          </span>
          <Progress
            percent={(starCounts[stars] / totalReviews) * 100}
            showInfo={false}
            strokeColor="#DAA520"  // Golden color
            // trailColor="#d4d2d3"
            strokeWidth={12}
            className="w-[200px]"
          />
          <span>{starCounts[stars]}</span>
        </div>
      ))}
    </div>
  );
}

export default ReviewDisplaySection;
