import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Rate } from "antd";
import ReviewDisplaySection from "../ReviewDisplaySection";

function ReviewStatisticsSection({ classId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

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

      // Calculate average rating
      let totalRating = 0;
      reviewsData.forEach((review) => {
        totalRating +=
          (review.safetyRating +
            review.recommendRating +
            review.qualityRating) /
          3;
      });
      setAvgRating(
        reviewsData.length > 0 ? totalRating / reviewsData.length : 0
      );
    };

    fetchReviews();
  }, [classId]);

  return (
    <div className="flex justify-start items-start flex-col md:flex-row gap-3 md:gap-0 grow-0 shrink-0 basis-auto">
      <div className="flex justify-start items-stretch flex-col gap-[15px] w-[135px] grow-0 shrink-0 basis-auto box-border pb-[5px]">
        <p className="[font-family:'DM_Sans',sans-serif] text-[64px] font-bold text-center leading-8 text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">
          {avgRating?.toFixed(1)}
        </p>
        <Rate disabled value={avgRating} allowHalf style={{ fontSize: 20 }} />
        <p className="[font-family:'DM_Sans',sans-serif] text-base font-normal text-center text-[#261f22] mt-[-2.25px] grow-0 shrink-0 basis-auto m-0 p-0">
          ({reviews.length} reviews)
        </p>
      </div>
      <ReviewDisplaySection classId={classId} reviewCountsArray1={reviews} />
    </div>
  );
}

export default ReviewStatisticsSection;
