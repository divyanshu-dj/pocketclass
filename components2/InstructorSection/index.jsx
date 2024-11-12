import SuperInstructorCard from "../SuperInstructorCard/index";
import MusicianProfileCard1 from "../MusicianProfileCard1";


function InstructorSection({ instructor }) {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col grow shrink basis-[0.00] rounded-2xl">
      <SuperInstructorCard instructorImg={instructor?.profileImage} />
      <MusicianProfileCard1 instructor={instructor} />
    </div>
  );
}

export default InstructorSection;
