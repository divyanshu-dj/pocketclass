import { useState, useRef, useEffect } from 'react';

function FitnessBioSection({classAbout}) {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isShowReadMore, setShowIsReadMore] = useState(true);
  const paragraphRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
      const updateWidth = () => {
        if (paragraphRef.current) {
          if(classAbout.length<150){
            setIsReadMore(false)
            setShowIsReadMore(false)
            return
          }
          let paragraphWidth = Math.round(Math.min(paragraphRef.current.offsetWidth/8,150));
          while(paragraphWidth>0 && classAbout[paragraphWidth]!==" "){
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
    }, [classAbout, isReadMore]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div className="w-[100.00%] box-border">
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
          <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
            About Class
          </p>
          <p ref={paragraphRef} className="[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-left leading-6 text-[#261f22] w-[100.00%] box-border mt-2 m-0 p-0">
            {isReadMore ? classAbout?.slice(0, width) : classAbout}
            <span>
              {isReadMore ? "..." : ""}
            </span>
          </p>
          {classAbout?.length > width && (
            <p 
              onClick={toggleReadMore} 
              className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 m-0 p-0 cursor-pointer hover:text-red-600"
            >
              {isShowReadMore?<p>{isReadMore ? "Read more" : "Read less"}</p>:""}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FitnessBioSection;
