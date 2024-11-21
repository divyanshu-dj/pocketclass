import { Button } from "@mui/base";
import MusicClassroomLayout from "../MusicClassroomLayout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { categories } from "../../utils/categories";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { MenuIcon, UserCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Notifications from "../../components/Notifications";
import { useRouter } from "next/router";

function AuthenticatedHeader() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);
  const [userData, setUserData] = useState(null);
  const [showDropDown, setDropDown] = useState(false);
  const [category, setCategory] = useState("");
  const router = useRouter();

  const toggleDropDown = () => {
    setDropDown(!showDropDown);
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "Users", user?.uid);
      const data = await getDoc(docRef);
      setUserData(data?.data());
      setCategory(data?.data()?.category);
    };

    user && getData();
  }, [user]);

  return (
    <div className="bg-[white] box-border max-w-[1440px] mx-auto sticky top-0">
      <div className="bg-white sticky top-0 z-40 box-border flex justify-between items-center flex-row gap-2 w-[100.00%] h-20 section-spacing">
        <Link className="cursor-pointer" href="/">
          <img
            src="/assets/image_5c0480a2.png"
            className="cursor-pointer h-12 object-contain w-[117px] md:w-36 lg:w-44 box-border block border-[none]"
          />
        </Link>

        <div className="flex justify-start items-center flex-row gap-4">
          {!loading ? (
            user ? (
              <div className="flex items-center gap-4">
                {category !== "" && user ? (
                  category !== "instructor" ? (
                    <p className="text-sm hidden lg:inline cursor-pointer hover:bg-gray-100 rounded-full space-x-2 p-3 hover:scale-105 active:scale-90 transition duration-150">
                      <a
                        target="_blank"
                        href="https://gm81lvnyohz.typeform.com/to/IoLpsf9g"
                      >
                        Request a Class
                      </a>
                    </p>
                  ) : (
                    <p
                      onClick={() => router.push("/createClass")}
                      className="text-sm hidden lg:inline cursor-pointer hover:bg-gray-100 rounded-full space-x-2 p-3 hover:scale-105 active:scale-90 transition duration-150"
                    >
                      Create Class
                    </p>
                  )
                ) : (
                  <Image
                    priority={true}
                    src="/Rolling-1s-200px.svg"
                    width={"30px"}
                    height={"30px"}
                    alt="Loading"
                  />
                )}

                {user && <Notifications user={user} />}

                <div
                  className="relative flex items-center space-x-2 border-2 p-2 rounded-full hover:bg-gray-100 cursor-pointer z-[999]"
                  onClick={toggleDropDown}
                >
                  <MenuIcon className="h-6 cursor-pointer" />
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      width={40}
                      height={48}
                      className="rounded-full cursor-pointer"
                      alt="User"
                    />
                  ) : (
                    <UserCircleIcon className="h-6 cursor-pointer" />
                  )}

                  {showDropDown && (
                    <div className="dropDown bg-white absolute top-[130%] right-3 rounded-md shadow-2xl h-auto w-[200px] p-5 z-50">
                      <ul>
                        <li className="my-2 hover:text-logo-red">
                          <Link href={`/profile/${user.uid}`}>Profile</Link>
                        </li>
                        <li className="my-2 hover:text-logo-red">
                          <Link href={`/myClass/${user.uid}`}>My Classes</Link>
                        </li>
                        {category === "instructor" && (
                          <li className="my-2 hover:text-logo-red">
                            <Link href="/withdraw">My Wallet</Link>
                          </li>
                        )}
                        {userData?.isAdmin && (
                          <li className="my-2 hover:text-logo-red">
                            <Link href="/vouchers">Vouchers</Link>
                          </li>
                        )}
                        <li className="my-2 hover:text-logo-red">
                          <Link href="/support">Support</Link>
                        </li>
                        {userData?.isAdmin && (
                          <li className="my-2 hover:text-logo-red">
                            <Link href="/dashboard">Dashboard</Link>
                          </li>
                        )}
                        <hr className="my-2" />
                        <li
                          className="my-2 hover:text-logo-red cursor-pointer"
                          onClick={() => signOut()}
                        >
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm hidden md:inline cursor-pointer hover:bg-gray-100 rounded-full space-x-2 p-3 hover:scale-105 active:scale-90 transition duration-150">
                  <a
                    target="_blank"
                    href="https://gm81lvnyohz.typeform.com/to/IoLpsf9g"
                  >
                    Request a Class
                  </a>
                </p>
                <Link
                  className="cursor-pointer"
                  href={{
                    pathname: "/Login",
                    query: { returnUrl: router.asPath },
                  }}
                >
                  <p className="cursor-pointer [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22]">
                    Log in
                  </p>
                </Link>
                <Link className="cursor-pointer" href="/Register">
                  <Button className="bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[91px] h-[43px] w-[91px] ml-[31px] rounded-[100px] border-2 border-solid border-[#261f22]">
                    Sign up
                  </Button>
                </Link>
              </>
            )
          ) : (
            <Image
              src="/Rolling-1s-200px.svg"
              width={30}
              height={30}
              alt="Loading"
            />
          )}
        </div>
      </div>

      <MusicClassroomLayout />
    </div>
  );
}

export default AuthenticatedHeader;
