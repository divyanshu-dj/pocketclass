import { Button } from "@mui/base";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function DynamicButtonSection({ classId, instructorId }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleChatButton = async () => {
    if (!user) {
      toast.warning("Please login to chat with instructor");
      return;
    }

    const now = Timestamp.now();
    const tenMinutesAgo = new Date(now.toMillis() - 10 * 60 * 1000);

    const studentId = user.uid;
    const newChatRoomData = {
      instructor: instructorId,
      student: studentId,
      class: classId,
      messages: [],
      createdAt: Timestamp.now(),
      lastMessage: Timestamp.fromDate(tenMinutesAgo),
    };

    try {
      // Check if chatroom exists
      const chatRoomRef = collection(db, "chatrooms");
      const q = query(
        chatRoomRef,
        where("student", "==", studentId),
        where("instructor", "==", instructorId),
        where("class", "==", classId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        router.push({
          pathname: "/chat",
          query: {
            cid: classId,
            chid: querySnapshot.docs[0].id,
          },
        });
        return;
      }

      // Create new chatroom if none exists
      const newChatRoomRef = await addDoc(chatRoomRef, newChatRoomData);
      router.push({
        pathname: "/chat",
        query: {
          cid: classId,
          chid: newChatRoomRef.id,
        },
      });
    } catch (error) {
      toast.error("Chat loading error!");
      console.warn(error);
    }
  };

  return (
    <div className="flex justify-center items-stretch flex-col grow-0 shrink-0 basis-auto">
      <Button className="bg-[#261f22] [font-family:Inter,sans-serif] text-base font-semibold text-[white] min-w-[368px] h-[45px] cursor-pointer block box-border grow-0 shrink-0 basis-auto rounded-[100px] border-[none] transition-all duration-300 ease-in-out hover:bg-[#3d3438] hover:shadow-lg hover:scale-105">
        <span className="[font-family:Inter,sans-serif] text-base font-semibold">
          Booking schedule
        </span>
      </Button>
      <Button 
        onClick={handleChatButton}
        className="mb-[1rem] bg-transparent [font-family:Inter,sans-serif] text-base font-semibold text-[#261f22] min-w-[368px] h-[45px] cursor-pointer block box-border grow-0 shrink-0 basis-auto mt-4 rounded-[100px] border-2 border-solid border-[#261f22] transition-all duration-300 ease-in-out hover:bg-[#f8f8f8] hover:shadow-md hover:scale-105"
      >
        Send message
      </Button>
    </div>
  );
}

export default DynamicButtonSection;
