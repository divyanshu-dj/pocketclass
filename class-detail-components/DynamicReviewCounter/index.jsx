function DynamicReviewCounter({ reviewRatingCounter }) {
  return (
    <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] whitespace-pre-wrap w-[100.00%] box-border m-0 p-0 first:mt-0 mt-[26.00px]">
      {reviewRatingCounter}
    </p>
  );
}

export default DynamicReviewCounter;
