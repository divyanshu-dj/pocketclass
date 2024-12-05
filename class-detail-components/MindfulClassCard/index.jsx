import { Button } from "@mui/base";

function MindfulClassCard({ name, numSessions, price, discountPercentage = 20 }) {
  const originalPrice = price;
  const discountedPrice = price * (1 - discountPercentage/100);

  return (
    <div className="w-[100.00%] box-border first:mt-0 mt-[39.50px]">
      <div className="flex justify-start items-start flex-row w-[100.00%] box-border" style={{display:'flex', justifyContent:'space-between'}}>
        <div className="grow-0 shrink basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-xl font-bold text-[#261f22] whitespace-pre-wrap m-0 p-0">
            {`${numSessions} Sessions Package`}
          </p>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] whitespace-pre-wrap w-[100.00%] box-border mt-2 m-0 p-0">
            {name}
          </p>
        </div>
        <div className="flex justify-start items-stretch flex-col w-[150px] grow-0 shrink-0 basis-auto box-border -ml-px">
          <div className="flex justify-start items-end flex-col grow-0 shrink-0 basis-auto">
            <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold leading-6 text-[#261f22] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">
              ${discountedPrice.toFixed(2)}
            </p>
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-semibold text-[#ee393c] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">
              {`${discountPercentage}% OFF`}
            </p>
          </div>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-normal line-through text-[#a8a5a7] whitespace-pre-wrap self-end grow-0 shrink-0 basis-auto m-0 p-0">
            ${originalPrice.toFixed(2)}
          </p>
          <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[149px] h-[47px] cursor-pointer block box-border grow-0 shrink-0 basis-auto mt-[26px] rounded-[100px] border-[none]">
            Select
          </Button>
        </div>
      </div>
      <div className="w-[100.00%] box-border mt-9 border-t-[#d4d2d3] border-t border-solid" />
    </div>
  );
}

export default MindfulClassCard;
