import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import React, { useState } from "react";
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

export default function Home({ exploreData, cardsData }) {
  const uniqueCategory = [];
  const featuredClasses = cardsData.slice(0, 8);
  exploreData.map((item) => {
    var findItem = uniqueCategory.find((x) => x.type === item.type);
    if (!findItem) uniqueCategory.push(item);
  });

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    return onSnapshot(collection(db, "Reviews"), (snapshot) => {
        setReviews(snapshot.docs.map((doc) => [{ ...doc.data(), "id": doc.id }]))
        setLoading(false)
    })
}, [])

  return (

    <div className="">
      <Head>
        <title>Pocketclass</title>
        <meta http-equic="Content-Type" content="text/html; charset=utf-8" />
        <meta name="description" content="Pocketclass offers nearby affordable fitness classes, music classes, art classes, tennis classes, ice hockey classes, personal trainers, sport classes, experienced fitness instructors, and cello lessons." />
        <meta property="og:title" content="Pocketclass: For all your extracurriculars" />
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
      <Banner />

      <main className="max-w-7xl mx-auto px-8 py-8 sm:px-16">
        <section>
          <h1 className="text-4xl font-semibold py-5">
            Explore Class Categories
          </h1>
          {/* APIs */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
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
                category
              }) => (

                <SmallCard
                  key={id}
                  id={id}
                  img={images[0]}
                  type={type}
                  category={category}
                />
              )
            )}
          </div>
        </section>
        
        {/* New Featured Classes Section */}
        <section>
          <h2 className="text-4xl font-semibold py-8 pb-5">Featured Classes</h2>
          <div className="flex p-3 flex-wrap">
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
                <FeaturedClass
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

        <section>
          <LargeCard
            img="https://links.papareact.com/4cj"
            title="Become an Instructor"
            description="Teach your Passion"
            buttonText="I'm Interested"
          />
        </section>
      </main>

      <Footer />
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
      category: doc.data().Category
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
