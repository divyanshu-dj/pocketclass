import { Button } from "@mui/base";
import MusicClassroomLayout from "../MusicClassroomLayout";
import Link from "next/link";
import React from "react";

function AuthenticatedHeader() {
  return (
    <div className="bg-[white] box-border max-w-[1440px] mx-auto">
      <div className="bg-[white] box-border flex justify-between items-center flex-row gap-2 w-[100.00%] h-20 md:h-24 section-spacing">
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

        <div className="flex flex-col gap-4 md:hidden mb-12 mt-3 section-spacing">
            <div className="flex flex-col gap-2">
                <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-[16px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                                stroke="#7D797A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 20.9999L16.65 16.6499" stroke="#7D797A" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="searchByKeyword"
                        id="searchByKeyword"
                        placeholder="Music, art or sport class"
                        className="bg-white border !border-[#D4D2D3] rounded-[100px] pl-[50px] pr-3 py-4 focus:!outline-none w-full"
                    />
                </div>
                <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-[16px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                                stroke="#7D797A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                stroke="#7D797A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="searchByKeyword"
                        id="searchByKeyword"
                        placeholder="Enter your location"
                        className="bg-white border !border-[#D4D2D3] rounded-[100px] pl-[50px] pr-3 py-4 focus:!outline-none w-full"
                    />
                </div>
            </div>
            <Button
                className="bg-transparent [font-family:Inter,sans-serif] self-center w-full text-center bg-[#261F22] text-white text-base font-semibold min-w-[176px] h-[47px] cursor-pointer block box-border rounded-[100px] border-2 border-solid border-[#261f22]">
                Find a class
            </Button>
        </div>

        <MusicClassroomLayout/>
    </div>
  );
}

export default AuthenticatedHeader;
