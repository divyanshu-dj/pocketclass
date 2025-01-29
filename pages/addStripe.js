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
import { useRouter } from "next/router";
const AddStripe = () => {
  const [email, setEmail] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [accountId, setAccountId] = useState("");
  useEffect(() => {
    if (user) {
      const getUser = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setEmail(data.email);
          setAccountId(data.stripeAccountId);
        }
        else{
          router.push("/");
        }
      };
      getUser();
      setEmail(user.email);
    }
  }, [user]);
  useEffect(() => {
    if (email) {
      createStripeAccount();
    }
  }, [email]);
  const UpdateStripeLink = async (link) => {
    const userRef = doc(db, "Users", user.uid);
    return await setDoc(
      userRef,
      { stripeAccountId: link },
      { merge: true }
    );
  };
  const createStripeAccount = async () => {
    if (!email) return;
    // console.log(email)
    let link = await fetch("/api/createExternalAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, accountId: accountId }),
    });
    link = await link.json();
    const accountId = link.accountId;
    const onboardingLink = link.onboardingLink;
    await UpdateStripeLink(accountId);
    window.location.href = onboardingLink;
    return link;
  };

  return (
    <section className="flex justify-center items-center min-h-[100vh]">
      <Image
        priority={true}
        src="/Rolling-1s-200px.svg"
        width={"60px"}
        height={"60px"}
      />
    </section>
  );
};

export default AddStripe;
