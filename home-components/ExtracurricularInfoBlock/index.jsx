import ExtracurricularBanner from "../ExtracurricularBanner";

function ExtracurricularInfoBlock() {
  return (
      <div className="relative flex justify-start items-center flex-col">
          <div className="section-spacing relative z-10 flex justify-start items-center flex-col max-w-[748px] box-border pt-[88px] pb-[88px] md:pb-[141px]">
            <ExtracurricularBanner />
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-center leading-6 text-[#261f22] w-full max-w-[484px] grow-0 shrink-0 basis-auto box-border mt-6 m-0 p-0">
              Life is busy, and finding the right extracurricular activities can be a challenge. PocketClass makes it simple. We connect you with local, qualified instructors offering lessons in sports,
              arts, and music—all on one easy-to-use platform.
            </p>
          </div>

        {/* Orange oval gradient in center fading to white */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(251,146,60,0.3),rgba(249,115,22,0.2)_40%,rgba(255,255,255,0.8)_70%,rgba(255,255,255,1)_85%)]" />
        </div>

        <div className="absolute left-0 right-0 top-0 bottom-0 opacity-20">
            <img src="/assets/slanted-bg.png" alt="Slanted Background" className="object-cover w-full h-full"/>
        </div>
    </div>
  );
}

export default ExtracurricularInfoBlock;
