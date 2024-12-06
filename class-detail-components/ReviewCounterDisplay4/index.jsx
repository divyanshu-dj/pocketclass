import DynamicReviewCounter from "../DynamicReviewCounter";

function ReviewCounterDisplay4({ dynamicReviewCountsArray1 }) {
  return (
    <div className="w-[100.00%] box-border mt-[26px]">
      {dynamicReviewCountsArray1.map((data, index) => {
        return <DynamicReviewCounter {...data} key={index} />;
      })}
    </div>
  );
}

export default ReviewCounterDisplay4;
