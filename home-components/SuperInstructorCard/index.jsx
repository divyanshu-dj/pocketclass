import { Button } from "@mui/base";
import SvgIcon1 from "./icons/SvgIcon1";

function SuperInstructorCard({instructorImg = '', superInstructor = false}) {
  return (
    <div 
      className="box-border flex justify-start items-stretch flex-row grow-0 shrink-0 basis-auto pt-4 pb-[172px] px-4 rounded-2xl bg-cover bg-center"
      style={{
        backgroundImage: !instructorImg ? "url('https://s3-alpha-sig.figma.com/img/0a4e/e6d8/04f1b8bc98ca9140f475bc83c632e5c6?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SfAp96~SAW71bK5RsMaHR94JrlWn4y2lSq4S04HFSW07iiQJ5oUMcwNnELdYWkYjOfWBZ9bEFcvW950C-PhcgDmW~s12XGrEaUtIZd5gLo5L2-9lYO-YVQqha6XUZxwLVwPnEaySbyZW~BY89p2z-EfTAtMpbEf6FpO7fAX-RNIge2H4bgL9Kq4BBPPBU~E5Aj-G6bVSznIbwxtjiIfBWESPoedzrpVM1sD4t9m6uNbWWIbhc24ysqRbEvRYvhKbJ615L78etjqmNcwY5NO-YVC5CO~l71Fob43W2sQC4WojfZjGMslkcx6BNWY1kyl6UkJFRyCkh6tu8L2lE~Va~A__')" : `url(${instructorImg})`
      }}
    >
      <div className="w-[55.15%] grow-0 shrink-0 basis-auto box-border pb-3.5">
       {superInstructor && <Button className="bg-[white] [font-family:'DM_Sans',sans-serif] text-sm font-bold text-[#261f22] min-w-[135px] h-[26px] w-[135px] cursor-pointer block box-border rounded-[100px] border-[none]">
          Super Instructor
        </Button>}
      </div>
      <div className="flex justify-start items-end flex-col w-[44.85%] grow-0 shrink-0 basis-auto box-border px-1.5">
        <div className="border backdrop-blur-[5.75px] bg-[rgba(81,76,78,0.50)] box-border flex justify-center items-center flex-col w-10 h-10 rounded-[20px] border-solid border-[white]">
          <SvgIcon1 className="w-5 h-5 text-white flex grow-0 shrink-0 basis-auto" />
        </div>
      </div>
    </div>
  );
}

export default SuperInstructorCard;
