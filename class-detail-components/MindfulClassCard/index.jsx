import { Button } from "@mui/base";
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth, db } from "../../firebaseConfig";
import { ChevronLeftIcon } from "@heroicons/react/solid";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function MindfulClassCard({
  name,
  numSessions,
  price,
  Price,
  Discount,
  num_sessions,
  Name,
  discountPercentage = 20,
  classId,
}) {
  const originalPrice = Price ? Price : price;
  const discountedPrice =
    originalPrice -
    (originalPrice * (Discount ? Discount : discountPercentage)) / 100;
  const [stripeOption, setStripeOption] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const selectHandler = async () => {
    setStripeLoading(true);
    const response = await fetch("/api/create-stripe-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: discountedPrice,
      }),
    });

    const data = await response.json();

    if (data?.clientSecret) {
      setStripeLoading(false);

      setStripeOption({
        clientSecret: data.clientSecret,
      });
    } else {
      toast.error("Payments error !", {
        toastId: "apError2",
      });
    }
    setStripeLoading(false);
  };
  return (
    <div className="w-[100.00%] box-border first:mt-0 mt-[26px] md:mt-[39.50px]">
      <div
        className="flex justify-start items-start flex-col sm:flex-row gap-5 sm:gap-0 w-[100.00%] box-border"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="grow-0 shrink basis-auto">
          <p className="[font-family:'DM_Sans',sans-serif] text-xl font-bold text-[#261f22] whitespace-pre-wrap m-0 p-0">
            {`${num_sessions ? num_sessions : numSessions} Sessions Package`}
          </p>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-left leading-6 text-[black] whitespace-pre-wrap w-[100.00%] box-border mt-2 m-0 p-0">
            {Name ? Name : name}
          </p>
        </div>
        <div className="flex justify-start items-stretch flex-col w-[150px] grow-0 shrink-0 basis-auto box-border -ml-px">
          <div className="flex justify-start items-start sm:items-end flex-col grow-0 shrink-0 basis-auto">
            <p className="[font-family:'DM_Sans',sans-serif] text-2xl font-bold leading-6 text-[#261f22] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">
              {`$${discountedPrice.toFixed(2)}`}
            </p>
            <p className="[font-family:'DM_Sans',sans-serif] text-sm font-semibold text-[#ee393c] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">
              {`${Discount ? Discount : discountPercentage}% OFF`}
            </p>
          </div>
          <p className="[font-family:'DM_Sans',sans-serif] text-base font-normal line-through text-[#a8a5a7] whitespace-pre-wrap self-start sm:self-end grow-0 shrink-0 basis-auto m-0 p-0">
            {`$${originalPrice}`}
          </p>
          <Button
            onClick={selectHandler}
            className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[149px] h-[47px] cursor-pointer block box-border grow-0 shrink-0 basis-auto mt-4 sm:mt-[26px] rounded-[100px] border-[none]"
          >
            Select
          </Button>
        </div>
      </div>
      <div className="w-[100.00%] box-border mt-9 border-t-[#d4d2d3] border-t border-solid" />

      {stripeLoading && <CheckoutSkeleton />}
      {stripeOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Elements stripe={stripePromise} options={stripeOption}>
            <CheckoutForm
              setStripeOptions={setStripeOption}
              price={discountedPrice}
              num_sessions={Number(num_sessions ? num_sessions : numSessions)}
              classId={classId}
              name={Name ? Name : name}
            />
          </Elements>
        </div>
      )}
    </div>
  );
}

const CheckoutSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen  bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto animate-pulse">
        {/* Go Back Button Skeleton */}
        <div className="flex flex-row justify-end text-gray-300 mb-2">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>

        {/* Header Section Skeleton */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>

          <div className="flex items-center">
            <div className="h-4 w-20 bg-gray-300 rounded mr-2"></div>
            <div className="h-4 w-12 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Address Element Skeleton */}
        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>

        {/* Payment Element Skeleton */}
        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>
        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>

        {/* Pay Button Skeleton */}
        <div className="mt-4 p-2 bg-gray-400 text-white rounded w-full text-center">
          Processing...
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ price, num_sessions, classId, name, setStripeOptions }) => {
  const stripe = useStripe();
  const [user, userLoading] = useAuthState(auth);
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sendEmail = async (
    targetEmails,
    targetSubject,
    targetHtmlContent,
    attachments = []
  ) => {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: targetSubject,
          html: targetHtmlContent,
          to: targetEmails,
          attachments,
        }),
      });

      if (res.status === 200) {
        console.log("Email sent successfully");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.warn("Error sending email: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      },
      redirect: "if_required",
    });

    if (!error && paymentIntent?.status === "succeeded") {
      const docRef = await addDoc(collection(db, "Packages"), {
        payment_intent_id: paymentIntent.id,
        class_id: classId,
        user_id: user?.uid,
        num_sessions,
        price,
        price_per_session: price / num_sessions,
        classes_left: num_sessions,
      });

      const studentRef = await getDoc(doc(db, "Users", user?.uid));
      const studentData = studentRef?.data();

      const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <h2>Package Purchase Confirmation</h2>
        <p>Hi ${studentData.firstName},</p>
        <p>Thank you for purchasing the <strong>${name}</strong> package!</p>
        <p>Here are the details of your purchase:</p>
        <ul>
            <li><strong>Package Name:</strong> ${name}</li>
            <li><strong>Number of Sessions:</strong> ${num_sessions}</li>
            <li><strong>Price Paid:</strong> $${price.toFixed(2)}</li>
        </ul>
        <p>We’re excited to have you on board and can’t wait for you to start your lessons!</p>
        <p>If you have any questions, feel free to reply to this email—we’re happy to help.</p>
        <p>Best regards,<br>The PocketClass Team</p>
    </div>
`;

      const recipientEmails = `${user?.email}`;

      await sendEmail(
        recipientEmails,
        "Confirmation of Package Purchase",
        htmlContent
      );
    }

    toast.success("Package purchased successfully!");
    setLoading(false);
    setStripeOptions(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex flex-row justify-between text-[#E73F2B] mb-2">
        <div className="text-base font-semibold text-[#E73F2B]">
          Paying: ${price}
        </div>
        <button
          className="top-4 right- flex flex-row items-center gap-1 text-center"
          onClick={() => {
            setStripeOptions(null);
          }}
        >
          <ChevronLeftIcon className="h-4 w-4 mt-1" />
          Go Back
        </button>
      </div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Complete Payment</h1>
      </div>
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement />
      <button
        className="mt-4 p-2 bg-[#E73F2B] text-white rounded w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default MindfulClassCard;
