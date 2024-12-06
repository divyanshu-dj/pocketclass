import FitnessClassDetailsSection from "../FitnessClassDetailsSection";
import NewHeader from "../../components/NewHeader";
import ClassroomFooter from "../../home-components/ClassroomFooter";

function FitnessClassOverviewWidget({ timeSlotOptions, reviewCountsArray1, mindfulClassCardOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray, classId, userId }) {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col md:pt-6 pb-4">
      <NewHeader />
      <FitnessClassDetailsSection
        timeSlotOptions={timeSlotOptions}
        reviewCountsArray1={reviewCountsArray1}
        mindfulClassCardOptions={mindfulClassCardOptions}
        reviewCountsArray2={reviewCountsArray2}
        dynamicReviewCountsArray={dynamicReviewCountsArray}
        dynamicReviewCountsArray1={dynamicReviewCountsArray1}
        reviewCountsArray={reviewCountsArray}
        classId={classId}
        userId={userId}
      />
      <ClassroomFooter isHome={false} />  
    </div>
  );
}

export default FitnessClassOverviewWidget;
