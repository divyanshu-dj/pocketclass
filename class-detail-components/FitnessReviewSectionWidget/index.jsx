import FitnessReviewSectionContainer from "../FitnessReviewSectionContainer";
import ReviewSectionWidget from "../ReviewSectionWidget";

function FitnessReviewSectionWidget({ classId, reviewCountsArray1, classTitle }) {
  return (
    <div className="w-[100.00%] box-border mt-12">
      <FitnessReviewSectionContainer
        classId={classId}
        reviewCountsArray1={reviewCountsArray1}
        classTitle={classTitle}
      />
      <ReviewSectionWidget classId={classId} />
    </div>
  );
}

export default FitnessReviewSectionWidget;
