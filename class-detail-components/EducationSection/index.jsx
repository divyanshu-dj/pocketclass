import FullProfileSection from "../FullProfileSection";

function EducationSection({instructorData}) {
  return (
    <div className="w-[100.00%] box-border mt-[15.5px]">
      <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] m-0 p-0">Experience</p>
      <FullProfileSection instructorData={instructorData} />
    </div>
  );
}

export default EducationSection;
