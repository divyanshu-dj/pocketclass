import FitnessClassDetailsSection from "../FitnessClassDetailsSection";
import NewHeader from "../../components/NewHeader";

function FitnessClassOverviewWidget({ timeSlotOptions, reviewCountsArray1, mindfulClassCardOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray, classId, userId }) {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col pt-6 pb-4">
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
      <div className="flex justify-between items-center flex-row gap-2 min-w-[1314px] self-center grow-0 shrink-0 basis-auto box-border mt-[127px]">
        <div className="flex justify-start items-center flex-row gap-[30px] grow-0 shrink-0 basis-auto">
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">© pocketclass</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">About us</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Instructor Guide</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Student Guide</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Blog</p>
        </div>
        <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto">
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Help center</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto ml-[30px] m-0 p-0">Terms and Conditions</p>
        </div>
      </div>
    </div>
  );
}

export default FitnessClassOverviewWidget;
