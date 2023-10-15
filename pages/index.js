import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import React, { useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LargeCard from "../components/LargeCard";
import MediumCard from "../components/MediumCard";
import FeaturedClass from "../components/FeaturedClasses";
import SmallCard from "../components/SmallCard";
import styles from "../styles/Home.module.css";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, getDocs, query } from "firebase/firestore";
import { Router } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StickyFooter from "../components/StickyFooter";

export default function Home({ exploreData, cardsData }) {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(false);
	const swiperRef = useRef(null);
	const [hasScrolled, setHasScrolled] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState();
	const [isMobile, setIsMobile] = useState(false);

	const uniqueCategory = [];
	let featuredClasses;

	if (!selectedCategory) {
		featuredClasses = cardsData;
	} else {
		featuredClasses = cardsData.filter(
			(product) => product.type === selectedCategory
		);
	}

	exploreData.map((item) => {
		var findItem = uniqueCategory.find((x) => x.type === item.type);
		if (!findItem) uniqueCategory.push(item);
	});

	useEffect(() => {
		setLoading(true);
		return onSnapshot(collection(db, "Reviews"), (snapshot) => {
			setReviews(snapshot.docs.map((doc) => [{ ...doc.data(), id: doc.id }]));
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 120) {
				setHasScrolled(true);
			} else {
				setHasScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 480);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="">
			<Head>
				<title>Pocketclass</title>
				<meta http-equic="Content-Type" content="text/html; charset=utf-8" />
				<meta
					name="description"
					content="Pocketclass offers nearby affordable fitness classes, music classes, art classes, tennis classes, ice hockey classes, personal trainers, sport classes, experienced fitness instructors, and cello lessons."
				/>
				<meta
					property="og:title"
					content="Pocketclass: For all your extracurriculars"
				/>
				<meta
					property="og:description"
					content="Pocketclass offers a platform for students and instructors to access a wide range of classes, taught by experienced instructors, at an affordable price, with convenient and flexible options, secure payment systems, personalized learning experiences, and a sense of community."
				/>
				<meta
					property="og:image"
					content="https://www.pocketclass.ca/_next/image?url=%2Fpc_logo3.png&w=1920&q=75"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/pc_favicon.ico" />
			</Head>
			{/* header */}
			<Header />
			{/* banner */}
			{/* <Banner /> */}

			<section
				className={
					!hasScrolled
						? `category-section`
						: `category-section category-shadow `
				}
			>
				{/* <h1 className="text-4xl font-semibold py-5">
            Explore Class Categories
          </h1> */}
				{/* APIs */}
				{/* grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 category */}
				<div className="max-w-[1800px] mx-auto category pt-5 lg:pb-2 sm:pb-1">
					<Swiper
						navigation={{
							prevEl: isMobile ? null : ".swiper-button-prev",
							nextEl: isMobile ? null : ".swiper-button-next",
						}}
						loop={true}
						slidesPerView="auto"
						breakpoints={{
							320: {
								slidesPerView: 4,
								spaceBetween: 0,
							},
							640: {
								slidesPerView: 4,
								spaceBetween: 0,
							},
							768: {
								slidesPerView: 8,
								spaceBetween: 0,
							},
							1024: {
								slidesPerView: 9,
								spaceBetween: 0,
							},
						}}
						modules={[Navigation]}
						className="category-swiper mySwiper"
					>
						{uniqueCategory?.map(
							({
								id,
								type,
								latitude,
								name,
								images,
								description,
								longitude,
								ratings,
								address,
								price,
								category,
							}) => (
								<SwiperSlide key={id}>
									<SmallCard
										id={id}
										img={images[0]}
										type={type}
										category={category}
										swiperRef={swiperRef}
										setSelectedCategory={setSelectedCategory}
									/>
								</SwiperSlide>
							)
						)}
					</Swiper>
					{!isMobile && (
						<div className="swiper-button-prev">
							<svg
								fill="none"
								stroke="currentColor"
								strokeWidth={0.8}
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					)}
					{!isMobile && (
						<div className="swiper-button-next">
							<svg
								fill="none"
								stroke="currentColor"
								strokeWidth={0.8}
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					)}
				</div>
			</section>

			{/* New Featured Classes Section */}
			<main className="max-w-[1800px] mx-auto lg:mx-10 ">
				<section className="md:px-5 sm:px-5 xs:px-2">
					{/* <h2 className="text-4xl font-semibold py-8 pb-5">Featured Classes</h2> */}
					<div className="flex flex-wrap">
						{featuredClasses?.map(
							({
								id,
								type,
								latitude,
								name,
								images,
								description,
								longitude,
								ratings,
								address,
								price,
								category,
							}) => (
								<FeaturedClass
									key={id}
									id={id}
									name={name}
									reviews={reviews}
									img={images}
									type={type}
									description={description}
									ratings={ratings}
									address={address}
									price={price}
									category={category}
								/>
							)
						)}
					</div>
				</section>

				{/* <section>
          <h2 className="text-4xl font-semibold py-8 pb-5">Featured Classes</h2>
          <div className="flex space-x-3 overflow-scroll scrollbar-hide p-3">
            {featuredClasses?.map(
              ({
                id,
                type,
                latitude,
                name,
                images,
                description,
                longitude,
                ratings,
                address,
                price,
                category
              }) => (
                <MediumCard
                  key={id}
                  id={id}
                  name={name}
                  reviews={reviews}
                  img={images[0]}
                  type={type}
                  description={description}
                  ratings={ratings}
                  address={address}
                  price={price}
                  category={category}
                />
              )
            )}
          </div>
        </section> */}

				<section className="max-w-7xl mx-auto px-1 sm:px-5">
					<LargeCard
						img="https://links.papareact.com/4cj"
						title="Become an Instructor"
						description="Teach your Passion"
						buttonText="I'm Interested"
					/>
				</section>
			</main>

			<StickyFooter />
		</div>
	);
}

export async function getServerSideProps() {
	var exploreData = [];
	var cardsData = [];

	const q = query(collection(db, "classes"));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		var dataObj = {
			id: doc.id,
			type: doc.data().Type,
			name: doc.data().Name,
			images: doc.data().Images,
			description: doc.data().Description,
			address: doc.data().Address,
			location: doc.data().Location.toJSON(),
			price: doc.data().Price,
			category: doc.data().Category,
		};
		exploreData.push(dataObj);
		cardsData.push(dataObj);
	});

	return {
		props: {
			exploreData,
			cardsData,
		},
	};
}
