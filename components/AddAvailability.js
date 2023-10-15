// ADD APPOINTMENT
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
// library
import moment from "moment";
import { toast } from "react-toastify";
// firebase
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
// hooks
import useClickOutside from "../hooks/OnClickOutside";
// utils
import { generateHourlySlotsForDate } from "../utils/slots";

// send email
const sendEmail = async (targetEmail, targetSubject, targetText, now) => {
	try {
		const res = await fetch("/api/sendEmail", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				subject: targetSubject,
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

const AddAvailability = ({ slotDate, closeModal, classId, uEmail }) => {
	const [loading, setLoading] = useState(false);
	// for closing modal
	const modalRef = useRef();
	useClickOutside(modalRef, closeModal);

	// for displaying available slots
	const [hourlySlots, setHourlySlots] = useState([]);
	useEffect(() => {
		const getSlots = () => {
			setLoading(true);
			const slots = generateHourlySlotsForDate(slotDate);
			setHourlySlots(slots);
			setLoading(false);
		};

		getSlots();
	}, []);

	// new availability
	const [newList, setNewList] = useState([]);
	const handleAddSlot = (start, end) => {
		setNewList((prev) => [
			...prev,
			{
				title: "Available",
				availability: true,
				start: start,
				end: end,
			},
		]);
	};

	const handleRemoveSlot = (start, end) => {
		setNewList((prev) =>
			prev.filter(
				(a) => !(moment(a.start).isSame(start) && moment(a.end).isSame(end))
			)
		);
	};

	// adding availability
	const handleAddAvailability = async () => {
		try {
			setLoading(true);
			addDoc(collection(db, "schedule"), {
				class: classId,
				date: moment(slotDate).toDate(),
				availability: newList,
			}).then(() => {
				toast.success("Availability added !", {
					toastId: "asSuccess",
				});

				const targetText = `Your availability was added successfully for ClassId: ${classId}`;
				sendEmail(uEmail, `Appointment add success`, targetText);

				setLoading(false);
				closeModal();
			});
		} catch (error) {
			setLoading(false);
			console.warn(error);
			toast.error("Availability setting error !", {
				toastId: "asError2",
			});
		}
	};

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300`}
		>
			{loading ? (
				<section className="flex justify-center items-center min-h-[100vh]">
					<Image src="/Rolling-1s-200px.svg" width={"60px"} height={"60px"} />
				</section>
			) : (
				<div
					ref={modalRef}
					className={`bg-white rounded-2xl p-8 md:px-12 w-[90%] sm:w-3/4 max-w-[1000px] transform transition-transform duration-300 ease-in-out shadow-xl`}
				>
					<div className="flex items-center justify-between flex-wrap">
						<h1 className="text-gray-700 font-bold text-2xl uppercase">
							Set Availability
						</h1>
						{slotDate && (
							<h1 className="text-logo-red font-bold text-xl">
								{moment(slotDate).format("MMMM D, YYYY")}
							</h1>
						)}
					</div>

					<div className="flex flex-col w-full mt-6">
						{/* slots */}
						<div className="mt-6 w-full">
							<h1 className="w-full text-center text-gray-700 font-bold text-xl">
								Choose Slots
							</h1>

							<div className="mt-3 flex justify-center flex-wrap max-h-[300px] overflow-y-auto smallScrollbar">
								{hourlySlots?.map?.((slot) => {
									const isSelected = newList.some(
										(a) =>
											moment(a.start).isSame(slot.start) &&
											moment(a.end).isSame(slot.end)
									);

									const handleClick = () => {
										isSelected
											? handleRemoveSlot(slot.start, slot.end)
											: handleAddSlot(slot.start, slot.end);
									};

									return (
										<button
											key={slot.label}
											onClick={handleClick}
											className={`py-2 px-4 border rounded-lg m-1 min-w-[190px] md:min-w-[210px] flex-1
											${isSelected ? "bg-logo-red text-white" : "bg-gray-50 text-gray-700"}
											`}
										>
											{slot.label}
										</button>
									);
								})}
							</div>
						</div>

						{/* add btn */}
						<div className="mt-6 mx-auto">
							<button
								onClick={handleAddAvailability}
								className="bg-logo-red text-white py-2 px-8 rounded-lg opacity-80 hover:opacity-100 duration-150 ease-in-out disabled:grayscale-[50%] disabled:!opacity-80"
								disabled={newList?.length === 0 || loading}
							>
								Confirm Availability
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddAvailability;
