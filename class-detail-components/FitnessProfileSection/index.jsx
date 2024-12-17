import FitnessLayout1 from "../FitnessLayout1";
import FitnessLayout from "../FitnessLayout";
import EducationSection from "../EducationSection";

function FitnessProfileSection({ classData, instructorData }) {
  return (
    <div className="w-full box-border mt-[68px]">
      <FitnessLayout1 classAbout={classData?.About} />
      <div className="w-[100.00%] box-border mt-[15.5px]">
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
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[black] mt-2 m-0 p-0">
              {classData.FunFact}
            </p>
          </>
        )}
      </div>
      <FitnessLayout />
      <EducationSection classData={classData} instructorData={instructorData} />
    </div>
  );
}

export default FitnessProfileSection;
