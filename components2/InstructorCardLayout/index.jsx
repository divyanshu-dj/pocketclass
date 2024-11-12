import SuperInstructorCard from "../SuperInstructorCard";
import MusicianProfileCard2 from "../MusicianProfileCard2";

function InstructorCardLayout() {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col grow shrink basis-[0.00] rounded-2xl">
      <SuperInstructorCard />
      <MusicianProfileCard2 />
    </div>
  );
}

export default InstructorCardLayout;
