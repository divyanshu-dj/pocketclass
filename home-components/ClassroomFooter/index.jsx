import ClassroomLayout from "../ClassroomLayout";
import Link from "next/link";
import {Button} from "@mui/base";

function ClassroomFooter() {
  return (
    <div className="flex justify-start items-stretch flex-col pt-20 pb-4 section-spacing">
      <ClassroomLayout />
      <div className="flex justify-between items-center flex-col md:flex-row gap-10 md:gap-2 w-full md:w-[80%] self-center mt-24 [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">
        <div className="flex justify-start items-center flex-col md:flex-row gap-1 md:gap-[30px]">
          <p className="hidden md:block">© pocketclass</p>
          <p className="">About us</p>
          <p className="">Instructor Guide</p>
          <p className="">Student Guide</p>
          <p className="">Blog</p>
        </div>
        <div className="flex gap-0.5 md: justify-start items-center flex-col md:flex-row">
          <p className="">Help center</p>
          <p className="md:ml-[30px]">Terms and Conditions</p>
        </div>

        <p className="block md:hidden">© pocketclass</p>

        <div className="flex md:hidden gap-4 items-center">
          <Link href="/Login">
            <p className="cursor-pointer [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">
              Log in
            </p>
          </Link>
          <Link href="/Register">
            <Button className="bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[91px] h-[43px] w-[91px] cursor-pointer block box-border grow-0 shrink-0 basis-auto ml-[31px] rounded-[100px] border-2 border-solid border-[#261f22]">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClassroomFooter;
