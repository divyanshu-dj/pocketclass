import { Button } from "@mui/base";
import SportSelectionWidget from "../SportSelectionWidget";

function MusicSelector() {
  return (
    <div className="flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto">
      <div className="grow-0 shrink-0 basis-auto pl-16 pr-12">
        {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
        <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[79px] h-[35px] w-[79px] cursor-pointer block box-border rounded-[100px] border-[none]">
          Music
        </Button>
      </div>
      <SportSelectionWidget />
    </div>
  );
}

export default MusicSelector;
