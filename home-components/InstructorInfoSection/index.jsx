import TopInstructorsSectionWithButton from "../TopInstructorsSectionWithButton";
import ExtracurricularInfoBlock from "../ExtracurricularInfoBlock";

function InstructorInfoSection({ activeFilter }) {
  return (
    <div>
      <TopInstructorsSectionWithButton activeFilter={activeFilter} />
      <ExtracurricularInfoBlock />
    </div>
  );
}

export default InstructorInfoSection;
