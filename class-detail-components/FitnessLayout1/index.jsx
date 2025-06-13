import FitnessBioSection from "../FitnessBioSection";
import FitnessDescriptionSection from "../FitnessDescriptionSection";

function FitnessLayout1({ classAbout, classDesc }) {
  return (
    <div className="w-[100.00%] box-border">
      <FitnessDescriptionSection classAbout={classDesc} />
      {!(!classAbout && classDesc) && (
        <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
      )}

      <div className="w-[100.00%] box-border mt-[15.5px]">
        <FitnessBioSection classDesc={classDesc} classAbout={classAbout} />
      </div>
      <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default FitnessLayout1;
