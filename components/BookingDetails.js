// APPOINTMENT DETAILS
import React, { useRef } from "react";
// library
import moment from "moment";
// hooks
import useClickOutside from "../hooks/OnClickOutside";
// utils
import { isBeforeNow } from "../utils/date";

const Details = ({ appointmentDetails, closeModal, isInstructor }) => {
	// for closing modal
	const modalRef = useRef();
	useClickOutside(modalRef, closeModal);

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300`}
		>
			<div
				ref={modalRef}
				className={`bg-white rounded-2xl p-8 min-w-fit transform transition-transform duration-300 ease-in-out`}
			>
				<h1 className="text-gray-700 font-bold text-2xl">
					{isInstructor ? "Appointment Details" : "Your Appointment Details"}
				</h1>

				<div className="mt-2 text-lg">
					{isBeforeNow(appointmentDetails.end) ? (
						<p className="text-sm uppercase tracking-wide font-mono bg-gray-400 text-gray-800 rounded-full text-center">
							Past
						</p>
					) : (
						<p className="text-sm uppercase tracking-wide font-mono bg-green-400 text-green-800 rounded-full text-center">
							Upcomming
						</p>
					)}
				</div>

				{isInstructor && (
					<div className="mt-4 text-lg">
						<p className="font-bold text-logo-red">Student Name</p>
						<p>{appointmentDetails.title}</p>
					</div>
				)}

				<div className="mt-4 text-lg">
					<p className="font-bold text-logo-red">Start Date</p>
					<p>{moment(appointmentDetails.start).format("LLL")}</p>
				</div>

				<div className="mt-4 text-lg">
					<p className="font-bold text-logo-red">End Date</p>
					<p>{moment(appointmentDetails.end).format("LLL")}</p>
				</div>
			</div>
		</div>
	);
};

export default Details;
