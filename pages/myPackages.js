import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import NewHeader from "../components/NewHeader";
import StudentCard from "../components/StudentPackageCard";
import Head from "next/head";

export default function myPackages() {
  // Get packages of the user
  const [packages, setPackages] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const fetchPackages = async () => {
      const packagesRef = collection(db, "Packages");
      const q = query(packagesRef, where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const packages = querySnapshot.docs.map((doc) => doc.data());
      setPackages(packages);
    };
    if (user) {
      fetchPackages();
    }
  }, [user]);
  return (
    <div className="myClassesContainer mx-auto">
      <Head>
        <title>My Packages</title>
        <meta name="description" content="My Packages" />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>

      <NewHeader />

      <h1 className="text-center text-4xl font-bold py-[50px]">My Packages</h1>
      <div className="mx-4 flex flex-col gap-2">
        {packages.map((packageDetails, index) => (
          <StudentCard key={index} packageDetails={packageDetails} />
        ))}
        {packages.length === 0 && (
          <p className="text-center text-logo-red text-xl font-semibold">
            No packages found.
          </p>
        )}
      </div>
    </div>
  );
}
