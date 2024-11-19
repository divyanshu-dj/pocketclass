import { Button } from "@mui/base";
import MusicClassroomLayout from "../MusicClassroomLayout";
import Link from "next/link";
import React from "react";
import { categories } from "../../utils/categories";

function AuthenticatedHeader() {
  return (
    <div className="bg-[white] box-border max-w-[1440px] mx-auto sticky top-0">
      <div className="bg-white sticky top-0 z-40 box-border flex justify-between items-center flex-row gap-2 w-[100.00%] h-20 section-spacing">
        <Link className="cursor-pointer" href="/">
          <img
            src="/assets/image_5c0480a2.png"
            className="cursor-pointer h-12 object-contain w-[117px] md:w-36 lg:w-44 box-border block border-[none]"
          />
        </Link>

        <div className="hidden md:flex justify-start items-center flex-row">
          <Link className="cursor-pointer" href="/Login">
            <p className="cursor-pointer [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">
              Log in
            </p>
          </Link>
          <Link className="cursor-pointer" href="/Register">
            <Button className="bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[91px] h-[43px] w-[91px] cursor-pointer block box-border grow-0 shrink-0 basis-auto ml-[31px] rounded-[100px] border-2 border-solid border-[#261f22]">
              Sign up
            </Button>
          </Link>
        </div>
      </div>

      <MusicClassroomLayout />
    </div>
  );
}

export default AuthenticatedHeader;
