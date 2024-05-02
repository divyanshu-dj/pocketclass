import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth ,db} from '../firebaseConfig';
import { onSnapshot, doc ,getDoc,setDoc} from 'firebase/firestore';
import { useRouter } from "next/router";
import Image from 'next/image';
const StripeRefresh = () => {
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
        //get Refreshed onboarding link
        const response = await fetch('/api/updateOnboardingLinks', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({accountId}),
        });
        const json= await response.json()
        const onboardingLink = json;
        const userRef = doc(db, "Users", user.uid);
        setDoc(userRef, { stripeOnboardingLink: onboardingLink, }, { merge: true }).then(()=>{
            history.push('/withdraw');
        }
        )
        window.location.href = onboardingLink;
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

export default StripeRefresh;
