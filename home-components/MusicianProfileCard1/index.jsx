import SvgIcon2 from "./icons/SvgIcon2";
import { categories } from "../../utils/categories";
import { toast } from "react-toastify";

function MusicianProfileCard1({ instructor, router }) {
  const fullName = `${instructor?.name?.split(" ").slice(0, 4).join(" ") || "N/A"}`.trim();
  const rating = instructor?.averageRating;
  const price = instructor?.Price;
  const specialization = instructor?.SubCategory || instructor?.Type;
  const groupPrice = instructor?.groupPrice;

  const getCategoryIcon = (category, type) => {
    const categoryData = categories.find((cat) => cat.name === category);
    if (!categoryData) return null;
    const subCategoryData = categoryData.subCategories.find((sub) => sub.name === type);
    return subCategoryData ? subCategoryData.imagePath : categoryData.imagePath;
  };

  return (
    <div className="flex flex-col justify-between w-full px-[15px] py-4 bg-white rounded-lg">
      {/* Top Info Section */}
      <div>
        <div className="flex justify-between items-start gap-2 w-full">
          <div>
            <p className="[font-family:'DM_Sans',sans-serif] text-md font-bold text-[#261f22] m-0 p-0 text-[13px]">
              {fullName.length > 30 ? `${fullName.slice(0, 25)}..` : fullName}
            </p>

            {/* Category + SubCategory */}
            <div className="flex flex-wrap items-center gap-1 max-w-[180px]">
              {getCategoryIcon(instructor?.Category, specialization) && (
                <img
                  src={getCategoryIcon(instructor?.Category, specialization)}
                  alt={specialization}
                  className="w-4 h-4"
                />
              )}
              <p className="text-base font-bold text-[#7d797a] break-words">
                {instructor?.category?.split(" ")[0]}
              </p>
              <img src="/assets/image_7a2617f3.png" alt="" className="h-1 w-1 block" />
              <p className="text-base font-bold text-[#7d797a] break-words">{specialization}</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-end shrink-0 min-w-[90px]">
            <p className="text-xl font-bold leading-6 text-[#261f22]">
              ${groupPrice}
              {groupPrice ? "-$" : ""}
              {price}
            </p>
            <p className="text-base font-normal text-[#261f22]">per hour</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <SvgIcon2 className="w-5 h-5 text-[#261f22]" />
          <p className="text-base font-bold text-[#261f22]">{rating?.toFixed(1)}</p>
        </div>
      </div>

      {/* Bottom Section: Instructor Info Full Width + Right Aligned */}
      <div className="mt-2 w-full text-[#7d797a] hover:text-[#261f22] justify-end items-center flex">
        <div className="hover:bg-gray-200 px-[15px] flex px-2 py-1 rounded-xl w-fit h-fit justify-end items-center gap-2">
          <p className="truncate text-base font-bold">
          By{" "}
          {(() => {
            const name = instructor?.instructorName || "instructor";
            const [first] = name.trim().split(/\s+/);
            return first;
          })()}
        </p>
        {instructor?.instructorImage ? (
          <img
            src={instructor.instructorImage}
            alt="Instructor"
            className="w-[30px] h-[30px] rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] rounded-full flex-shrink-0 text-[#888]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
        </div>
      </div>
    </div>
  );
}

export default MusicianProfileCard1;
