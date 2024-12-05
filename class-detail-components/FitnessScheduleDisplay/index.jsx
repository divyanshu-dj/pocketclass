import ScheduleDisplaySection from "../ScheduleDisplaySection";

function FitnessScheduleDisplay({ timeSlotOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray }) {
  return (
    <div className="w-[100.00%] box-border">
      <ScheduleDisplaySection
        timeSlotOptions={timeSlotOptions}
        reviewCountsArray2={reviewCountsArray2}
        dynamicReviewCountsArray={dynamicReviewCountsArray}
        dynamicReviewCountsArray1={dynamicReviewCountsArray1}
        reviewCountsArray={reviewCountsArray}
      />
      <div className="w-[100.00%] box-border mt-[39px] border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default FitnessScheduleDisplay;
