import { useState } from 'react';

function FitnessDescriptionSection({classAbout}) {
  const [isReadMore, setIsReadMore] = useState(true);

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
            Class Description:
          </p>
          <p className="[font-family:'DM_Sans',sans-serif] whitespace-pre-wrap text-base font-medium text-left leading-6 text-[#261f22] w-[100.00%] box-border mt-2 m-0 p-0">
            {isReadMore ? classAbout?.slice(0, 150) : classAbout}
          </p>
          {classAbout?.length > 150 && (
            <p 
              onClick={toggleReadMore} 
              className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 m-0 p-0 cursor-pointer hover:text-red-600"
            >
              {isReadMore ? "Read more" : "Read less"}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FitnessDescriptionSection;
