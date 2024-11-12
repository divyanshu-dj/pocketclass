import { useState } from "react";
import { Button } from "@mui/base";
import TopInstructorsSection from "../TopInstructorsSection";

function TopInstructorsSectionWithButton() {
  const [showAll, setShowAll] = useState(false);
  function toggleShowAll() {
    setShowAll(!showAll);
  }
  return (
    <div className="bg-[#fdebeb] box-border flex justify-start items-stretch flex-col w-[100.00%] py-8">
      <TopInstructorsSection showAll={showAll} />
      {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
      <Button onClick={toggleShowAll} className="bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[176px] h-[47px] w-44 cursor-pointer block box-border self-center grow-0 shrink-0 basis-auto mt-12 rounded-[100px] border-2 border-solid border-[#261f22]">
        {!showAll ?  "See More" : "See Less"}
      </Button>
    </div>
  );
}

export default TopInstructorsSectionWithButton;
