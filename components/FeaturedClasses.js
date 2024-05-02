import React, { useRef, useState } from "react";
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
	const swiperRef = useRef(null);

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
			onMouseEnter={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
			onClick={(e) => classSearch(e)}
			className="w-full md:w-1/2 lg:w-1/4 xl:w-1/4 p-3 cursor-pointer hover:scale-105 transform transition duration-300 ease-out"
		>
			{/* <div className="relative h-60 w-60">
        <Image src={img} layout="fill" className="rounded-xl" unoptimized />
      </div> */}

			<div className="">
				<Swiper
					ref={swiperRef}
					loop={true}
					navigation={isMouseOver}
					pagination={true}
					modules={[Navigation, Pagination]}
					className="mySwiper"
				>
					{img &&
						img.map((image, index) => {
							return (
								<SwiperSlide key={index + image}>
									<div
										className="w-full"
										style={{ aspectRatio: "1 / 1", paddingBottom: "100%" }}
									>
										<img
											className="object-cover object-center absolute top-0 left-0 w-full h-full rounded-xl"
											src={image}
											alt="images"
										/>
									</div>
								</SwiperSlide>
							);
						})}
				</Swiper>

				{/* <Image
          src={img}
          width={1000}
          height={1000}
          className="w-full h-64 rounded-xl object-cover"
          unoptimized
        /> */}
			</div>

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
