// Booking.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
// library
import { toast } from "react-toastify";
// firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
// components
import Header from "../components/Header";
import Dropdown from "../components/Dropdown";
import moment from "moment";

export default function Support() {
	// user & class
	const [user] = useAuthState(auth);
	const [userData, setUserData] = useState(null);
	const [isSending, setIsSending] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const uid = user?.uid;
	const uName = `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`;

	// data
	const [bookings, setBookings] = useState([]);
	const [appointments, setAppointments] = useState([]);
	const [classes, setClasses] = useState([]);

	// application
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const [appointment, setAppointment] = useState(null);

	const options = [...bookings, ...appointments]?.map?.((a) => ({
		...a,
		label: classes?.find?.((c) => c.id === a.class)?.Name,
		isInstructor: a.instructor === uid,
	}));

	/**
	 * DATA FUNCTIONS
	 */
	// get data from db
	const getData = async (xid, xcol) => {
		const docRef = doc?.(db, xcol, xid);
		const data = await getDoc?.(docRef);
		return data?.data?.();
	};

	// get appointments
	const getAppointments = async () => {
		try {
			const querySnapshot = await getDocs(
				query(
					collection(db, "appointments"),
					where("owner", "==", uid),
					orderBy("end", "desc")
				)
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

	// get bookings
	const getBookings = async () => {
		try {
			const querySnapshot = await getDocs(
				query(
					collection(db, "appointments"),
					where("instructor", "==", uid),
					orderBy("end", "desc")
				)
			);

			const apps = querySnapshot?.docs?.map?.((app) => app?.data?.());
			setBookings(apps || []);
		} catch (error) {
			toast.error("Bookings loading error !", {
				toastId: "bookError3",
			});
			console.warn(error);
		}
	};

	// get classes
	const getClasses = async () => {
		try {
			const querySnapshot = await getDocs(query(collection(db, "classes")));

			const apps = querySnapshot?.docs?.map?.((app) => ({
				...app?.data?.(),
				id: app?.id,
			}));
			setClasses(apps || []);
		} catch (error) {
			toast.error("Appointments loading error !", {
				toastId: "classError1",
			});
			console.warn(error);
		}
	};

	// get all data
	useEffect(() => {
		const getAllData = async () => {
			try {
				setIsLoading(true);
				const uData = await getData(uid, "Users");
				setUserData(await uData);

				await getAppointments();
				await getBookings();
				await getClasses();

				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				toast.error("Class Data loading error !", {
					toastId: "classError3",
				});
				console.warn(error);
			}
		};

		if (!!user) getAllData();
	}, [user]);

	/**
	 * APPOINTMENTS FUNCTIONS
	 */
	// handle send
	const handleSend = async () => {
		try {
			// send email
			setIsSending(true);
			const res = await fetch("/api/sendEmail", {
				method: "POST",
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from: userData.email,
					subject: `Support: ${subject}`,
					html: `<!DOCTYPE html>
					<html>
					<head>
						<style>
							/* Add your CSS styles for beautifying the email here */
							body {
								font-family: Arial, sans-serif;
							}
							.container {
								max-width: 600px;
								margin: 0 auto;
								padding: 20px;
								background-color: #f7f7f7;
							}
							.content {
								background-color: #fff;
								padding: 20px;
								box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
							}
							h2 {
								font-size: 24px;
							}
							p {
								font-size: 16px;
								margin-bottom: 10px;
							}
						</style>
					</head>
					<body>
						<div class="container">
							<div class="content">
								<h2>Requesting User Information</h2>
								<p>User ID: ${uid}</p>
								<p>User Email: ${userData?.email}</p>
								<p>User Phone: ${userData?.phoneNumber}</p>
								<p>User Category: ${userData?.category}</p>
								<br/>
								<br/>
								<h2>Class Information</h2>
								<p>Class ID: ${!!appointment ? appointment?.class : "Nill"}</p>
								<p>Class Name: ${!!appointment ? appointment?.label : "Nill"}</p>
								<br/>
								<br/>
								<h2>Appointment Information</h2>
								<p>Appointment Start Date: ${
									!!appointment
										? moment?.unix?.(appointment?.start)?.format?.("LLL")
										: "Nill"
								}</p>
								<p>Appointment End Date: ${
									!!appointment
										? moment?.unix?.(appointment?.start)?.format?.("LLL")
										: "Nill"
								}</p>
								<p>User Role: ${
									!!appointment
										? appointment?.isInstructor
											? "Instructor"
											: "Student"
										: "Nill"
								}</p>
								<br/>
								<br/>
								<h2>Email Content</h2>
								<p>Email Subject: ${subject}</p>
								<p>Email Description: ${description}</p>
							</div>
						</div>
					</body>
					</html>
					`,
				}),
			});

			if (!!res?.ok) {
				toast.success("Email sent successfully !", {
					toastId: "emError3",
				});
			}

			setIsSending(false);
			setSubject("");
			setDescription("");
			setAppointment(null);
		} catch (error) {
			toast.error("Email sending error !", {
				toastId: "emError3",
			});
			console.warn(error);
			setIsSending(false);
		}
	};

	return isLoading || !classes || !userData ? (
		<section className="flex justify-center items-center min-h-[100vh]">
			<Image src="/Rolling-1s-200px.svg" width={"60px"} height={"60px"} />
		</section>
	) : (
		<div className="mx-auto min-h-[100vh] flex flex-col">
			{/* head */}
			<Head>
				<title>Support</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/pc_favicon.ico" />
			</Head>

			{/* header */}
			<Header />

			{/* application container */}
			<div className="bg-white flex-1 flex flex-col p-2 md:p-12">
				<h1 className="capitalize text-logo-red text-2xl md:text-4xl font-medium">
					Pocketclass Support
				</h1>

				<p className="capitalize text-gray-700 font-medium mt-2 mb-4">
					Finding the Help You Need
				</p>

				<div className="p-4 pt-4 md:p-10 md:pt-8 w-full min-h-fit flex-1 flex flex-col bg-white shadow-lg border rounded-3xl overflow-hidden">
					<div className="flex flex-col text-gray-700">
						<p className="uppercase text-logo-red font-medium text-lg mb-3">
							Your Info
						</p>

						<p className="capitalize">
							<strong>Name:</strong> {uName}
						</p>

						<p className=" my-2">
							<strong>Email:</strong> {userData?.email ?? "Not found"}
						</p>

						<p className="">
							<strong>Phone:</strong> {userData?.phoneNumber ?? "Not found"}
						</p>
					</div>

					<div className="flex flex-col text-gray-700">
						<p className="text-logo-red font-medium text-lg mb-3 mt-5">
							SELECT AN APPOINTMENT {"(optional)"}
						</p>

						<div className="flex flex-col">
							<Dropdown options={options} onSelect={setAppointment} />
						</div>
					</div>

					<div className="flex flex-col text-gray-700">
						<p className="uppercase text-logo-red font-medium text-lg mb-3 mt-5">
							Send Us An Email
						</p>

						<div className="flex flex-col">
							<label htmlFor="subject" className="font-bold">
								Subject
							</label>
							<input
								type="text"
								name="subject"
								id="subject"
								placeholder="How can we help you ..."
								className="bg-gray-100 border !border-gray-100 rounded-md shadow-md mt-2 px-4 py-2 focus:!outline-none"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
							/>
						</div>

						<div className="flex flex-col mt-2">
							<label htmlFor="subject" className="font-bold">
								Description
							</label>
							<textarea
								type="text"
								name="subject"
								id="subject"
								className="bg-gray-100 border !border-gray-100 rounded-md shadow-md mt-2 px-4 py-2 focus:!outline-none h-48 resize-none"
								placeholder="Explain your issue ..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>

					<button
						className="bg-logo-red h-8 w-32 rounded-lg text-white ml-auto mt-8 hover:opacity-80 duration-150 disabled:bg-gray-400"
						disabled={
							subject.trim() === "" || description.trim() === "" || isSending
						}
						onClick={handleSend}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
