import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ClassHeading from "../components/ClassHeading";
import NewHeader from "../components/NewHeader";

export default function Class() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const fetch = async (id) => {
    setLoading(true);
    if (id) {
      const docRef = doc(db, "classes", id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setData(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    fetch(id);
  }, [router.isReady, router.query]);

  return (
    <div>
      <Head>
        <title>pocketclass</title>
        <meta name="description" content="Extracurricular classes class page" />
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>

      {/* header */}

      {/* body */}
      <main className="max-w-7xl mx-auto px-1 py-8 sm:px-1">
        {loading ? (
          <section>
            <h1 className="font-bold text-2xl text-center">Loading...</h1>
          </section>
        ) : (
          <ClassHeading
            key={data.id} // should have an id
            id={id}
            type={data.Type}
            name={data.Name}
            images={data.Images}
            description={data.Description}
            pricing={data.Pricing}
            about={data.About}
            experience={data.Experience}
            funfact={data.FunFact}
            ratings={[data.Ratings]}
            location={data.Location}
            address={data.Address}
            price={data.Price}
            category={data.Category}
            data={data}
          />
        )}
      </main>
      <Footer />
    </div>
  );

  // export default Class;
}
