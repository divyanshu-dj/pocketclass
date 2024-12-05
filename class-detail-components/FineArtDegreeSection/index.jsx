import { useState } from 'react';

function ExperienceSection({ instructorData }) {
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div className="w-[100.00%] box-border">
      {!instructorData ? (
        <div className="flex justify-start items-start flex-row animate-pulse">
          <div className="h-14 w-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="grow-0 shrink-0 basis-auto ml-[15px] w-[calc(100%-4rem)]">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-start flex-row">
          <img 
            src="/assets/image_95ed60a9.png" 
            alt="" 
            className="h-14 max-w-[initial] w-14 block box-border flex-shrink-0" 
          />
          <div className="grow-0 shrink-0 basis-auto ml-[15px] w-[calc(100%-4rem)]">
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[black] mt-2 m-0 p-0">
              {isReadMore ? instructorData?.experience?.slice(0, 150) : instructorData?.experience}
            </p>
            {instructorData?.experience?.length > 150 && (
              <p 
                onClick={toggleReadMore} 
                className="[font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] mt-4 m-0 p-0 cursor-pointer hover:text-blue-600"
              >
                {isReadMore ? "Read more" : "Read less"}
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
