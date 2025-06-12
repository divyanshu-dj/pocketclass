import { useState, useRef, useEffect } from 'react';

function FitnessDescriptionSection({ classAbout }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > el.clientHeight + 1;
    setIsClamped(isOverflowing);
  }, [classAbout]);

  const toggleReadMore = () => setIsReadMore(!isReadMore);
  

  return (
    <div className="w-full box-border">
      {!classAbout ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        <>
          <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22]">
            Class Description:
          </p>

          <p
            ref={textRef}
            className={`[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-left leading-6 text-[#261f22] mt-2 ${
              isReadMore ? 'line-clamp-3' : ''
            }`}
          >
            {classAbout}
          </p>

          {isClamped && (
            <p
              onClick={toggleReadMore}
              className="text-sm font-medium mt-3 text-[#261f22] cursor-pointer hover:text-red-600 font-inter"
            >
              {isReadMore ? 'Read more' : 'Read less'}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FitnessDescriptionSection;
