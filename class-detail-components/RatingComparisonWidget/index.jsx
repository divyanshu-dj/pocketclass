import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function RatingComparisonWidget({ classId }) {
  const [avgRecommend, setAvgRecommend] = useState(0);
  const [avgQuality, setAvgQuality] = useState(0);
  const [avgSafety, setAvgSafety] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!classId) return;

      const reviewsRef = collection(db, "Reviews");
      const q = query(reviewsRef, where("classID", "==", classId));
      const querySnapshot = await getDocs(q);

      const reviewsData = querySnapshot.docs.map((doc) => doc.data());

      if (reviewsData.length > 0) {
        const totalRecommend = reviewsData.reduce(
          (sum, review) => sum + review.recommendRating,
          0
        );
        const totalQuality = reviewsData.reduce(
          (sum, review) => sum + review.qualityRating,
          0
        );
        const totalSafety = reviewsData.reduce(
          (sum, review) => sum + review.safetyRating,
          0
        );

        setAvgRecommend(totalRecommend / reviewsData.length);
        setAvgQuality(totalQuality / reviewsData.length);
        setAvgSafety(totalSafety / reviewsData.length);
      }
    };

    fetchReviews();
  }, [classId]);

  return (
    <div className="flex justify-start items-start flex-row gap-4 md:gap-[22.5px] max-w-[480px] grow-0 shrink basis-auto box-border md:ml-[23.5px]">
      <div className="hidden 2xl:block h-[124px] box-border w-px grow-0 shrink-0 basis-auto border-l-[#d4d2d3] border-l border-solid" />
      <div className="grow-0 shrink basis-[122px] box-border">
        <p className="[font-family:'DM_Sans',sans-serif] text-base md:text-lg font-bold text-left leading-7 text-[#261f22] w-[100.00%] box-border m-0 p-0">
          Recommend
        </p>
        <p
          className="[font-family:'DM_Sans',sans-serif] text-[32px] font-bold leading-8 text-[#261f22] mt-12 m-0 p-0"
          style={{ textAlign: "center" }}
        >
          {avgRecommend.toFixed(1)}
        </p>
      </div>
      <div className="h-[124px] box-border w-px grow-0 shrink-0 basis-auto border-l-[#d4d2d3] border-l border-solid" />
      <div className="grow-0 shrink basis-[121px] box-border">
        <p className="[font-family:'DM_Sans',sans-serif] text-base md:text-lg font-bold text-center lg:text-left leading-7 text-[#261f22] w-[100.00%] box-border m-0 p-0">
          Quality
        </p>

        <p
          className="[font-family:'DM_Sans',sans-serif] text-[32px] font-bold leading-8 text-[#261f22] mt-12 m-0 p-0"
          style={{ textAlign: "center" }}
        >
          {avgQuality.toFixed(1)}
        </p>
      </div>
      <div className="h-[124px] box-border w-px grow-0 shrink-0 basis-auto border-l-[#d4d2d3] border-l border-solid" />
      <div className="grow-0 shrink basis-[122px] box-border">
        <p className="[font-family:'DM_Sans',sans-serif] text-base md:text-lg font-bold text-center lg:text-left leading-7 text-[#261f22] w-[100.00%] box-border m-0 p-0">
          Safety
        </p>
        <p
          className="[font-family:'DM_Sans',sans-serif] text-[32px] font-bold text-center leading-8 text-[#261f22] box-border mt-12 m-0 p-0"
          style={{ textAlign: "center" }}
        >
          {avgSafety.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default RatingComparisonWidget;
