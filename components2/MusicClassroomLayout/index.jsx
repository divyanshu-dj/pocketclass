import MusicSelector from "../MusicSelector";
import ClassroomLayout1 from "../ClassroomLayout1";

function MusicClassroomLayout() {
  return (
    <div className="mt-[-3px] flex justify-start items-stretch flex-col w-[100.00%] box-border">
      <MusicSelector />
      <ClassroomLayout1 />
    </div>
  );
}

export default MusicClassroomLayout;
