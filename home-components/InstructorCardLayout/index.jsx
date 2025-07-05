import SuperInstructorCard from "../SuperInstructorCard";
import MusicianProfileCard2 from "../MusicianProfileCard2";

function InstructorCardLayout() {
  return (
    <div className="bg-white box-border flex flex-col rounded-2xl">
      <SuperInstructorCard />
      <MusicianProfileCard2 />
    </div>
  );
}

export default InstructorCardLayout;
