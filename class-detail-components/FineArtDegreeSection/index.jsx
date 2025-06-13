import { useState, useRef, useEffect } from 'react';

function ExperienceSection({ classData }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const paragraphRef = useRef(null);

  const toggleReadMore = () => setIsReadMore(!isReadMore);

  useEffect(() => {
    const el = paragraphRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > el.clientHeight + 1;
    setIsClamped(isOverflowing);
  }, [classData?.Experience]);

  const showExperience =
    classData &&
    (classData.Experience || !classData.Description); // similar condition like before

  return (
    <div className="w-full box-border">
      {!classData ? (
        <div className="flex justify-start items-start flex-row animate-pulse">
          <div className="h-14 w-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="grow-0 shrink-0 basis-auto ml-[15px] w-full lg:w-[calc(100%-4rem)]">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      ) : (
        showExperience && (
          <div className="flex justify-start items-start flex-col md:flex-row gap-[15px]">
            <div className="grow-0 shrink-0 basis-auto w-full lg:w-[calc(100%-4rem)]">
              <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
                Experience
              </p>
              <p
                ref={paragraphRef}
                className={`[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-black mt-2 m-0 p-0 leading-6 ${
                  isReadMore ? 'line-clamp-3' : ''
                }`}
              >
                {classData.Experience}
              </p>
              {isClamped && (
                <p
                  onClick={toggleReadMore}
                  className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 m-0 p-0 cursor-pointer hover:text-red-600"
                >
                  {isReadMore ? 'Read more' : 'Read less'}
                </p>
              )}
            </div>
          </div>
        )
      )}

      {/* Show the divider only if:
          - classData is not yet loaded (loading)
          - OR classData is loaded and Experience is present
      */}
      {(!classData || (classData?.Experience || !classData?.Description)) && (
        <div className="w-full box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
      )}
    </div>
  );
}

export default ExperienceSection;
