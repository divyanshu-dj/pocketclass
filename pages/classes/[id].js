import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { mockData } from "../../class-detail-components/mockData";
import FitnessClassOverviewWidget from "../../class-detail-components/FitnessClassOverviewWidget";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import Head from "next/head";

const ClassDetails = ({ classData }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const classId = router.query.id?.replace("id=", "");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#review") {
      const reviewSection = document.getElementById("review");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div data-ignore="used only for top most containter width">
    <Head>
      <title>Explore Class</title>
      <meta name="description" content="Explore this class" />
      <link rel="icon" href="/pc_favicon.ico" />
    </Head>
      <FitnessClassOverviewWidget
        {...mockData}
        classData={mockData}
        classId={classId}
        userId={user?.uid}
      />
    </div>
  );
};

export default ClassDetails;
