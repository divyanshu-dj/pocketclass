import { useState, useRef, useEffect } from 'react';

function FitnessBioSection({ classAbout, classDesc }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  const toggleReadMore = () => setIsReadMore(!isReadMore);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Check if the text overflows when clamped
    const isOverflowing = el.scrollHeight > el.clientHeight + 1;
    setIsClamped(isOverflowing);
  }, [classAbout]);

  console.log(classAbout)
  console.log(classDesc)

  if (!classAbout && classDesc) return null;

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
            About Class
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
              className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 cursor-pointer hover:text-red-600"
            >
              {isReadMore ? 'Read more' : 'Read less'}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FitnessBioSection;
