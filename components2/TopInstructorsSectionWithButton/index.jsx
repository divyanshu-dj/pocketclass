import { useState } from "react";
import { Button } from "@mui/base";
import TopInstructorsSection from "../TopInstructorsSection";

function TopInstructorsSectionWithButton() {
  const [showAll, setShowAll] = useState(false);
  function toggleShowAll() {
    setShowAll(!showAll);
  }
  return (
    <div className="bg-[#fdebeb] box-border flex justify-start items-stretch flex-col w-[100.00%] section-spacing py-8">
      <TopInstructorsSection showAll={showAll} />
      {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
      <Button onClick={toggleShowAll} className="bg-transparent [font-family:Inter,sans-serif] self-center w-full md:w-44 text-center text-base font-semibold text-[#261f22] min-w-[176px] h-[47px] cursor-pointer block box-border mt-12 rounded-[100px] border-2 border-solid border-[#261f22]">
        {!showAll ?  "See All" : "See Less"}
      </Button>
    </div>
  );
}

export default TopInstructorsSectionWithButton;
