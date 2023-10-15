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
// stripe
import {
	useStripe,
	useElements,
	PaymentElement,
	Elements,
	AddressElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

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

const AddBooking = ({
	slotDate,
	availability,
	appointments,
	closeModal,
	uid,
	uEmail,
	uName,
	classId,
	insId,
	price,
}) => {
	const [options, setOptions] = useState(null);
	useEffect(() => {
		const getOptions = async () => {
			try {
				const checkoutSession = await fetch("/api/create-stripe-session", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						uid,
						uEmail,
						uName,
						classId,
						insId,
						price,
					}),
				});
				const data = await checkoutSession.json();
				const result = {
					clientSecret: data?.clientSecret,
				};

				setOptions(result);
			} catch (error) {
				console.warn(error);
				toast.error("Payments error !" + error?.message || "", {
					toastId: "apError2",
				});
			} finally {
				setLoading(false);
			}
		};

		getOptions();
	}, []);

	const [loading, setLoading] = useState(false);
	// for closing modal
	const modalRef = useRef();
	useClickOutside(modalRef, closeModal);

	// for displaying available slots
	const [hourlySlots, setHourlySlots] = useState([]);
	useEffect(() => {
		const getSlots = () => {
			setLoading(true);
			const slots = generateHourlySlotsForDate(
				slotDate,
				availability,
				appointments,
				true
			);
			setHourlySlots(slots);
			setLoading(false);
		};

		getSlots();
	}, []);

	// for adding new appointment
	const initialState = {
		owner: uid,
		instructor: insId,
		title: uName,
		class: classId,
		start: null,
		end: null,
		price: price,
	};
	const [newAppointment, setNewAppointment] = useState(initialState);
	const [confirm, setConfirm] = useState(false);

	const handleTime = (start, end) => {
		setNewAppointment({ ...newAppointment, start: start, end: end });
	};

	const handleAddAppointment = () => {
		try {
			setLoading(true);
			addDoc(collection(db, "appointments"), newAppointment).then(() => {
				toast.success("Appointment added !", {
					toastId: "apSuccess",
				});
				const targetText = `Your appointment was added successfully. Followings are the details:\n\nClass Id: ${
					newAppointment.class
				}\n\nStart Time: ${moment(newAppointment.start)?.format?.(
					"DD-MM-YY / hh:mm A"
				)}\n\nEnd Time: ${moment(newAppointment.end)?.format?.(
					"DD-MM-YY / hh:mm A"
				)}\n\nPrice: ${newAppointment.price}`;
				sendEmail(uEmail, `Appointment add success`, targetText);
				setLoading(false);
				closeModal();
			});
		} catch (error) {
			setLoading(false);
			console.warn(error);
			toast.error("Appointment adding error !", {
				toastId: "apError2",
			});
		}
	};

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300`}
		>
			{loading || !options || hourlySlots?.length < 24 ? (
				<section className="flex justify-center items-center min-h-[100vh]">
					<Image src="/Rolling-1s-200px.svg" width={"60px"} height={"60px"} />
				</section>
			) : (
				<div
					ref={modalRef}
					className={`bg-white rounded-2xl p-8 md:px-12 w-[90%] sm:w-3/4 max-w-[1000px] max-h-[95vh] transform transition-transform duration-300 ease-in-out shadow-xl`}
				>
					{confirm ? (
						<Elements
							stripe={stripePromise}
							options={{
								clientSecret: options?.clientSecret,
								appearance: { theme: "flat" },
							}}
						>
							<CheckoutForm
								onSuccess={handleAddAppointment}
								closeModal={closeModal}
								uEmail={uEmail}
								price={price}
							/>
						</Elements>
					) : (
						<>
							<div className="flex items-center justify-between flex-wrap">
								<h1 className="text-gray-700 font-bold text-2xl">
									Add Appointment
								</h1>
								{slotDate && (
									<h1 className="text-logo-red font-bold text-xl">
										{moment(slotDate).format("MMMM D, YYYY")}
									</h1>
								)}
							</div>

							{hourlySlots?.some((s) => s.isAvailable) ? (
								<div className="flex flex-col w-full mt-6">
									{/* slots */}
									<div className="mt-6 w-full">
										<h1 className="w-full text-center text-gray-700 font-bold text-xl">
											Select a slot
										</h1>

										<div className="mt-3 flex justify-center flex-wrap max-h-[300px] overflow-y-auto smallScrollbar">
											{hourlySlots?.map?.((slot) => {
												const isSelected =
													moment(newAppointment.start).isSame(slot.start) &&
													moment(newAppointment.end).isSame(slot.end);

												const handleClick = () => {
													isSelected
														? handleTime(initialState.start, initialState.end)
														: handleTime(slot.start, slot.end);
												};

												return (
													<button
														key={slot.label}
														onClick={handleClick}
														className={`py-2 px-4 border rounded-lg m-1 min-w-[190px] md:min-w-[210px] flex-1
														${isSelected ? "bg-logo-red text-white" : "bg-gray-50 text-gray-700"}
														disabled:bg-gray-300 disabled:opacity-20 disabled:cursor-default`}
														disabled={!slot.isAvailable}
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
											onClick={() => setConfirm(true)}
											className="bg-logo-red text-white py-2 px-8 rounded-lg opacity-80 hover:opacity-100 duration-150 ease-in-out disabled:grayscale-[50%] disabled:!opacity-80"
											disabled={!newAppointment.start || !newAppointment.end}
										>
											Confirm Appointment
										</button>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center w-full h-48 mx-auto my-6">
									<h1 className="text-gray-400 font-bold text-2xl">
										No slot available
									</h1>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
};
export default AddBooking;

// CHECKOUT FORM
const CheckoutForm = ({ onSuccess, closeModal, uEmail, price }) => {
	const [loading, setLoading] = useState(false);
	const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
	const [isAddressCompleted, setIsAddressCompleted] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		try {
			event.preventDefault();

			if (!stripe || !elements) {
				return;
			}

			setLoading(true);

			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: "https://pocketclass.com",
				},
				redirect: "if_required",
			});

			if (result.error) {
				console.warn(result.error.message);
				toast.error(`Payment error !\n${result?.error?.message || ""}`, {
					toastId: "pError2",
				});
				closeModal();
			} else {
				sendEmail(
					uEmail,
					`Payment Successfull`,
					`Your payment of $${price} is successfull for class appointment.`
				);
				await onSuccess();
			}
			setLoading(false);
		} catch (error) {
			toast.error(`Payment error !\n${error?.message || ""}`, {
				toastId: "pError2",
			});
			console.warn(error);
			closeModal();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className=" max-h-[85vh] overflow-y-auto smallScrollbar p-4"
		>
			<div className="flex w-full items-center justify-between mb-8">
				<h1 className="text-gray-700 font-bold text-xl">Payment</h1>

				<h1 className="text-gray-700 font-bold">${price}</h1>
			</div>

			<AddressElement
				className=""
				onChange={(e) => setIsAddressCompleted(e?.complete)}
				options={{
					mode: "billing",
					autocomplete: { mode: "automatic" },
					display: { name: "full" },
				}}
			/>

			<PaymentElement
				className="mt-4"
				onChange={(e) => setIsPaymentCompleted(e?.complete)}
				options={{
					layout: "accordion",
				}}
			/>

			<button
				disabled={
					!stripe ||
					!elements ||
					loading ||
					!isPaymentCompleted ||
					!isAddressCompleted
				}
				className="text-white bg-logo-red w-full mt-6 p-2 rounded-md disabled:opacity-50 hover:opacity-80"
			>
				{loading ? "..." : "Pay"}
			</button>
		</form>
	);
};
