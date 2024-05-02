import React, { useEffect, useRef, useState } from "react";
// firebase
import { db } from "/firebaseConfig";
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
// hooks
import useClickOutside from "../hooks/OnClickOutside";
// utils
import { toast } from "react-toastify";
import FlipMove from "react-flip-move";
import moment from "moment/moment";

const Notifications = ({ user }) => {
	// DROPDOWN STUFF
	const myRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};
	useClickOutside(myRef, () => {
		setIsOpen(false);
	});

	// NOTIFICATIONS STUFF
	const [notifications, setNotifications] = useState([]);

	// realtime notifications update
	useEffect(() => {
		let isMounted = true;
		const observeNotifications = async () => {
			try {
				onSnapshot(
					query(collection(db, "notifications")),
					async (querySnapshot) => {
						const newNotifications = querySnapshot?.docs
							?.filter?.(
								(doc) =>
									doc?.data?.()?.user === user.uid &&
									doc?.data?.()?.isRead === false
							)
							.map((doc) => doc?.data?.());

						if (isMounted) {
							setNotifications(
								!!newNotifications && newNotifications.length > 0
									? newNotifications
									: []
							);
						}
					}
				);
			} catch (error) {
				toast.error("Notifications observing error !", {
					toastId: "notificationError3",
				});
				console.warn(error);
			}
		};

		observeNotifications();

		return () => {
			isMounted = false;
		};
	}, [user]);

	// mark all as read
	const markAllAsRead = async () => {
		try {
			setNotifications([]);

			const querySnapshot = await getDocs(
				query(
					collection(db, "notifications"),
					where("user", "==", user?.uid),
					where("isRead", "==", false)
				)
			);

			querySnapshot.forEach(async (docRef) => {
				await updateDoc(doc(db, "notifications", docRef.id), {
					isRead: true,
				});
			});
		} catch (error) {
			toast.error("Notifications marking error !", {
				toastId: "notificationError2",
			});
			console.warn(error);
		}
	};

	return (
		<div className="relative" ref={myRef}>
			{/* notification button */}
			<button
				onClick={toggleDropdown}
				className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center relative focus:outline-none rounded-full hover:bg-gray-100"
			>
				<div
					className={`bg-logo-red h-1 w-1 md:h-2 md:w-2 rounded-full absolute top-0.5 right-2 animate-pulse ${
						notifications?.length === 0 && " !hidden"
					}`}
				/>
				<svg
					className="fill-gray-500"
					height="23px"
					width="23px"
					version="1.1"
					id="Capa_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 611.999 611.999"
					xmlSpace="preserve"
				>
					<g>
						<g>
							<g>
								<path
									d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
				C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
				c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
				h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
				c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
				C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
				c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
				c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
				 M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
				c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
				c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"
								/>
								<path
									d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258
				c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258
				C323.259,126.96,315.532,119.235,306.001,119.235z"
								/>
							</g>
						</g>
					</g>
				</svg>
			</button>

			{isOpen && (
				<div className="origin-top-right absolute right-0 -mr-12 md:-mr-0 mt-3 w-[240px] sm:w-[320px] md:w-[370px] rounded-xl shadow-lg bg-white ring-2 ring-black ring-opacity-5 overflow-hidden px-1 py-4">
					{/* header */}
					<div className="px-2 mx-2 mb-4 flex items-center">
						{/* heading */}
						<h1 className="uppercase font-bold text-logo-red text-lg">
							Notifications
						</h1>

						{/* read all */}
						<button
							className={`px-2 ml-auto ${
								notifications?.length === 0 && " !hidden"
							}`}
							title={"Mark all as read"}
							onClick={() => markAllAsRead()}
						>
							<svg
								width="22px"
								height="22px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-gray-400 ease-in-out duration-150 hover:stroke-logo-red"
							>
								<path
									d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
									strokeWidth="1.5"
									strokeLinecap="round"
									className="stroke-inherit "
								/>
								<path
									d="M16 7L12 11"
									strokeWidth="1.5"
									strokeLinecap="round"
									className="stroke-inherit"
								/>
								<path
									d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
									strokeWidth="1.5"
									strokeLinecap="round"
									className="stroke-inherit"
								/>
							</svg>
						</button>
					</div>

					{/* notifications */}
					<FlipMove
						className="flex flex-col overflow-y-auto max-h-72 sm:max-h-96 smallScrollbar px-2"
						enterAnimation="elevator"
						leaveAnimation="elevator"
					>
						{notifications?.length > 0 ? (
							notifications?.map?.((notif, index) => (
								<div
									key={`${index}${notif?.createdAt}`}
									className="w-full min-h-24 mb-2 border bg-gray-100 rounded-lg shadow-sm hover:opacity-80 py-2 px-4 cursor-default"
								>
									<div className="flex mb-1 text-gray-400">
										<p className="text-xs w-fit">
											{moment(notif?.createdAt?.toDate?.())?.format?.(
												"DD-MM-YY"
											)}
										</p>
										<p className="text-xs ml-auto w-fit">
											{moment(notif?.createdAt?.toDate?.())?.format?.(
												"hh:mm A"
											)}
										</p>
									</div>
									<p className="text-sm text-gray-500">{notif?.text}</p>
								</div>
							))
						) : (
							<p className="text-lg font-bold text-gray-400 p-8 m-auto cursor-default">
								Empty
							</p>
						)}
					</FlipMove>
				</div>
			)}
		</div>
	);
};

export default Notifications;
