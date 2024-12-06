import FitnessBioSection from "../FitnessBioSection";

function FitnessLayout1({classAbout}) {
  return (
    <div className="w-[100.00%] box-border">
      <FitnessBioSection classAbout={classAbout} />
      <div className="w-[100.00%] box-border mt-[15.5px] border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default FitnessLayout1;
