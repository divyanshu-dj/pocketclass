import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { StarIcon, CurrencyDollarIcon } from "@heroicons/react/solid";

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
  const router = useRouter();

  const classSearch = () => {
    router.push({
      pathname: "/classes",
      query: {
        id: id,
      },
    });
  };

  let currentClassReview = reviews.filter((rev) => rev[0].classID === id);
  let averageReview = 0;

  if (currentClassReview.length !== 0) {
    currentClassReview.map((rv) => {
      averageReview =
        averageReview +
        rv[0].qualityRating +
        rv[0].recommendRating +
        rv[0].safetyRating;
    });

    averageReview = averageReview / (currentClassReview.length * 3);
  }

  return (
    <div
      onClick={classSearch}
      className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4 p-3 cursor-pointer hover:scale-105 transform transition duration-300 ease-out"
    >
      {/* <div className="relative h-60 w-60">
        <Image src={img} layout="fill" className="rounded-xl" unoptimized />
      </div> */}

      <div className="h-64 w-64">
        <Image
          src={img}
          width={800}
          height={800}
          className="w-full h-64 rounded-xl object-cover"
          unoptimized
        />
      </div>

      <div className="flex justify-between mt-3">
        <div className="flex ">
          <h3 className="font-normal">{name}</h3>
        </div>
        <div className="flex flex-col">
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
