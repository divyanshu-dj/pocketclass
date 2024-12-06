import DynamicReviewCounter from "../DynamicReviewCounter";

function ReviewCounterDisplay2({ reviewCountsArray2 }) {
  return (
    <div className="w-[100.00%] box-border mt-[26px]">
      {reviewCountsArray2.map((data, index) => {
        return <DynamicReviewCounter {...data} key={index} />;
      })}
    </div>
  );
}

export default ReviewCounterDisplay2;
