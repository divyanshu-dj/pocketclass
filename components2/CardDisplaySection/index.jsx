import DynamicCardView from "../DynamicCardView";
import MusicianCard from "../MusicianCard";

function CardDisplaySection() {
  return (
    <div className="bg-[white] box-border flex justify-start items-stretch flex-col grow shrink basis-[0.00] rounded-2xl">
      <DynamicCardView />
      <MusicianCard />
    </div>
  );
}

export default CardDisplaySection;
