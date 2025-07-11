import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";

const StripeAdded = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkIfStripeAccountExists();
    }
  }, [user]);

  const checkIfStripeAccountExists = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const accountId = data.stripeAccountId;
        const payment_enabled = data.payment_enabled;
        if (payment_enabled) {
          router.push("/withdraw");
          return;
        }
        if (!accountId) {
          router.push("/addStripe");
          return;
        }

        const response = await fetch("/api/isPayoutsEnabled", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId }),
        });
        const responseData = await response.json();
        const payoutsEnabled = responseData.payouts_enabled;
        if (!payoutsEnabled) {
          toast.error(
            "Your Stripe setup failed. Please try again."
          );
          router.push("/");
          return;
        }

        await setDoc(userRef, { payment_enabled: true }, { merge: true });
        router.push("/withdraw");
        return;
      } else {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-[100vh]">
        <Image
          priority={true}
          src="/Rolling-1s-200px.svg"
          width="60px"
          height="60px"
          alt="Loading"
        />
      </section>
    );
  }

  return null;
};

export default StripeAdded;
