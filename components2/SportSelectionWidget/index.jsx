import SvgIcon1 from "./icons/SvgIcon1";
import SvgIcon2 from "./icons/SvgIcon2";
import { categories } from "../../utils/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, {useEffect, useState} from "react";

function SportSelectionWidget({ category: selectedCategory }) {
  const selectedCategoryData = categories.find(cat => cat.name.toLowerCase() === selectedCategory);
  console.log(selectedCategoryData.imagePath);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  return (
    <div className="box-border flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto -mt-8 pt-[5px] pb-10">
        <div className="section-spacing mt-9">
            <div className="max-w-[1800px] mx-auto category music-categories mt-5 lg:mb-2 sm:mb-1">
                <div className="relative px-0 md:px-8 lg:px-14">
                    <Swiper
                        navigation={{
                            prevEl: isMobile ? null : ".swiper-button-prev",
                            nextEl: isMobile ? null : ".swiper-button-next",
                        }}
                        loop={true}
                        slidesPerView="auto"
                        breakpoints={{
                            320: {
                                slidesPerView: 3.5,
                                spaceBetween: 0,
                            },
                            640: {
                                slidesPerView: 5,
                                spaceBetween: 0,
                            },
                            768: {
                                slidesPerView: 8,
                                spaceBetween: 0,
                            },
                            1024: {
                                slidesPerView: 10,
                                spaceBetween: 0,
                            },
                        }}
                        modules={[Navigation]}
                        className="category-swiper sports-widget"
                    >
                        {selectedCategoryData?.subCategories.map((subCategory, index) => (
                            <SwiperSlide key={index}>
                                <div key={index}
                                     className="flex justify-start items-stretch flex-col gap-2 grow-0 shrink-0 basis-auto text-center">
                                    <img
                                        src={selectedCategoryData.imagePath}
                                        alt=""
                                        className="h-[52px] w-[52px] block grow-0 shrink-0 basis-auto mx-auto"
                                    />
                                    <p className="[font-family:Inter,sans-serif] text-sm font-semibold text-[#261f22] self-center grow-0 shrink-0 basis-auto m-0 p-0">
                                        {subCategory}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {!isMobile && (
                        <div className="swiper-button-prev left-0">
                            <SvgIcon1 className="h-6 w-6" />
                        </div>
                    )}

                    {!isMobile && (
                        <div className="swiper-button-next right-0">
                            <SvgIcon2 className="h-6 w-6" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default SportSelectionWidget;
