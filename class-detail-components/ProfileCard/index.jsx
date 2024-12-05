import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Rate } from "antd";

function ProfileCard({ classId }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? reviews : reviews.slice(0, 2);

  const getTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return "Just now";
    }

    const now = new Date();
    const reviewDate = timestamp.toDate();
    const diffInMilliseconds = now - reviewDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    return `${diffInYears} years ago`;
  };

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
    return (
      (review.safetyRating + review.recommendRating + review.qualityRating) / 3
    );
  };

  return (
    <>
      <div className="w-[100.00%] box-border">
        <div
          className="flex justify-between items-start flex-row gap-[78px] w-[100.00%] box-border"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
        >
          {reviewsToShow.map((review) => (
            <div
              key={review.id}
              className="max-w-[394px] grow shrink basis-[0.00] box-border"
            >
              <div className="flex justify-start items-start flex-row">
                <img
                  src={review.photo || "/assets/image_7814b352.jpeg"}
                  className="h-[85px] max-w-[initial] object-fill w-[99px] [clip-path:path('M99.1667,42.5c0,23.4721_-22.1992,42.5_-49.5834,42.5c-27.3841,0_-49.5833,-19.0279_-49.5833,-42.5c0,-23.4721_22.1992,-42.5_49.5833,-42.5c27.3842,0_49.5834,19.0279_49.5834,42.5z')] block box-border"
                />
                <div className="w-[177px] grow-0 shrink-0 basis-auto box-border ml-5">
                  <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
                    {review.name}
                  </p>
                  <Rate
                    disabled
                    defaultValue={getReviewRating(review)}
                    allowHalf
                    style={{ fontSize: 15 }}
                  />
                  {review?.createdAt && (
                    <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-[#a8a5a7] mt-[18px] m-0 p-0">
                      {getTimeAgo(review.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[#261f22] w-[100.00%] box-border mt-[18px] m-0 p-0">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
      {reviews.length > 2 && (
        <p
          className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-8 m-0 p-0 cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "- Show less reviews" : "+ Show more reviews"}
        </p>
      )}
    </>
  );
}

export default ProfileCard;
