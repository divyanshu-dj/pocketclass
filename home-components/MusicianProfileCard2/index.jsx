import { Button } from "@mui/base";
import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import SvgIcon3 from "./icons/SvgIcon3";

function MusicianProfileCard2() {
  return (
    <div className="box-border grow-0 shrink-0 basis-auto px-[15px] py-4">
      <div className="flex justify-between items-start flex-row gap-2 w-[100.00%] box-border">
        <div className="grow-0 shrink-0 basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-xl font-bold text-[#261f22] m-0 p-0">Nicole Chung</p>
          <div className="flex justify-start items-center flex-row">
            <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto">
              <SvgIcon1 className="w-4 h-4 flex grow-0 shrink-0 basis-auto" />
              <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-[#7d797a] grow-0 shrink-0 basis-auto ml-[7px] m-0 p-0">Music</p>
            </div>
            <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto ml-[3px]">
              <img src="/assets/image_7a2617f3.png" alt="" className="h-1 max-w-[initial] w-1 block box-border" />
              <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-[#7d797a] grow-0 shrink-0 basis-auto ml-[3px] m-0 p-0">Piano</p>
            </div>
          </div>
          <div className="flex justify-start items-center flex-row mt-2">
            <SvgIcon2 className="w-5 h-5 text-[#261f22] flex grow-0 shrink-0 basis-auto" />
            <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto ml-[3px]">
              <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">4.8</p>
              <p className="[font-family:'DM_Sans',sans-serif] text-base font-normal text-[#261f22] grow-0 shrink-0 basis-auto ml-1.5 m-0 p-0">(124 reviews)</p>
            </div>
          </div>
        </div>
        <div className="flex justify-start items-end flex-col grow-0 shrink-0 basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold leading-6 text-[#261f22] grow-0 shrink-0 basis-auto m-0 pl-[21px] p-0">$78</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-normal text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">per hour</p>
        </div>
      </div>
      <div className="flex justify-start items-center flex-row mt-4">
        {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
        <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-sm font-semibold text-[white] min-w-[220px] h-[45px] w-[220px] cursor-pointer block box-border grow-0 shrink-0 basis-auto rounded-[100px] border-[none]">
          Button
        </Button>
        <SvgIcon3 className="w-6 h-6 flex grow-0 shrink-0 basis-auto ml-[18px]" />
      </div>
    </div>
  );
}

export default MusicianProfileCard2;
