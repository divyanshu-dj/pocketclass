import { Button } from "@mui/base";
import SvgIcon1 from "./icons/SvgIcon1";

function SuperBox({ instructor }) {
  return (
    <div className="box-border flex justify-start items-stretch flex-row grow-0 shrink-0 basis-auto pt-4 pb-[172px] px-4 rounded-2xl">
      <div className="w-[55.15%] grow-0 shrink-0 basis-auto box-border pb-3.5">
        {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
        <Button className="bg-[white] [font-family:'DM_Sans',sans-serif] text-sm font-bold text-[#261f22] min-w-[135px] h-[26px] w-[135px] cursor-pointer block box-border rounded-[100px] border-[none]">
          Super Instructor
        </Button>
      </div>
      <div className="flex justify-start items-end flex-col w-[44.85%] grow-0 shrink-0 basis-auto box-border px-1.5">
        <div className="border backdrop-blur-[5.75px] bg-[rgba(81,76,78,0.50)] box-border flex justify-center items-center flex-col w-10 h-10 rounded-[20px] border-solid border-[white]">
          <SvgIcon1 className="w-5 h-5 text-white flex grow-0 shrink-0 basis-auto" />
        </div>
      </div>
    </div>
  );
}

export default SuperBox;
