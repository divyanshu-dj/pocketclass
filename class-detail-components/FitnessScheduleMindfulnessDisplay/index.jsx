import FitnessScheduleDisplay from "../FitnessScheduleDisplay";
import MindfulPackageDisplay from "../MindfulPackageDisplay";

function FitnessScheduleMindfulnessDisplay({ classId, timeSlotOptions, mindfulClassCardOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray }) {
  return (
    <div className="w-[100.00%] box-border mt-10">
      {/* <FitnessScheduleDisplay
        timeSlotOptions={timeSlotOptions}
        reviewCountsArray2={reviewCountsArray2}
        dynamicReviewCountsArray={dynamicReviewCountsArray}
        dynamicReviewCountsArray1={dynamicReviewCountsArray1}
        reviewCountsArray={reviewCountsArray}
      /> */}
      <MindfulPackageDisplay classId={classId} mindfulClassCardOptions={mindfulClassCardOptions} />
    </div>
  );
}

export default FitnessScheduleMindfulnessDisplay;
