import { useState } from "react";
import MusicSelector from "../MusicSelector";
import ClassroomLayout1 from "../ClassroomLayout1";
import TopClassesSection from "../TopInstructorsSection";

function MusicClassroomLayout() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="mt-[-3px] flex justify-start items-stretch flex-col w-[100.00%] box-border">
      <MusicSelector onFilterChange={setActiveFilter} />
      <ClassroomLayout1 activeFilter={activeFilter} />
    </div>
  );
}

export default MusicClassroomLayout;
