import ClassOverviewLayout from "../ClassOverviewLayout";
import InstructorFinderView from "../InstructorFinderView";
import ExtracurricularCard from "../ExtracurricularCard";
import TeachingPassionBanner from "../TeachingPassionBanner";

function ClassroomLayout() {
  return (
    <div className="flex justify-start items-stretch flex-col gap-[200px] grow-0 shrink-0 basis-auto">
      <ClassOverviewLayout />
      <InstructorFinderView />
      <ExtracurricularCard />
      <TeachingPassionBanner />
    </div>
  );
}

export default ClassroomLayout;
