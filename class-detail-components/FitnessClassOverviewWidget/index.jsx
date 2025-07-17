import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

import FitnessClassDetailsSection from "../FitnessClassDetailsSection";
import NewHeader from "../../components/NewHeader";
import ClassroomFooter from "../../home-components/ClassroomFooter";
import DynamicButtonSection from "../DynamicButtonSection";

function FitnessClassOverviewWidget({
  timeSlotOptions,
  reviewCountsArray1,
  mindfulClassCardOptions,
  reviewCountsArray2,
  dynamicReviewCountsArray,
  dynamicReviewCountsArray1,
  reviewCountsArray,
  classId,
  userId,
}) {
  const [classData, setClassData] = useState(null);
  const [classCreatorData, setClassCreatorData] = useState(null);

  useEffect(() => {
    const getClassCreatorData = async () => {
      if (classData?.classCreator) {
        const docRef = doc(db, "Users", classData.classCreator);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClassCreatorData(docSnap.data());
        }
      }
    };

    getClassCreatorData();
  }, [classData]);


  useEffect(() => {
    const fetchClassData = async () => {
      if (classId) {
        const classRef = doc(db, "classes", classId);
        const docSnap = await getDoc(classRef);
        if (docSnap.exists()) {
          setClassData(docSnap.data());
        }
      }
    };

    fetchClassData();
  }, [classId]);
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col pb-4">
      <FitnessClassDetailsSection
        timeSlotOptions={timeSlotOptions}
        reviewCountsArray1={reviewCountsArray1}
        mindfulClassCardOptions={mindfulClassCardOptions}
        reviewCountsArray2={reviewCountsArray2}
        dynamicReviewCountsArray={dynamicReviewCountsArray}
        dynamicReviewCountsArray1={dynamicReviewCountsArray1}
        reviewCountsArray={reviewCountsArray}
        classId={classId}
        userId={userId}
      />
      <ClassroomFooter isHome={false} />
    </div>
  );
}

export default FitnessClassOverviewWidget;
