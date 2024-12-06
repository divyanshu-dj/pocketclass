import FitnessReviewSection from "../FitnessReviewSection";

function FitnessReviewSectionContainer({ classId, reviewCountsArray1, classTitle }) {
  return (
    <div className="w-[100.00%] box-border">
      <FitnessReviewSection classTitle={classTitle} classId={classId} reviewCountsArray1={reviewCountsArray1} />
      <div className="w-[100.00%] box-border mt-10 border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default FitnessReviewSectionContainer;
