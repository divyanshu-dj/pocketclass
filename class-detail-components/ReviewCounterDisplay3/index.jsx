import DynamicReviewCounter from "../DynamicReviewCounter";

function ReviewCounterDisplay3({ reviewCountsArray }) {
  return (
    <div className="w-[100.00%] box-border mt-[26px]">
      {reviewCountsArray.map((data, index) => {
        return <DynamicReviewCounter {...data} key={index} />;
      })}
    </div>
  );
}

export default ReviewCounterDisplay3;
