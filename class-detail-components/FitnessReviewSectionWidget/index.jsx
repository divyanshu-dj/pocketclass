import DynamicButtonSection from "../DynamicButtonSection";
import FitnessReviewSectionContainer from "../FitnessReviewSectionContainer";
import ReviewSectionWidget from "../ReviewSectionWidget";

function FitnessReviewSectionWidget({
  classId,
  reviewCountsArray1,
  classTitle,
  classData,
  classCreatorData,
}) {
  return (
    <div className="w-full box-border mt-12">
      <FitnessReviewSectionContainer
        classId={classId}
        reviewCountsArray1={reviewCountsArray1}
        classTitle={classTitle}
      />
      <div
        className="w-[90%] xl:hidden shadow-[1px_1px_7px_rgba(0,0,0,0.20)] bg-[white] box-border flex justify-start items-stretch flex-col  lg:max-w-[90%] pt-6 px-4 md:px-6 rounded-xl md:rounded-2xl lg:rounded-3x"
        style={{ margin: "auto", marginTop: "20px" }}
      >
        <DynamicButtonSection
          classId={classId} 
          classData={classData}
          instructorId={classCreatorData?.userUid}
          below={true}
        />
      </div>
      <ReviewSectionWidget classId={classId} />
    </div>
  );
}

export default FitnessReviewSectionWidget;
