import PocketClassOverview from "../PocketClassOverview";
import DynamicContentLayout from "../DynamicContentLayout";

function ClassOverviewLayout() {
  return (
    <div className="flex justify-start items-center flex-col grow-0 shrink-0 basis-auto">
      <div className="w-[1090px] box-border">
        <PocketClassOverview />
        <DynamicContentLayout />
      </div>
    </div>
  );
}

export default ClassOverviewLayout;
