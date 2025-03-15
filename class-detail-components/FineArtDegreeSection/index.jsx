import { useState, useRef, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function ExperienceSection({ classData }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isShowReadMore, setShowIsReadMore] = useState(true);
  const paragraphRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (paragraphRef.current) {
      if(classData.Experience.length<150){
        setIsReadMore(false)
        setShowIsReadMore(false)
        console.log(isShowReadMore)
        return
      }
        let paragraphWidth = Math.round(Math.min(paragraphRef.current.offsetWidth/8,150));
        while(paragraphWidth>0 && (classData.Experience[paragraphWidth]!==" ")){
          paragraphWidth--
        }

        setWidth(paragraphWidth);
      }
    };

    // Observe changes in width
    const resizeObserver = new ResizeObserver(updateWidth);
    if (paragraphRef.current) {
      resizeObserver.observe(paragraphRef.current);
    }

    // Initial measurement
    updateWidth();

    return () => {
      resizeObserver.disconnect();
    };
  }, [classData, isReadMore, isShowReadMore]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div className="w-[100.00%] box-border">
      {!classData ? (
        <div className="flex justify-start items-start flex-row animate-pulse">
          <div className="h-14 w-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="grow-0 shrink-0 basis-auto ml-[15px] w-full lg:w-[calc(100%-4rem)]">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-start flex-col md:flex-row gap-[15px]">
          <div className="grow-0 shrink-0 basis-auto w-full lg:w-[calc(100%-4rem)]">
            <p ref={paragraphRef} className="[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-[black] mt-2 m-0 p-0">
              {isReadMore ? classData?.Experience?.slice(0, width) : classData?.Experience}
            <span>
              {isReadMore ? "..." : ""}
            </span>
            </p>
            {classData?.Experience?.length > width && (
              <p
                onClick={toggleReadMore}
                className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 m-0 p-0 cursor-pointer hover:text-red-600"
              >
                {isShowReadMore?<p>{isReadMore ? "Read more" : "Read less"}</p>:""}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default ExperienceSection;
