import { Skeleton } from "@mui/material";
import SuperInstructorCard from "../SuperInstructorCard";
import MusicianProfileCard1 from "../MusicianProfileCard1";

function InstructorSection({ instructor, loading }) {
  if (loading) {
    return (
      <div className="shrink-0 bg-[white] box-border flex justify-start items-stretch flex-col grow basis-[0.00] rounded-2xl">
        <div className="pt-4 pb-[172px] px-4">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            animation="wave"
            sx={{ borderRadius: '16px' }}
          />
        </div>
        <div className="px-[15px] py-4">
          <Skeleton variant="text" width="70%" height={30} animation="wave" />
          <Skeleton variant="text" width="50%" height={20} animation="wave" />
          <div className="mt-4">
            <Skeleton
              variant="rectangular"
              width={220}
              height={45}
              animation="wave"
              sx={{ borderRadius: '100px' }}
            />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col grow shrink basis-[0.00] rounded-2xl">
      <SuperInstructorCard instructorImg={instructor?.profileImage} />
      <MusicianProfileCard1 instructor={instructor} />
    </div>
  );
}

export default InstructorSection;
