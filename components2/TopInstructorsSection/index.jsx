"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import InstructorSection from "../InstructorSection/index";
import { db } from "../../firebaseConfig";

function TopInstructorsSection({ showAll = false }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const q = query(
          collection(db, "Users"),
          where("category", "==", "instructor")
        );
        const querySnapshot = await getDocs(q);
        const instructorData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstructors(instructorData);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const q = query(
          collection(db, "Users"),
          where("category", "==", "instructor")
        );
        const querySnapshot = await getDocs(q);
        const instructorData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstructors(instructorData);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const displayedInstructors = showAll
    ? instructors.slice(0, 12)
    : instructors.slice(0, 4);

  return (
    <div className="grow-0 shrink-0 basis-auto px-[63px]">
      <div className="w-[100.00%] box-border">
        <p className="[font-family:'DM_Sans',sans-serif] text-5xl font-bold leading-[56px] text-[#261f22] m-0 p-0">
          Top-Rated Instructors
        </p>
        <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-[#261f22] mt-4 m-0 p-0">
          With over 30,000 instructors and 1M+ learners
        </p>
      </div>
      <div className="grid grid-cols-4 gap-8 w-[100.00%] box-border mt-8">
        {loading
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <InstructorSection key={index} loading={true} />
              ))
          : displayedInstructors.map((instructor) => (
              <InstructorSection
                key={instructor.id}
                instructor={instructor}
                loading={false}
              />
            ))}
      </div>
    </div>
  );
}

export default TopInstructorsSection;
