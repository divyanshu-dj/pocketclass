import FullProfileSection from "../FullProfileSection";

function EducationSection({instructorData, classData}) {
  console.log(classData)
  return (
    <div className="w-[100.00%] box-border mt-[15.5px]">
      <FullProfileSection classData={classData} instructorData={instructorData} />
    </div>
  );
}

export default EducationSection;
