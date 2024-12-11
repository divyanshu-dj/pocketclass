import FitnessScheduleDisplay from "../FitnessScheduleDisplay";
import MindfulPackageDisplay from "../MindfulPackageDisplay";

function FitnessScheduleMindfulnessDisplay({ classData, classId, timeSlotOptions, mindfulClassCardOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray }) {
  return (
    <div className="w-full lg:w-[77.00%] box-border mt-10">
      <MindfulPackageDisplay classData={classData} classId={classId} mindfulClassCardOptions={mindfulClassCardOptions} />
    </div>
  );
}

export default FitnessScheduleMindfulnessDisplay;
