import DynamicReviewCounter from "../DynamicReviewCounter";

function ReviewCounterDisplay1({ dynamicReviewCountsArray }) {
  return (
    <div className="w-[100.00%] box-border mt-[26px]">
      {dynamicReviewCountsArray.map((data, index) => {
        return <DynamicReviewCounter {...data} key={index} />;
      })}
    </div>
  );
}

export default ReviewCounterDisplay1;
