import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
const StripeRefresh = () => {
  const history = useRouter();
  const [user] = useAuthState(auth);
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
        const email = data.email;

        let link = await fetch("/api/createExternalAccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, accountId: accountId }),
        });

        link = await link.json();
        const onboardingLink = link.onboardingLink;
        window.location.href = onboardingLink;
      }
      else{
        history.push("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert(error);
    }
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

export default StripeRefresh;
