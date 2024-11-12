import TopInstructorsSectionWithButton from "../TopInstructorsSectionWithButton";
import ExtracurricularInfoBlock from "../ExtracurricularInfoBlock";

function InstructorInfoSection() {
  return (
    <div className="bg-[#fdebeb] box-border grow-0 shrink-0 basis-auto">
      <TopInstructorsSectionWithButton />
      <ExtracurricularInfoBlock />
    </div>
  );
}

export default InstructorInfoSection;
