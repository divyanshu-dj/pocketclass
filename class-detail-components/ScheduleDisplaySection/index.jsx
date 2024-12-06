import { Button } from "@mui/base";
import ReviewDisplaySection1 from "../ReviewDisplaySection1";
import ScheduleDisplay from "../ScheduleDisplay";
import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";

function ScheduleDisplaySection({ timeSlotOptions, reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray }) {
  return (
    <div className="w-[100.00%] box-border">
      <div className="flex justify-between items-center flex-row gap-2 w-[100.00%] box-border pr-[3px]">
        <div className="grow-0 shrink-0 basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">Schedule</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[#7d797a] mt-2 m-0 p-0">Select date and time</p>
        </div>
        <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto">
          {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
          <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[80px] h-[43px] w-20 cursor-pointer block box-border grow-0 shrink-0 basis-auto rounded-[100px] border-2 border-solid border-[#261f22]">
            Single
          </Button>
          {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
          <Button className="bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[80px] h-[43px] w-20 cursor-pointer block box-border grow-0 shrink-0 basis-auto ml-[18px] rounded-[100px] border-2 border-solid border-[#261f22]">
            Group
          </Button>
        </div>
      </div>
      <div className="flex justify-start items-stretch flex-row w-[100.00%] box-border mt-[42px]">
        <div className="flex justify-start items-stretch flex-col w-[47.98%] grow-0 shrink-0 basis-auto box-border">
          <div className="ml-[-79px] flex justify-between items-center flex-row gap-[78px] min-w-[330px] self-center grow-0 shrink-0 basis-auto box-border">
            <SvgIcon1 className="w-3.5 h-3.5 flex grow-0 shrink-0 basis-auto" />
            <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">November 2024</p>
            <SvgIcon2 className="w-3.5 h-3.5 flex grow-0 shrink-0 basis-auto" />
          </div>
          <ReviewDisplaySection1
            reviewCountsArray2={reviewCountsArray2}
            dynamicReviewCountsArray={dynamicReviewCountsArray}
            dynamicReviewCountsArray1={dynamicReviewCountsArray1}
            reviewCountsArray={reviewCountsArray}
          />
        </div>
        <div className="flex justify-center items-stretch flex-col w-[52.02%] grow-0 shrink-0 basis-auto box-border pt-11 pb-[19px] px-[15px]">
          <ScheduleDisplay timeSlotOptions={timeSlotOptions} />
          <p className="[font-family:Inter,sans-serif] text-base font-semibold underline text-[#261f22] grow-0 shrink-0 basis-auto mt-[26px] m-0 p-0">Time request</p>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDisplaySection;
