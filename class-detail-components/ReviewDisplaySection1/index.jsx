import ReviewCounterDisplay3 from "../ReviewCounterDisplay3";
import ReviewCounterDisplay4 from "../ReviewCounterDisplay4";
import ReviewCounterDisplay1 from "../ReviewCounterDisplay1";
import ReviewCounterDisplay2 from "../ReviewCounterDisplay2";

function ReviewDisplaySection1({ reviewCountsArray2, dynamicReviewCountsArray, dynamicReviewCountsArray1, reviewCountsArray }) {
  return (
    <div className="grow-0 shrink-0 basis-auto mt-[29px]">
      <div className="flex justify-start items-start flex-row gap-7">
        <div className="w-6 grow-0 shrink-0 basis-auto box-border">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] w-[100.00%] box-border m-0 p-0">M</p>
          <div className="w-[100.00%] box-border mt-5">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] w-[100.00%] box-border m-0 p-0">1</p>
            <ReviewCounterDisplay3 reviewCountsArray={reviewCountsArray} />
          </div>
        </div>
        <div className="w-6 grow-0 shrink-0 basis-auto box-border">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] w-[100.00%] box-border m-0 p-0">T</p>
          <div className="w-[100.00%] box-border mt-5">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] w-[100.00%] box-border m-0 p-0">2</p>
            <ReviewCounterDisplay4 dynamicReviewCountsArray1={dynamicReviewCountsArray1} />
          </div>
        </div>
        <div className="flex justify-center items-stretch flex-col gap-[26px] grow-0 shrink-0 basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] grow-0 shrink-0 basis-auto mx-1 m-0 p-0">W</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] grow-0 shrink-0 basis-auto mx-1 m-0 p-0">3</p>
          <span className="bg-[#191a1a] [font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[white] inline-flex items-center justify-center h-8 box-border grow-0 shrink-0 basis-auto px-1 py-0 rounded-2xl border-[none]">
            10
          </span>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] grow-0 shrink-0 basis-auto mx-1 m-0 p-0">17</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] grow-0 shrink-0 basis-auto mt-[5px] mx-1 m-0 p-0">24</p>
        </div>
        <div className="w-6 grow-0 shrink-0 basis-auto box-border">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] w-[100.00%] box-border m-0 p-0">T</p>
          <div className="w-[100.00%] box-border mt-5">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] w-[100.00%] box-border m-0 p-0">4</p>
            <ReviewCounterDisplay1 dynamicReviewCountsArray={dynamicReviewCountsArray} />
          </div>
        </div>
        <div className="w-6 grow-0 shrink-0 basis-auto box-border">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] w-[100.00%] box-border m-0 p-0">F</p>
          <div className="w-[100.00%] box-border mt-5">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] w-[100.00%] box-border m-0 p-0">5</p>
            <ReviewCounterDisplay2 reviewCountsArray2={reviewCountsArray2} />
          </div>
        </div>
        <div className="flex justify-center items-stretch flex-col gap-[26px] grow-0 shrink-0 basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">S</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] grow-0 shrink-0 basis-auto -mt-1.5 m-0 p-0">6</p>
          <div className="flex justify-center items-stretch flex-col grow-0 shrink-0 basis-auto">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#d4d2d3] grow-0 shrink-0 basis-auto m-0 p-0">13</p>
            <div className="mt-[-11.5px] grow-0 shrink-0 basis-auto mx-[2.5px] border-t-[#d4d2d3] border-t border-solid" />
          </div>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-[#7d797a] self-center grow-0 shrink-0 basis-auto m-0 p-0">20</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] grow-0 shrink-0 basis-auto m-0 p-0">27</p>
        </div>
        <div className="flex justify-center items-stretch flex-col gap-[26px] w-6 grow-0 shrink-0 basis-auto box-border">
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">S</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#e9e9e9] grow-0 shrink-0 basis-auto -mt-1.5 m-0 p-0">7</p>
          <div className="flex justify-center items-stretch flex-col grow-0 shrink-0 basis-auto">
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#d4d2d3] grow-0 shrink-0 basis-auto m-0 p-0">14</p>
            <div className="mt-[-11.5px] grow-0 shrink-0 basis-auto mx-[2.5px] border-t-[#d4d2d3] border-t border-solid" />
          </div>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] grow-0 shrink-0 basis-auto m-0 p-0">21</p>
          <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] grow-0 shrink-0 basis-auto m-0 p-0">28</p>
        </div>
      </div>
      <div className="flex justify-center items-center flex-row gap-7 mt-[26px] pr-72">
        <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] w-6 grow-0 shrink-0 basis-auto box-border m-0 p-0">29</p>
        <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-[#7d797a] grow-0 shrink-0 basis-auto m-0 p-0">30</p>
        <p className="[font-family:'DM_Sans',sans-serif] text-sm font-medium text-center text-[#7d797a] w-6 grow-0 shrink-0 basis-auto box-border m-0 p-0">31</p>
      </div>
    </div>
  );
}

export default ReviewDisplaySection1;
