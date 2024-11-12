import ClassroomLayout from "../ClassroomLayout";

function ClassroomFooter() {
  return (
    <div className="box-border flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto pt-20 pb-4">
      <ClassroomLayout />
      <div className="flex justify-between items-center flex-row gap-2 min-w-[1314px] self-center grow-0 shrink-0 basis-auto box-border mt-24">
        <div className="flex justify-start items-center flex-row gap-[30px] grow-0 shrink-0 basis-auto">
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">© pocketclass</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">About us</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Instructor Guide</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Student Guide</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Blog</p>
        </div>
        <div className="flex justify-start items-center flex-row grow-0 shrink-0 basis-auto">
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">Help center</p>
          <p className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto ml-[30px] m-0 p-0">Terms and Conditions</p>
        </div>
      </div>
    </div>
  );
}

export default ClassroomFooter;
