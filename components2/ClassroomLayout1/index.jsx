import InstructorInfoSection from "../InstructorInfoSection";
import ClassroomFooter from "../ClassroomFooter";

function ClassroomLayout1() {
  return (
    <div className="flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto">
      <InstructorInfoSection />
      <ClassroomFooter />
    </div>
  );
}

export default ClassroomLayout1;
