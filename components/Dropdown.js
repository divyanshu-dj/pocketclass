import moment from "moment";
import React, { useState } from "react";

const Dropdown = ({ options, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
		onSelect(option);
	};

	return (
		<div className="relative inline-block text-left">
			<div>
				<button
					onClick={() => setIsOpen(!isOpen)}
					type="button"
					className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
					id="options-menu"
					aria-haspopup="listbox"
					aria-expanded="true"
				>
					{selectedOption ? selectedOption.label : "Select an option"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="-mr-1 ml-2 h-5 w-5"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div className="origin-top-right absolute right-0 mt-2 min-w-56 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div
						className="max-h-[300px] overflow-y-scroll smallScrollbar"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						{options?.map?.((option, index) => (
							<div
								key={index + option.label}
								onClick={() => handleOptionSelect(option)}
								className="cursor-pointer flex flex-col m-1 border px-4 py-2 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-blue-100"
								role="menuitem"
							>
								<p className="flex">
									<span className="font-bold w-[50px]">Class: </span>
									{option.label}
								</p>

								<p className="flex">
									<span className="font-bold w-[50px]">Start: </span>
									{moment.unix(option.start.seconds).format("LLL")}
								</p>

								<p className="flex">
									<span className="font-bold w-[50px]">End: </span>
									{moment.unix(option.end.seconds).format("LLL")}
								</p>

								<p className="flex">
									<span className="font-bold w-[50px]">Role: </span>
									{option.isInstructor ? "Instructor" : "Student"}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
