import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";

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
        const onboardingLink = data.stripeOnboardingLink;
        const stripeAccountId = data.stripeAccountId;

        if (stripeAccountId) {
          router.push("/withdraw");
          return;
        }

        if (onboardingLink) {
          const regex = /\/acct_(\w+)\//;
          const match = onboardingLink.match(regex);

          if (match && match[1]) {
            const accountId = "acct_" + match[1];

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
              console.log("Payouts not enabled, redirecting to onboarding.");
              window.location.href = onboardingLink;
              return;
            }

            await setDoc(
              userRef,
              { stripeAccountId: accountId },
              { merge: true }
            );

            router.push("/withdraw");
            return;
          } else {
            console.error("Account ID not found in the URL");
          }
        } else {
          console.error("Onboarding link not found");
        }
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error checking Stripe account:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated
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
