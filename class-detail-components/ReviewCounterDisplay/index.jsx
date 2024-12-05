import RenderReviewRatingCounter from "../RenderReviewRatingCounter";

function ReviewCounterDisplay({ reviewCountsArray1 }) {
  return (
    <div className="bg-[#7d797a] box-border">
      {reviewCountsArray1.map((data, index) => {
        return <RenderReviewRatingCounter {...data} key={index} />;
      })}
    </div>
  );
}

export default ReviewCounterDisplay;
