import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { AiOutlineCloseCircle, AiOutlineLoading } from "react-icons/ai";
import useDebounce from "../hooks/useDebounce";

import L from "leaflet";
const customIcon = new L.Icon({
	iconUrl: "/marker.png",
	iconSize: [25, 40],
	iconAnchor: [12.5, 40],
	popupAnchor: [0, -40],
});

export default function MapCoordinates({ setCoordinates, setShowMap }) {
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const provider = new OpenStreetMapProvider();
	const mapRef = useRef(null);
	const debouncedQuery = useDebounce(query, 200);

	useEffect(() => {
		setLoading(true);
		provider
			.search({ query: debouncedQuery })
			.then((results) => {
				setSearchResults(results);
				setShowSearchResults(true);
				setLoading(false);
			})
			.catch((e) => {
				console.warn(e);
				setLoading(false);
			});
	}, [debouncedQuery]);

	const handleSearch = (e) => {
		setQuery(e.target.value);
	};

	const handleMarkerClick = (result) => {
		const { x, y } = result;
		mapRef.current.setView([y, x], 14);

		setShowSearchResults(false);
	};

	const handlePopupClose = () => {
		setSearchResults([]);
	};

	const resultsList = searchResults.map((result) => (
		<li
			key={result.x + result.y}
			onClick={() => handleMarkerClick(result)}
			className="border mb-2 py-2 px-4 rounded-sm shadow-sm text-sm cursor-pointer duration-300 ease-in-out hover:shadow-md"
		>
			{result.label}
		</li>
	));

	return (
		<div className="h-full w-full flex flex-col bg-white shadow-xl border rounded-3xl p-8">
			<div className="relative flex items-center w-full py-2">
				{/* search */}
				<input
					type="text"
					value={query}
					onChange={handleSearch}
					placeholder="Search a location"
					className="px-4 py-1.5 rounded-lg text-sm min-w-[100px] flex-1 border-2 border-gray-100 focus:!outline-none focus:!shadow-none focus:border-logo-red focus:ring-1 focus:ring-logo-red"
				/>

				<button
					type="button"
					className="ml-3 my-auto text-logo-red text-xl hover:opacity-60"
					onClick={() => setShowMap(false)}
				>
					<AiOutlineCloseCircle />
				</button>

				{/* results */}
				{showSearchResults === true &&
					(searchResults.length > 0 ? (
						<ul className="absolute top-full left-0 mt-1 z-[9999] w-full p-5 rounded-md bg-white shadow-md">
							{resultsList}
						</ul>
					) : (
						!!debouncedQuery && (
							<div className="absolute top-full left-0 mt-1 z-[9999] w-full p-5 rounded-md bg-white shadow-lg text-gray-500 font-bold text-lg">
								No location found
							</div>
						)
					))}
			</div>

			{/* Map */}
			<div className="flex-1 overflow-auto mt-5">
				<MapContainer
					center={[47.2868352, -120.212613]}
					zoom={9}
					touchZoom={true}
					scrollWheelZoom={true}
					style={{ height: "100%" }}
					ref={mapRef}
					attributionControl={false}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					{searchResults.map((result) => (
						<Marker
							key={result.x + result.y}
							position={[result.y, result.x]}
							icon={customIcon}
						>
							<Popup onClose={handlePopupClose}>
								<div>{result.label}</div>
								<div>Latitude: {result.y}</div>
								<div>Longitude: {result.x}</div>

								<button
									className="mt-2 ml-auto bg-logo-red text-white px-3 py-1 rounded-full hover:opacity-70 duration-200 ease-in-out border-0"
									onClick={() => {
										setCoordinates(result.x, result.y);
										setShowMap(false);
									}}
								>
									Select
								</button>
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>
		</div>
	);
}
