import ExperienceSection from "../FineArtDegreeSection";
import PricingSection from "../PricingSection";

function FullProfileSection({ instructorData }) {
  return (
    <div className="w-[100.00%] box-border ">
      <ExperienceSection instructorData={instructorData} />
      <PricingSection instructorData={instructorData} />
    </div>
  );
}

export default FullProfileSection;
