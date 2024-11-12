import { Button } from "@mui/base";
import ActivityDiscoverySection from "../ActivityDiscoverySection";
import StepConnect from "../StepConnect";
import ProgressTrackerWidget from "../ProgressTrackerWidget";
import Link from "next/link";

function DynamicContentLayout() {
  return (
    <div className="flex justify-start items-stretch flex-col w-[100.00%] box-border mt-10">
      <div className="flex justify-between items-start flex-row gap-[30px] grow-0 shrink-0 basis-auto">
        <div className="max-w-[343px] grow shrink basis-[0.00] box-border">
          <img
            src="/assets/image_42111b0a.png"
            alt=""
            className="h-[104px] max-w-[initial] w-[104px] block box-border"
          />
          <ActivityDiscoverySection />
        </div>
        <div className="max-w-[343px] grow shrink basis-[0.00] box-border">
          <img
            src="/assets/image_c8a477f5.png"
            alt=""
            className="h-[104px] max-w-[initial] w-[104px] block box-border"
          />
          <StepConnect />
        </div>
        <div className="max-w-[343px] grow shrink basis-[0.00] box-border">
          <img
            src="/assets/image_abe63efd.png"
            alt=""
            className="h-[104px] max-w-[initial] w-[104px] block box-border"
          />
          <ProgressTrackerWidget />
        </div>
      </div>
      {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
      <Link href="/">
        <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-sm font-semibold text-[white] min-w-[220px] h-[45px] w-[220px] cursor-pointer block box-border self-center grow-0 shrink-0 basis-auto mt-10 rounded-[100px] border-[none]">
          Find Classes
        </Button>
      </Link>
    </div>
  );
}

export default DynamicContentLayout;
