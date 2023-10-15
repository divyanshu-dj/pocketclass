// Booking.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
// library
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
	BriefcaseIcon,
	CalendarIcon,
	CurrencyDollarIcon,
} from "@heroicons/react/solid";
import { toast } from "react-toastify";
// firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
// components
import Header from "../components/Header";
import AddBooking from "../components/AddBooking";
import Details from "../components/BookingDetails";
// utils
import {
	getDateOnly,
	isAfter30Days,
	isBeforeNow,
	isBeforeToday,
} from "../utils/date";
import AddAvailability from "../components/AddAvailability";
import {
	alreadyHasAvailability,
	getDateList,
	getFlatList,
} from "../utils/slots";
const localizer = momentLocalizer(moment);

/* COLORS */
const red = "rgb(245, 0, 0, 0.05)";
const darkGreen = "rgb(0, 190, 0, 0.8)";
const green = "rgb(0, 190, 0, 0.5)";
const darkGray = "rgb(210, 210, 210)";
const gray = "rgb(230, 230, 230, 0.4)";

export default function Booking() {
	const router = useRouter();
	// user & class
	const { id: classId } = router.query;
	const [user] = useAuthState(auth);
	const [userData, setUserData] = useState(null);
	const [classData, setClassData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const uid = user?.uid;
	const uName = `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`;

	// if user is instructor
	const isInstructor = user?.uid === classData?.classCreator;
	const [showAvailability, setShowAvailability] = useState(false);

	// appointment
	const [availability, setAvailability] = useState([]);
	const [appointments, setAppointments] = useState([]);

	// dialogs
	const [showAddForm, setShowAddForm] = useState(false);
	const [slotDate, setSlotDate] = useState(null);
	const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
	const [appointmentDetails, setAppointmentDetails] = useState(null);

	/**
	 * UTILITY FUNCTIONS
	 */

	// redirect to main page
	const goToMainPage = () => router.push("/");

	// get data from db
	const getData = async (xid, xcol) => {
		const docRef = doc?.(db, xcol, xid);
		const data = await getDoc?.(docRef);
		return data?.data?.();
	};

	// check id
	useEffect(() => {
		if (router.isReady && !classId) goToMainPage();
	}, [classId, router.isReady]);

	// close modals
	const handleCloseModal = () => {
		setShowAppointmentDetails(false);
		setShowAddForm(false);
	};

	// appointment styles
	const eventStyleGetter = (event) => {
		return {
			style: {
				backgroundColor: isBeforeNow(event.end) ? darkGray : darkGreen,
				color: isBeforeNow(event.end) ? "black" : "white",
				display: isInstructor || event.owner === uid ? "block" : "none",
				textAlign: "center",
				padding: window.innerWidth > 768 ? "4px" : "1px 4px",
				cursor: !!event?.availability ? "default" : "pointer",
				borderRadius: "1000px",
				fontSize: "13px",
			},
		};
	};

	const dayPropGetter = (date) => {
		return {
			style: {
				backgroundColor: isBeforeToday(date)
					? gray
					: !isInstructor &&
					  alreadyHasAvailability(availability, date) &&
					  green,
			},
		};
	};

	/**
	 * DATA FUNCTIONS
	 */

	// get appointments
	const getAppointments = async () => {
		try {
			const querySnapshot = await getDocs(
				query(collection(db, "appointments"), where("class", "==", classId))
			);

			const apps = querySnapshot?.docs?.map?.((app) => app?.data?.());
			setAppointments(apps || []);
		} catch (error) {
			toast.error("Appointments loading error !", {
				toastId: "appError3",
			});
			console.warn(error);
		}
	};

	// get availability
	const getAvailability = async () => {
		try {
			const querySnapshot = await getDocs(
				query(collection(db, "schedule"), where("class", "==", classId))
			);

			const apps = querySnapshot?.docs?.map?.((app) => app?.data?.());
			setAvailability(apps || []);
		} catch (error) {
			toast.error("Availability loading error !", {
				toastId: "avlError3",
			});
			console.warn(error);
		}
	};

	// get availability data on change
	useEffect(() => {
		const observeAvailability = async () => {
			try {
				onSnapshot(query(collection(db, "schedule")), async (querySnapshot) => {
					const ch = querySnapshot
						.docChanges()
						.find((change) => change?.doc?.data()?.class === classId);

					if (ch) {
						await getAvailability();
					}
				});
			} catch (error) {
				toast.error("Appointments observing error !", {
					toastId: "appError3",
				});
				console.warn(error);
			}
		};

		if (isInstructor && !!classId) observeAvailability();
	}, [isInstructor, classId]);

	// get appointments data on change
	useEffect(() => {
		const observeAppointments = async () => {
			try {
				onSnapshot(
					query(collection(db, "appointments")),
					async (querySnapshot) => {
						const ch = querySnapshot
							.docChanges()
							.find((change) => change?.doc?.data()?.class === classId);

						if (ch) {
							await getAppointments();
						}
					}
				);
			} catch (error) {
				toast.error("Appointment observing error !", {
					toastId: "appError4",
				});
				console.warn(error);
			}
		};

		if (!!classId) observeAppointments();
	}, [classId]);

	// get all data
	useEffect(() => {
		const getAllData = async () => {
			try {
				setIsLoading(true);
				const cData = await getData(classId, "classes");
				const uData = await getData(uid, "Users");
				setClassData(await cData);
				setUserData(await uData);

				await getAppointments();
				await getAvailability();

				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				toast.error("Class Data loading error !", {
					toastId: "classError3",
				});
				console.warn(error);
			}
		};

		if (!!classId && !!user) getAllData();
	}, [classId, user]);

	/**
	 * APPOINTMENTS FUNCTIONS
	 */

	// slot click
	const handleSlotClick = (slot) => {
		const slotDate = getDateOnly(slot.start);
		if (
			isBeforeNow(slotDate) ||
			(isInstructor && !showAvailability) ||
			(isInstructor &&
				showAvailability &&
				alreadyHasAvailability(availability, slotDate)) ||
			(!isInstructor && !alreadyHasAvailability(availability, slotDate))
		)
			return;

		setSlotDate(slotDate);
		setShowAddForm(true);
	};

	// appointment details
	const handleAppointmentClick = (appointment) => {
		if (
			(!isInstructor && appointment.owner !== uid) ||
			!!appointment?.availability
		)
			return;
		setAppointmentDetails(appointment);
		setShowAppointmentDetails(true);
	};

	return isLoading || !classData || !userData || !classId ? (
		<section className="flex justify-center items-center min-h-[100vh]">
			<Image src="/Rolling-1s-200px.svg" width={"60px"} height={"60px"} />
		</section>
	) : (
		<div className="mx-auto min-h-screen flex flex-col">
			{/* head */}
			<Head>
				<title>Booking</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/pc_favicon.ico" />
			</Head>

			{/* header */}
			<Header />

			{/* booking container */}
			<div className="bg-white flex-1 flex flex-col p-2 md:p-12">
				<h1 className="capitalize text-logo-red text-2xl md:text-4xl font-medium pb-1">
					{classData?.Name}
				</h1>

				<div className="icons my-3 flex flex-row flex-wrap mb-10">
					<div className="mt-2 mr-4 flex items-center text-sm text-gray-500">
						<BriefcaseIcon className="h-5 w-5 mr-1" fill="#AF816C" />
						{classData?.Category} / {classData?.Type}
					</div>

					<div className="mt-2 mr-4 flex items-center text-sm text-gray-500">
						<CurrencyDollarIcon className="h-5 w-5 mr-1" fill="#58C18E" />
						{classData?.Price}
					</div>
					<div className="mt-2 w-full md:w-fit flex items-center text-sm text-gray-500">
						<CalendarIcon className="h-5 w-5 mr-1" fill="#E73F2B" />
						Available
					</div>
				</div>

				<div className="p-4 pt-4 md:p-10 md:pt-8 w-full min-h-fit flex-1 flex flex-col bg-white shadow-lg border rounded-3xl overflow-hidden">
					{/* availability */}
					{!!user && !!isInstructor && (
						<div className="flex mb-10 rounded-full border border-logo-red w-fit shadow-md">
							<button
								className={`w-[140px] md:w-[200px] py-1 rounded-l-full font-medium duration-300 ease-in-out ${
									!showAvailability
										? " bg-logo-red text-white"
										: " bg-slate-100 text-gray-700"
								}`}
								onClick={() => setShowAvailability(false)}
							>
								Bookings
							</button>

							<button
								className={`w-[140px] md:w-[200px] py-1 rounded-r-full font-medium duration-300 ease-in-out ${
									showAvailability
										? " bg-logo-red text-white"
										: " bg-slate-100 text-gray-700"
								}`}
								onClick={() => setShowAvailability(true)}
							>
								Your Availability
							</button>
						</div>
					)}

					<Calendar
						className="min-h-[750px] md:min-h-[600px] flex-1 w-full"
						localizer={localizer}
						events={
							!isInstructor
								? getDateList(appointments)?.filter?.((a) => a?.owner === uid)
								: showAvailability
								? getFlatList(availability)
								: getDateList(appointments)
						}
						startAccessor="start"
						endAccessor="end"
						selectable={true}
						onSelectSlot={handleSlotClick}
						onSelectEvent={handleAppointmentClick}
						eventPropGetter={eventStyleGetter}
						dayPropGetter={dayPropGetter}
						longPressThreshold={100}
					/>
				</div>

				{showAddForm &&
					(isInstructor ? (
						<AddAvailability
							slotDate={slotDate}
							closeModal={handleCloseModal}
							classId={classId}
							uEmail={userData?.email}
						/>
					) : (
						<AddBooking
							slotDate={slotDate}
							availability={availability}
							appointments={appointments}
							closeModal={handleCloseModal}
							uName={uName}
							uEmail={userData?.email}
							uid={uid}
							classId={classId}
							insId={classData?.classCreator}
							price={classData?.Price}
						/>
					))}

				{showAppointmentDetails && (
					<Details
						appointmentDetails={appointmentDetails}
						closeModal={handleCloseModal}
						isInstructor={isInstructor}
					/>
				)}
			</div>
		</div>
	);
}
