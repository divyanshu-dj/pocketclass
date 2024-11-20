import SuperInstructorBox from "../SuperInstructorBox";
import MusicianProfileCard from "../MusicianProfileCard";

function InstructorProfileSection() {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col grow shrink basis-[0.00] rounded-2xl">
      <SuperInstructorBox />
      <MusicianProfileCard />
    </div>
  );
}

export default InstructorProfileSection;
