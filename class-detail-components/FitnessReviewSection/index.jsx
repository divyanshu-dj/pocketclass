import ReviewDisplaySection2 from "../ReviewDisplaySection2";

function FitnessReviewSection({ classId, reviewCountsArray1, classTitle }) {
  return (
    <div className="w-[100.00%] box-border">
      <div className="w-[100.00%] box-border max-lg:text-center">
        <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
          Reviews
        </p>
        <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[#7d797a] mt-2 m-0 p-0">
          {classTitle}
        </p>
      </div>
      <ReviewDisplaySection2
        classId={classId}
        reviewCountsArray1={reviewCountsArray1}
      />
    </div>
  );
}

export default FitnessReviewSection;
