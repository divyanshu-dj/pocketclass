import React from "react";

const checkFileType = (fileType) =>
	!!fileType
		? fileType.startsWith("image/")
			? "image"
			: fileType.startsWith("video/")
			? "video"
			: fileType.startsWith("audio/")
			? "audio"
			: "other"
		: null;

const MediaDisplay = ({ link, type, isMessage = false, isMyMessage }) => {
	return (
		<div className="rounded overflow-hidden text-center flex-1 flex w-full">
			{checkFileType(type) === "image" ? (
				<img
					src={link}
					alt="Media"
					className="max-h-full max-w-full m-auto rounded"
				/>
			) : checkFileType(type) === "video" ? (
				<video controls className="max-h-full max-w-full m-auto rounded">
					<source src={link} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : checkFileType(type) === "audio" ? (
				<audio controls className="max-h-full max-w-full m-auto rounded">
					<source src={link} type="audio/mpeg" />
					Your browser does not support the audio tag.
				</audio>
			) : (
				isMessage &&
				(isMyMessage ? (
					<h1 className="w-full text-center border-2 border-gray-700 text-gray-700 px-2 py-0.5 text-sm rounded-full font-medium opacity-40 select-none">
						Sent a file
					</h1>
				) : (
					<a href={link} download className="mt-2 w-full">
						<button className="w-full text-center bg-logo-red text-white px-4 py-1 rounded-full shadow select-none">
							Download File
						</button>
					</a>
				))
			)}
		</div>
	);
};
export default MediaDisplay;
