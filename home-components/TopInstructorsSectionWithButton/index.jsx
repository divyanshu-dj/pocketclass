import { useState } from "react";
import { Button } from "@mui/base";
import TopInstructorsSection from "../TopInstructorsSection";

function TopInstructorsSectionWithButton({ activeFilter }) {
  const [showAll, setShowAll] = useState(false);
  const [classCount, setClassCount] = useState(0);

  function toggleShowAll() {
    setShowAll(!showAll);
  }

  return (
    <div className="bg-[#fdebeb] box-border flex justify-start items-stretch flex-col w-[100.00%] section-spacing py-8">
      <TopInstructorsSection
        showAll={showAll}
        activeFilter={activeFilter}
        onClassesLoad={(count) => setClassCount(count)}
      />
      {classCount === 0 ? (
        <p className="text-center text-lg font-semibold mt-8">No classes available</p>
      ) : classCount > 4 && (
        <Button onClick={toggleShowAll} className="bg-transparent [font-family:Inter,sans-serif] self-center w-full md:w-44 text-center text-base font-semibold text-[#261f22] min-w-[176px] h-[47px] cursor-pointer block box-border mt-12 rounded-[100px] border-2 border-solid border-[#261f22]">
          {!showAll ? "See All" : "See Less"}
        </Button>
      )}
    </div>
  );
}

export default TopInstructorsSectionWithButton;