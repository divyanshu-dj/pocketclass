import React from "react";
import { useRouter } from "next/router";
import { mockData } from "../../class-detail-components/mockData";
import FitnessClassOverviewWidget from "../../class-detail-components/FitnessClassOverviewWidget";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";

const ClassDetails = ({ classData }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const classId = router.query.id?.replace("id=", "");

  return (
    <div data-ignore="used only for top most containter width">
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
