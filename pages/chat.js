import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// components
import Header from "../components/Header";
// firebase
import { auth, db } from "../firebaseConfig";
import {
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
	Timestamp,
	arrayUnion,
	getDocs,
	query,
	collection,
	where,
	addDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
// animation
import FlipMove from "react-flip-move";
// moment
import moment from "moment/moment";
import AddMedia from "../components/AddMedia";
import MediaDisplay from "../components/MediaDisplay";
import { v4 } from "uuid";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Chat = () => {
	const router = useRouter();
	const bottomRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [isSending, setIsSending] = useState(false);

	// data
	const { cid, chid } = router.query;
	const [user] = useAuthState(auth);
	const [roomData, setRoomData] = useState(null);
	const [classData, setClassData] = useState(null);
	const [studentData, setStudentData] = useState(null);
	const [instructorData, setInstructorData] = useState(null);

	// if user is instructor
	const isInstructor = user?.uid === instructorData?.userUid;

	// messages
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [newMediaPreview, setNewMediaPreview] = useState(null);
	const [newMedia, setNewMedia] = useState(null);

	/**
	 * UTILITY FUNCTIONS
	 */

	// redirect to main page
	const goToMainPage = () => router.push("/");

	// get data (student/instructor/class/chatroom)
	const getData = async (xid, xcol) => {
		const docRef = doc(db, xcol, xid);
		const data = await getDoc(docRef);
		return data?.data();
	};

	// check ids
	useEffect(() => {
		if (router.isReady && (!cid || !chid)) goToMainPage();
	}, [cid, chid, router.isReady]);

	// scroll to bottom
	useEffect(() => {
		const scrollToBottom = () =>
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });

		scrollToBottom();
	}, [messages]);

	/**
	 * DATA FUNCTIONS
	 */

	// get all data
	useEffect(() => {
		const getAllData = async () => {
			try {
				setIsLoading(true);

				const chatRoomTemp = await getData(chid, "chatrooms");
				setRoomData(chatRoomTemp);

				setStudentData(await getData(await chatRoomTemp?.student, "Users"));
				setInstructorData(
					await getData(await chatRoomTemp?.instructor, "Users")
				);
				setClassData(await getData(await chatRoomTemp?.class, "classes"));

				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				console.warn(error);
			}
		};

		if (chid) getAllData();
	}, [chid]);

	/**
	 * LAST SEEN FUNCTIONS
	 */

	// mark notification as read
	const updateLastSeens = async () => {
		try {
			const now = Timestamp?.now();
			const querySnapshot = await getDocs(
				query(
					collection(db, "notifications"),
					where("chatroom", "==", chid),
					where("user", "==", user?.uid),
					where("isRead", "==", false)
				)
			);

			querySnapshot.forEach(async (docRef) => {
				await updateDoc(doc(db, "notifications", docRef.id), {
					createdAt: now,
					isRead: true,
				});
			});
		} catch (error) {
			console.warn(error);
		}
	};

	// mark as read
	useEffect(() => {
		if (!!chid && !!user) updateLastSeens();
	}, [chid, user]);

	/**
	 * MESSAGING FUNCTIONS
	 */

	// realtime message updates
	useEffect(() => {
		const getMessages = async () => {
			try {
				onSnapshot(doc(db, "chatrooms", chid), (doc) => {
					!!doc?.data()?.messages && setMessages(doc?.data()?.messages);
				});
			} catch (error) {
				console.warn(error);
			}
		};

		if (chid) getMessages();
	}, [chid]);

	// upload file
	const uploadFile = async () => {
		const storage = getStorage();
		const mediaRef = ref(
			storage,
			`chat-images/${
				user?.uid?.split(" ").join("") + newMedia?.name ?? "" + v4()
			}`
		);
		return await uploadBytes(mediaRef, newMedia, {
			contentType: newMedia?.type,
		}).then((snapshot) =>
			getDownloadURL(snapshot?.ref).then((downloadURL) => downloadURL)
		);
	};

	// send message
	const sendMessage = async (e) => {
		try {
			e?.preventDefault?.();
			if (newMessage?.trim() === "" && !newMedia) return;
			setIsSending(true);
			setNewMediaPreview(null);
			const chatRoomRef = doc(db, "chatrooms", chid);
			const now = Timestamp?.now();

			let data = {
				text: newMessage,
				sender:
					user?.uid ||
					(isInstructor ? instructorData?.userUid : studentData?.userUid),
				createdAt: now,
			};

			// upload image
			if (!!newMedia) {
				const mediaLink = await uploadFile();
				data["media"] = (await mediaLink) ?? null;
				data["mediaType"] = newMedia?.type ?? null;
			}

			// remove items
			setNewMessage("");
			setNewMedia(null);

			// add message
			await updateDoc(chatRoomRef, {
				lastMessage: now,
				messages: arrayUnion(data),
			});
			setIsSending(false);

			// update last seen & send notification
			updateLastSeens();
			sendNotification();
		} catch (error) {
			setIsSending(false);
			console.warn(error);
		}
	};

	/**
	 * NOTIFICATION/EMAIL FUNCTIONS
	 */

	// send notification
	const sendNotification = async () => {
		try {
			const now = Timestamp?.now();
			const tenMinutesAgo = moment(now?.toDate()).subtract(10, "minutes");
			const twoMinutesAgo = moment(now?.toDate()).subtract(2, "minutes");

			const targetUid = isInstructor
				? roomData?.student || studentData?.userUid
				: roomData?.instructor || instructorData?.userUid;

			const targetEmail = isInstructor
				? studentData?.email
				: instructorData?.email;

			const targetName = isInstructor
				? `${instructorData?.firstName} ${instructorData?.lastName}`
				: `${studentData?.firstName} ${studentData?.lastName}`;

			const targetText = `You have new messages in class '${classData?.Name}' by '${targetName}'.`;

			let data = {
				isRead: false,
				user: targetUid,
				text: targetText,
				createdAt: now,
				chatroom: chid,
			};

			const querySnapshot = await getDocs(
				query(
					collection(db, "notifications"),
					where("chatroom", "==", chid),
					where("user", "==", targetUid)
				)
			);

			if (querySnapshot?.docs?.length > 0) {
				const notifDoc = querySnapshot?.docs?.[0];
				const notifDate = moment(notifDoc?.data()?.createdAt?.toDate());

				if (notifDate?.isBefore(twoMinutesAgo)) {
					await updateDoc(doc(db, "notifications", notifDoc?.id), data);
				}

				if (notifDate?.isBefore(tenMinutesAgo)) {
					await sendEmail(targetEmail, targetText, now);
				}
			} else {
				await addDoc(collection(db, "notifications"), data);
				await sendEmail(targetEmail, targetText, now);
			}
		} catch (error) {
			console.warn(error);
		}
	};

	// send email
	const sendEmail = async (targetEmail, targetText, now) => {
		try {
			const res = await fetch("/api/sendEmail", {
				method: "POST",
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					subject: `Message Alert`,
					text: `${targetText} \n\nTime:${moment(now?.toDate())?.format?.(
						"DD-MM-YY / hh:mm A"
					)}`,
					to: targetEmail,
				}),
			});
		} catch (error) {
			console.warn(error);
		}
	};

	return isLoading ||
		!roomData ||
		!studentData ||
		!classData ||
		!instructorData ||
		!cid ||
		!chid ? (
		<section className="flex justify-center items-center min-h-[100vh]">
			<Image src="/Rolling-1s-200px.svg" width={"60px"} height={"60px"} />
		</section>
	) : (
		<div className="myClassesContainer mx-auto h-screen flex flex-col">
			{/* head */}
			<Head>
				<title>Chat</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/pc_favicon.ico" />
			</Head>

			{/* header */}
			<Header />

			{/* chat container */}
			<div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
				{/* chat left pane */}
				<div className="w-full md:w-[25%] min-w-[200px] md:border-r-2 flex flex-col shadow-md md:shadow-none border-b md:border-b-0">
					{/* chat room */}
					<h1 className="text-sm md:text-base text-logo-red font-bold px-4 mt-2 md:mt-4 md:mb-1">
						Chat Room
					</h1>

					{/* class name */}
					<h1 className="capitalize text-gray-700 text-lg md:text-xl px-4 font-medium pb-2 md:pb-0">
						{classData?.Name}
					</h1>

					{/* members */}
					<h1 className="hidden md:block text-logo-red font-bold px-4 mt-8 mb-2">
						Members
					</h1>

					{/* instructor */}
					<div className="hidden md:flex items-center border-t p-4">
						<img
							src={instructorData?.profileImage ?? "/avatar.png"}
							alt="avatar_img"
							className="h-12 object-contain rounded-full bg-gray-100 p-1"
						/>
						<div className="ml-3">
							<h1 className="font-medium font text-gray-700">
								{instructorData?.firstName ??
									"" + " " + instructorData?.lastName ??
									""}
							</h1>
							<h1 className="text-xs text-gray-400">
								{isInstructor ? "You" : "Instructor"}
							</h1>
						</div>
					</div>

					{/* you */}
					<div className="hidden md:flex items-center border-y p-4">
						<img
							src={studentData?.profileImage ?? "/avatar.png"}
							alt="avatar_img"
							className="h-12 object-contain rounded-full bg-gray-100 p-1"
						/>
						<div className="ml-3">
							<h1 className="font-medium font text-gray-700">
								{studentData?.firstName ??
									"" + " " + studentData?.lastName ??
									""}
							</h1>
							<h1 className="text-xs text-gray-400">
								{!isInstructor ? "You" : "Student"}
							</h1>
						</div>
					</div>

					{/* back */}
					<button
						className="hidden md:block bg-logo-red text-white mt-auto p-1 duration-300 ease-in-out hover:opacity-80"
						onClick={() => router.back()}
					>
						Back to class
					</button>
				</div>

				{/* chat right pane */}
				<div className="flex-1 md:flex-auto w-full md:w-[75%] bg-gray-50 flex flex-col overflow-hidden">
					{/* messages */}
					<div className="flex-1 flex flex-col py-3 px-6 md:py-6 overflow-y-auto scrollbar-hide scroll-smooth">
						{/* start conversation */}
						<div className="text-sm md:text-base w-fit mx-auto bg-gray-200 text-gray-700 py-0.5 px-4 mb-3 rounded-full cursor-default shadow-md">
							Start Conversation
						</div>

						{/* messages */}
						<FlipMove className="flex flex-col" enterAnimation="elevator">
							{messages?.map?.((message, index) => (
								<Message message={message} userId={user?.uid} key={index} />
							))}
						</FlipMove>

						{/* bottom ref */}
						<div ref={bottomRef} className="h-5 w-full" />
					</div>

					{/* input message */}
					<div className="w-full flex p-2 relative">
						{/* media preview */}
						<div
							className={`absolute left-0 bottom-full w-[80%] sm:w-96 bg-gray-200 rounded-2xl mx-2 shadow-md overflow-hidden p-4 flex flex-col ${
								!!newMedia ? "" : "!hidden"
							}
							${!!newMediaPreview ? "aspect-square sm:aspect-auto sm:h-80" : ""}
							`}
						>
							{/* selected files */}
							<div className="flex items-center mb-2">
								<h1 className="text-gray-700 font-medium">Selected File</h1>
								{/* remove button */}
								<button
									onClick={() => {
										setNewMedia(null);
										setNewMediaPreview(null);
									}}
									className="ml-auto p-1 text-red-400 hover:text-red-600"
								>
									Remove
								</button>
							</div>

							{!!newMediaPreview && (
								<MediaDisplay link={newMediaPreview} type={newMedia?.type} />
							)}

							{/* file name */}
							<h1 className="mt-1 text-gray-700 font-medium text-sm break-words">
								{newMedia?.name ?? ""}
							</h1>
						</div>

						{/* input bar */}
						<div className="flex-1 flex rounded-full bg-white border border-gray-300 shadow overflow-hidden">
							<form className="flex-1" onSubmit={(e) => sendMessage(e)}>
								<input
									type="text"
									placeholder="Write a message ..."
									className="w-full px-5 py-3 border-0 !outline-0 !ring-0 text-gray-700"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									readOnly={isSending}
								/>
							</form>

							<div className="relative my-auto h-full md:mx-1 md:h-10 w-16 rounded-full bg-slate-100 flex items-center justify-center hover:opacity-80 ease-in-out cursor-pointer">
								<img
									src="/attach.png"
									alt="attach_img"
									className="h-6 object-contain"
								/>
								<AddMedia
									setMediaPreview={setNewMediaPreview}
									setMedia={setNewMedia}
								/>
							</div>
						</div>

						{/* send button */}
						<button
							onClick={(e) => sendMessage(e)}
							className="bg-logo-red text-white rounded-full ml-4 px-4 md:px-10 md:text-lg
							hover:opacity-80 ease-in-out duration-300 disabled:grayscale-[50%]
							"
							disabled={(newMessage.trim() === "" && !newMedia) || isSending}
						>
							<div
								className={`border-t-2 m-auto border-white rounded-full animate-spin h-6 w-6 ${
									!isSending && "hidden"
								}`}
							/>
							<span className={`${isSending && "hidden"}`}>Send</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;

// Message Card
const Message = React.forwardRef(({ message, userId }, ref) => {
	const isMyMessage = message?.sender === userId;
	const hasMedia = !!message?.media;

	return (
		<div
			ref={ref}
			className={`my-2 cursor-default max-w-[90%] ${
				isMyMessage ? "ml-auto flex flex-col items-end" : "mr-auto"
			}`}
		>
			<div
				className={`text-lg w-fit px-5 py-2 rounded-3xl 
				hover:opacity-80
				${
					isMyMessage
						? "rounded-br-none bg-logo-red text-white"
						: "rounded-bl-none bg-gray-300 text-gray-700"
				}`}
			>
				{!!hasMedia && (
					<div className="max-w-xs max-h-xs md:max-w-sm md:max-h-sm overflow-hidden px-1 py-3">
						<MediaDisplay
							link={message?.media}
							type={message?.mediaType}
							isMessage={true}
							isMyMessage={isMyMessage}
						/>
					</div>
				)}

				<h1>{message?.text ?? ""}</h1>
			</div>

			<h1
				className={`text-[10px] text-gray-400 flex ${
					isMyMessage && "flex-row-reverse"
				}`}
			>
				<span className="font-bold">&nbsp;{isMyMessage && ". You"}</span>
				<span>
					{moment(message?.createdAt?.toDate?.())?.format?.("DD-MM-YY / hh:mm")}
				</span>
			</h1>
		</div>
	);
});
