import { useState } from "react";
import { Button } from "@mui/base";
import { Rate } from "antd";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

function ReviewCard({ classId }) {
  const [user] = useAuthState(auth);
  const [recommendRating, setRecommendRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = async () => {
    if (
      !recommendRating ||
      !qualityRating ||
      !safetyRating ||
      !reviewText
    ) {
      toast.error("Please fill in all fields before submitting");
      return;
    }
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    const userData = await getDoc(doc(db, "Users", user.uid));
    if (!userData.exists()) {
      toast.error("Please login to submit a review");
      return;
    }
    const userDataa = userData.data();
    if (!userDataa.firstName || !userDataa.lastName) {
      toast.error("Please update your profile to submit a review");
      return;
    }
    const reviewData = {
      classID: classId,
      name: userDataa.firstName + " " + userDataa.lastName,
      photo: userDataa.profileImage || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
      recommendRating,
      qualityRating,
      safetyRating,
      review: reviewText,
      userId: user.uid,
      createdAt: Timestamp.now(),
    };
    try {
      await addDoc(collection(db, "Reviews"), reviewData);
      toast.success("Review submitted successfully!");
      setRecommendRating(0);
      setQualityRating(0);
      setSafetyRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-start items-stretch flex-col grow-0 shrink-0 basis-auto">
        <div className="flex justify-center items-center flex-wrap 2xl:flex-nowrap gap-[38px] w-full max-w-[617px] self-center grow-0 shrink-0 basis-auto box-border">
          <div className="flex justify-center items-stretch flex-col w-[174px] grow-0 shrink-0 basis-auto box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-center text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0 mb-[1rem]">
              Would Recommend
            </p>
            <Rate
              value={recommendRating}
              onChange={setRecommendRating}
              style={{ fontSize: 27 }}
            />
          </div>
          <div className="flex justify-center items-stretch flex-col w-[174px] grow-0 shrink-0 basis-auto box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-center text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0 mb-[1rem]">
              Instructor Quality
            </p>
            <Rate
              value={qualityRating}
              onChange={setQualityRating}
              style={{ fontSize: 27 }}
            />
          </div>
          <div className="flex justify-center items-stretch flex-col w-[174px] grow-0 shrink-0 basis-auto box-border">
            <p className="[font-family:'DM_Sans',sans-serif] text-base font-bold text-center text-[#261f22] grow-0 shrink-0 basis-auto m-0 p-0 mb-[1rem]">
              Safety
            </p>
            <Rate
              value={safetyRating}
              onChange={setSafetyRating}
              style={{ fontSize: 27 }}
            />
          </div>
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="border box-border h-[182px] grow-0 shrink-0 basis-auto mt-10 rounded-lg border-solid border-[#a8a5a7] p-4 resize-none"
        />
      </div>
      <Button
        onClick={handleSubmitReview}
        className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[220px] h-[47px] w-[220px] cursor-pointer block box-border self-center grow-0 shrink-0 basis-auto mt-6 rounded-[100px] border-[none] transition-all duration-300 ease-in-out hover:bg-[#3d3438] hover:shadow-lg hover:scale-105"
      >
        Post
      </Button>
    </>
  );
}

export default ReviewCard;
