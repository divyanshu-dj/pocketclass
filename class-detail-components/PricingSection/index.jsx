import { useState } from "react";

function PricingSection({ classData }) {
  // State to track which section is selected
  const [selected, setSelected] = useState(null);

  // Handler to select 1-on-1s or Group Class
  const handleSelect = (selection) => {
    if (selected === selection) {
      setSelected(null); // If already selected, unselect it
    } else {
      setSelected(selection); // Otherwise, select it
    }
  };

  return (
    <>
      <div className="w-[100.00%] box-border mt-[15.5px]">
        {!classData ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="w-[100.00%] box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
              Pricing
            </p>

            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] mt-2 m-0 p-0">
              Our coaches offer 1-on-1s and group lessons, which are a fun and
              cost-effective way to improve your skills with friends and
              like-minded folks. If you're ready to commit to continuous
              improvement, a package is the way to go!
            </p>
            {/* <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] mt-2 m-0 p-0">
            Individual Price: {classData?.Price}
            <br/>
            Group Price: {classData?.groupPrice}
            {/* Packages Pricing */}
            {/* {classData?.Packages.map((pkg, index) => (
                <p key={index} className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] m-0 p-0">{pkg.num_sessions} Lectures Package: {(pkg.Price-pkg.Discount*pkg.Price/100)/pkg.num_sessions}</p>
            ))}
          </p> */}
            <div className="flex flex-row flex-wrap mt-4 gap-3">
              {/* 1-on-1s section */}
              <div
                onClick={() => handleSelect("oneOnOne")}
                className={`group relative w-[150px] h-[80px] px-5 py-3 flex flex-col items-start justify-center border border-gray-500 rounded-lg flex-shrink-0 overflow-hidden ${
                  selected === "oneOnOne"
                    ? "bg-red-500 shadow-[inset_0_0px_10px_4px_rgba(0,0,0,0.3)]"
                    : "bg-transparent shadow-[0_0px_10px_2px_rgba(0,0,0,0.3)]"
                }`}
              >
                {/* Ball animation effect */}
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 scale-0 group-hover:scale-[15] group-hover:translate-y-[-30px] transition-all duration-500 origin-center z-0 ${
                    selected === "oneOnOne" ? "hidden" : "text-black"
                  }`}
                ></div>

                <p
                  className={`flex items-center justify-center [font-family:'DM_Sans',sans-serif] text-nowrap text-lg font-bold text-left text-[black] m-0 p-0 z-10 group-hover:text-white transition-colors duration-500 ${
                    selected === "oneOnOne" ? "text-white" : "text-black"
                  }`}
                >
                  1-on-1s
                </p>
                <p
                  className={`text-base text-left text-[black] m-0 p-0 z-10 group-hover:text-white transition-colors duration-500 ${
                    selected === "oneOnOne" ? "text-white" : "text-black"
                  }`}
                >
                  {classData?.Price}
                </p>
              </div>

              {/* Group Class section */}
              <div
                onClick={() => handleSelect("groupClass")}
                className={`group relative w-[150px] h-[80px] px-5 py-3 flex flex-col items-start justify-center border border-gray-500 rounded-lg flex-shrink-0 overflow-hidden ${
                  selected === "groupClass"
                    ? "bg-red-500 shadow-[inset_0_0px_10px_4px_rgba(0,0,0,0.3)]"
                    : "bg-transparent shadow-[0_0px_10px_2px_rgba(0,0,0,0.3)]"
                }`}
              >
                {/* Ball animation effect */}
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 scale-0 group-hover:scale-[15] group-hover:translate-y-[-30px] transition-all duration-500 origin-center z-0 ${
                    selected === "groupClass" ? "hidden" : "text-black"
                  }`}
                ></div>

                <p
                  className={`flex items-center justify-center [font-family:'DM_Sans',sans-serif] text-nowrap text-lg font-bold text-left text-[black] m-0 p-0 z-10 group-hover:text-white transition-colors duration-500 ${
                    selected === "groupClass" ? "text-white" : "text-black"
                  }`}
                >
                  Group Class
                </p>
                <p
                  className={`text-base text-left text-[black] m-0 p-0 z-10 group-hover:text-white transition-colors duration-500 ${
                    selected === "groupClass" ? "text-white" : "text-black"
                  }`}
                >
                  {classData?.groupPrice}
                </p>
              </div>

              {/* Packages section */}
              {classData?.Packages.map((pkg, index) => (
                <div
                  key={index}
                  className="px-5 items-start justify-center flex flex-col py-3 border border-gray-500 rounded-lg flex-shrink-0"
                >
                  <p className="[font-family:'DM_Sans',sans-serif] text-nowrap text-lg font-bold text-left text-[black] m-0 p-0">
                    {pkg.num_sessions} Lectures Package
                  </p>
                  <p className="[font-family:'DM_Sans',sans-serif] text-base text-left  text-[black] m-0 p-0">
                    <p className="line-through inline">{pkg.Price}</p>{" "}
                    <p className="text-logo-red inline">({pkg.Discount}% off)</p>
                  </p>
                  <p className="[font-family:'DM_Sans',sans-serif] text-base text-left text-[black] m-0 p-0">
                    {(pkg.Price - (pkg.Discount * pkg.Price) / 100)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
      </div>
      <div className="w-[100.00%] box-border mt-[15.5px]">
        {!classData ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="w-[100.00%] box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">
              Pricing Description
            </p>
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] mt-2 m-0 p-0">
              {classData?.Pricing}
              <br />
              (Please contact for more information).
            </p>
          </div>
        )}
        <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
      </div>
    </>
  );
}

export default PricingSection;
