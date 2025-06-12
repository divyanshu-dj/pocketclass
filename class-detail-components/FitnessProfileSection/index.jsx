import { useState, useRef, useEffect } from "react";
import FitnessLayout1 from "../FitnessLayout1";
import EducationSection from "../EducationSection";

function FitnessProfileSection({ classData, instructorData }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  const toggleReadMore = () => setIsReadMore(!isReadMore);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > el.clientHeight + 1;
    setIsClamped(isOverflowing);
  }, [classData?.FunFact]);

  const showFunFact =
    classData &&
    (classData.FunFact || !classData.Description); // ✅ only show if FunFact exists or Description is missing

  return (
    <div className="w-full box-border mt-[68px]">
      <FitnessLayout1
        classAbout={classData?.About}
        classDesc={classData?.Description}
      />

      {showFunFact && (
        <div className="w-full box-border mt-[15.5px]">
          {!classData ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <>
              <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
                Fun Fact
              </p>
              <p
                ref={textRef}
                className={`[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-black mt-2 m-0 p-0 leading-6 ${
                  isReadMore ? "line-clamp-3" : ""
                }`}
              >
                {classData.FunFact}
              </p>
              <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
              {isClamped && (
                <p
                  onClick={toggleReadMore}
                  className="[font-family:Inter,sans-serif] text-sm font-semibold text-[#261f22] mt-3 cursor-pointer hover:text-red-600"
                >
                  {isReadMore ? "Read more" : "Read less"}
                </p>
              )}
            </>
          )}
        </div>
      )}
      
      <EducationSection
        classData={classData}
        instructorData={instructorData}
      />
    </div>
  );
}

export default FitnessProfileSection;
