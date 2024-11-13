import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import { categories } from "../../utils/categories";

function SportSelectionWidget({ category: selectedCategory }) {
  const selectedCategoryData = categories.find(cat => cat.name.toLowerCase() === selectedCategory);
  console.log(selectedCategoryData.imagePath);
  
  return (
    <div className="box-border flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto -mt-8 pt-[5px] pb-10">
      <div className="flex justify-start items-center flex-row gap-[43px] self-center grow-0 shrink-0 basis-auto mt-9">
        <SvgIcon1 className="w-8 h-8 flex grow-0 shrink-0 basis-auto" />
        {selectedCategoryData?.subCategories.map((subCategory, index) => (
          <div key={index} className="flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto">
            <img
              src={selectedCategoryData.imagePath}
              alt=""
              className="h-[52px] max-w-[initial] block grow-0 shrink-0 basis-auto ml-[15px] mr-[15.5px]"
            />
            <p className="[font-family:Inter,sans-serif] text-sm font-semibold text-[#261f22] self-center grow-0 shrink-0 basis-auto mt-[14.5px] m-0 p-0">
              {subCategory}
            </p>
          </div>
        ))}
        <SvgIcon2 className="w-8 h-8 flex grow-0 shrink-0 basis-auto" />
      </div>
    </div>
  );
}

export default SportSelectionWidget;
