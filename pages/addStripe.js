import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import Image from "next/image";
const AddStripe = () => {
  const [email, setEmail] = useState("");
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      const getUser = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setEmail(data.email);
        }
      };
      getUser();
      setEmail(user.email);
      console.log(email);
    }
    //check if the user has a stripe account id and redirect to the onboarding link if they do
    if (user) {
      console.log(user)
      const userRef = doc(db, "Users", user.uid);
      console.log(userRef)
      const unsub = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.stripeAccountId) {
            console.log("redirecting to stripe onboarding")
            window.location.href = data.stripeOnboardingLink;
          }
          else {
            console.log("creating stripe account",)
          }
        }
      });
    }
  }, [user]);
  useEffect(() => {
    if (email) {
      createStripeAccount();
    }
  }
  , [email]);
  const UpdateStripeLink = async (link) => {
    const userRef = doc(db, "Users", user.uid);
    return await setDoc(userRef, { stripeOnboardingLink: link }, { merge: true })
  }
  const createStripeAccount = async () => {
    if(!email)return
    console.log(email)
    let link=await fetch("/api/createExternalAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
    link=await link.json()
    console.log(link)
    await UpdateStripeLink(link)
    window.location.href=link
    return link
    
  }



  return (
    <section className="flex justify-center items-center min-h-[100vh]">
    <Image src="/Rolling-1s-200px.svg" width={'60px'} height={"60px"} />
</section>
  );
};

export default AddStripe;
