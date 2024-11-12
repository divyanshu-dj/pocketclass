import Pink from "../Pink";
import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";

function InstructorFinderView() {
  return (
    <div className="flex justify-start items-center flex-col grow-0 shrink-0 basis-auto">
      <div className="flex justify-start items-stretch flex-col gap-16 max-w-[1182px] box-border">
        <div className="flex justify-start items-center flex-col grow-0 shrink-0 basis-auto">
          <div className="flex justify-start items-stretch flex-col max-w-[642px] box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-5xl font-bold text-center leading-[56px] text-[#261f22] self-center grow-0 shrink-0 basis-auto m-0 p-0">
              Find the right instructor for your child
            </p>
            <p className="[font-family:'DM_Sans',sans-serif] text-lg font-bold text-center text-[#261f22] grow-0 shrink-0 basis-auto mt-6 m-0 p-0">With over 30,000 instructors and 1M+ learners</p>
          </div>
        </div>
        <div className="flex justify-start items-center flex-row gap-16 grow-0 shrink-0 basis-auto">
          <SvgIcon1 className="w-8 h-8 flex grow-0 shrink-0 basis-auto" />
          <div className="w-[435px] grow-0 shrink-0 basis-auto box-border">
            <img src="/assets/image_abb30eb7.png" className="h-[405px] max-w-[initial] object-cover w-[100.00%] box-border block rounded-3xl border-[none]" />
            <Pink />
          </div>
          <div className="flex justify-center items-stretch flex-col grow-0 shrink basis-auto">
            <p className="[font-family:'DM_Sans',sans-serif] text-[32px] font-bold text-left leading-10 text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0">
              “PocketClass made it so easy to find a painting class for my son. He loves it, and we love the convenience!”
            </p>
            <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold text-[#261f22] grow-0 shrink-0 basis-auto mt-6 m-0 p-0">Katie</p>
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[#261f22] grow-0 shrink-0 basis-auto mt-2 m-0 p-0">Badminton learner&apos;s perant</p>
          </div>
          <SvgIcon2 className="w-8 h-8 flex grow-0 shrink-0 basis-auto" />
        </div>
        <img src="/assets/image_2e9718f.png" alt="" className="h-4 max-w-[initial] w-20 block self-center grow-0 shrink-0 basis-auto box-border" />
      </div>
    </div>
  );
}

export default InstructorFinderView;
