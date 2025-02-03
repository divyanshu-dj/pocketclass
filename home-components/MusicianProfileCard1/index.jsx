import { Button } from "@mui/base";
import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import SvgIcon3 from "./icons/SvgIcon3";
import { categories } from "../../utils/categories";

function MusicianProfileCard1({ instructor }) {
  // console.log(instructor);
  // Default values if data is missing
  const fullName = `${
    instructor?.name?.split(" ").slice(0, 4).join(" ") || "N/A"
  }`.trim();
  const rating = instructor?.averageRating; // Static as not in DB
  const reviews = instructor?.reviewCount; // Static as not in DB
  const price = instructor?.Price; // Static as not in DB
  const specialization = instructor?.SubCategory
    ? instructor?.SubCategory
    : instructor?.Type; // Static as not in DB
  const groupPrice = instructor?.groupPrice; // Static as not in DB

  const getCategoryIcon = (category, type) => {
    const categoryData = categories.find((cat) => cat.name === category);
    if (!categoryData) return null;

    const subCategoryData = categoryData.subCategories.find(
      (sub) => sub.name === type
    );
    return subCategoryData ? subCategoryData.imagePath : categoryData.imagePath;
  };

  return (
    <div className="box-border grow-0 shrink-0 basis-auto px-[15px] py-4">
      <div className="flex justify-between items-start flex-row gap-2 w-full box-border">
  <div className="grow-0 shrink basis-auto">
    <p className="[font-family:'DM_Sans',sans-serif] text-md font-bold text-[#261f22] m-0 p-0 text-[13px]">
      {fullName.length > 30 ? `${fullName.slice(0, 25)}..` : fullName}
    </p>

    {/* Category + SubCategory Wrapper */}
    <div className="flex flex-wrap items-center gap-1 max-w-[180px]">
      {getCategoryIcon(instructor?.Category, instructor?.SubCategory || instructor?.Type) && (
        <img
          src={getCategoryIcon(instructor?.Category, instructor?.SubCategory || instructor?.Type)}
          alt={instructor.Type}
          className="w-4 h-4"
        />
      )}
      <p className="text-base font-bold text-[#7d797a] whitespace-normal break-words">
        {instructor?.category.split(" ")[0]}
      </p>

      <img src="/assets/image_7a2617f3.png" alt="" className="h-1 w-1 block" />

      <p className="text-base font-bold text-[#7d797a] whitespace-normal break-words">
        {specialization}
      </p>
    </div>

    {/* Rating Section */}
    <div className="flex items-center mt-2">
      <SvgIcon2 className="w-5 h-5 text-[#261f22]" />
      <div className="ml-[3px] flex items-center">
        <p className="text-base font-bold text-[#261f22]">{rating.toFixed(1)}</p>
        <p className="text-base font-normal text-[#261f22] ml-1.5">
          {`${reviews} ${reviews === 1 || reviews === 0 ? "(review)" : "(reviews)"}`}
        </p>
      </div>
    </div>
  </div>

  {/* Price Section */}
  <div className="flex flex-col items-end shrink-0 min-w-[90px]">
    <p className="text-xl font-bold leading-6 text-[#261f22]">
      ${groupPrice}
      {groupPrice ? "-$" : ""}{price}
    </p>
    <p className="text-base font-normal text-[#261f22]">per hour</p>
  </div>
</div>

      {/* <div className="flex justify-start items-center flex-row mt-4">
        <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-sm font-semibold text-[white] min-w-[220px] h-[45px] w-[220px] cursor-pointer block box-border grow-0 shrink-0 basis-auto rounded-[100px] border-[none]">
          Book Session
        </Button>
        <SvgIcon3 className="w-6 h-6 flex grow-0 shrink-0 basis-auto ml-[18px]" />
      </div> */}
    </div>
  );
}
export default MusicianProfileCard1;
