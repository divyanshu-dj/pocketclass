'use client';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import InstructorSection from "../InstructorSection";
import { db } from "../../firebaseConfig";

function TopInstructorsSection({showAll = false}) {
  const [instructors, setInstructors] = useState([]);
  

  useEffect(() => {
    const fetchInstructors = async () => {
      const q = query(
        collection(db, "Users"),
        where("category", "==", "instructor")
      );
      const querySnapshot = await getDocs(q);
      const instructorData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Filtered Instructors:", instructorData);
      setInstructors(instructorData);
    };

    fetchInstructors();
  }, []);

  const displayedInstructors = showAll ? instructors : instructors.slice(0, 4);

  return (
    <div className="grow-0 shrink-0 basis-auto px-[63px]">
      <div className="w-[100.00%] box-border">
        <p className="[font-family:'DM_Sans',sans-serif] text-5xl font-bold leading-[56px] text-[#261f22] m-0 p-0">Top-Rated Instructors</p>
        <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-[#261f22] mt-4 m-0 p-0">With over 30,000 instructors and 1M+ learners</p>
      </div>
      <div className="flex justify-between items-start flex-row gap-8 w-[100.00%] box-border mt-8">
        {displayedInstructors.map((instructor) => (
          <InstructorSection 
            key={instructor.id}
            instructor={instructor}
          />
        ))}
      </div>
      <button 
        onClick={() => setShowAll(!showAll)}
        className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer"
      >
      </button>
    </div>
  );
}

export default TopInstructorsSection;
