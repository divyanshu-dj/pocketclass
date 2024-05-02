import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth ,db} from '../firebaseConfig';
import { onSnapshot, doc ,getDoc,setDoc} from 'firebase/firestore';
import { useRouter } from "next/router";
import Image from 'next/image';
const StripeAdded = () => {
  const history = useRouter();
    const [user]=useAuthState(auth)
  useEffect(() => {
    if (user) {
      checkIfStripeAccountExists();
    }

  }, [user]);
const checkIfStripeAccountExists = async () => {
  const userRef = doc(db, "Users", user.uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    //set stripeAccountId to the user
    const onboardingLink = data.stripeOnboardingLink;
    console.log(onboardingLink);
    //extract the account id from the onboarding link
  // Regular expression to match and extract the account ID
        const regex = /\/acct_(\w+)\//;
        const match = onboardingLink.match(regex);

        // Check if a match is found
        if (match && match[1]) {
        const accountId = 'acct_'+match[1];
        //save the stripe account id to the user
        const userRef = doc(db, "Users", user.uid);
        //check if payouts are enabled 
        let response = await  fetch("/api/isPayoutsEnabled", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId}),
        })
        let  responseData =await response.json()

        let payouts_enabled=responseData.payouts_enabled
        if(!payouts_enabled) 
        {
          window.location.href=onboardingLink
        }
        setDoc(userRef, { stripeAccountId: accountId, }, { merge: true }).then(()=>{
            history.push('/withdraw');
        }
        )
        } else {
        console.error('Account ID not found in the URL');
        }
  }}
  return (
    <section className="flex justify-center items-center min-h-[100vh]">
    <Image src="/Rolling-1s-200px.svg" width={'60px'} height={"60px"} />
</section>
  );
};

export default StripeAdded;
