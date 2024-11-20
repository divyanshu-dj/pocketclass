import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { StarIcon, CurrencyDollarIcon } from "@heroicons/react/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function FeaturedClass({
  id,
  img,
  name,
  reviews,
  type,
  description,
  ratings,
  address,
  price,
  category,
}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const router = useRouter();

  const classSearch = (event) => {
    const targetClassList = event.target.classList;
    if (
      !targetClassList.contains("swiper-button-next") &&
      !targetClassList.contains("swiper-button-disabled") &&
      !targetClassList.contains("swiper-button-prev") &&
      !targetClassList.contains("swiper-slide") &&
      !targetClassList.contains("swiper-wrapper")
    ) {
      router.push({
        pathname: "/classes",
        query: {
          id: id,
        },
      });
    }
  };

  const currentClassReview = reviews.filter((rev) => rev[0].classID === id);
  let averageReview = 0;

  if (currentClassReview.length !== 0) {
    currentClassReview.forEach((rv) => {
      averageReview +=
        rv[0].qualityRating + rv[0].recommendRating + rv[0].safetyRating;
    });

    averageReview = averageReview / (currentClassReview.length * 3);
  }

  return (
    <div
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      onClick={(e) => classSearch(e)}
      className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4 p-3 cursor-pointer hover:scale-105 transform transition duration-300 ease-out mb-14"
    >
      {/* Image Slider */}
      <div className="">
        <Swiper
          loop={true}
          navigation={isMouseOver}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="mySwiper"
        >
          {img &&
            img.map((img, index) => {
              const url = img?.url || img;
              if (
                typeof img !== "object" ||
                (typeof img === "object" && img.type.includes("image"))
              ) {
										return (
											<SwiperSlide key={`${url} ${index}`}>
                        <div className="w-full" style={{ aspectRatio: "1 / 1" }}>
                          <Image
                            priority={index === 0} 
                            className="absolute top-0 left-0 w-full rounded-xl"
                            src={url}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition={"center"}
                            alt={`Image of ${name}`} 
                            width={300}
                            height={300}
                          />
                        </div>
                      </SwiperSlide>
                    );
              } else {
                return (
                  <SwiperSlide key={`${url} ${index}`}>
                    <div className="w-full" style={{ aspectRatio: "1 / 1" }}>
                    <video 
                      priority={index === 0} 
                      className="absolute top-0 left-0 w-full rounded-xl"
                      src={img.url}
                      layout="responsive"
                      objectFit="cover"
                      objectPosition={"center"}
                      alt={`Video of ${name}`} 
                      width={300}
                      height={300}
                      loop={true}
                      muted
                    />
                    </div>
                  </SwiperSlide>
                );
              }}
            )}
        </Swiper>
      </div>

      {/* Class Info */}
      <div className="flex justify-between mt-3">
        <div className="flex ">
          <h3 className="font-normal">{name}</h3>
        </div>
        <div className="flex gap-3">
          <p className="flex ml-auto">
            <StarIcon className="h-5 text-logo-red" />
            {currentClassReview.length !== 0
              ? Math.round(averageReview) + ".0"
              : "N/A"}
          </p>
          <p className="flex ml-auto">
            <CurrencyDollarIcon className="h-5 w-5 mr-1" fill="#58C18E" />
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeaturedClass;
