import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { SiOpenstreetmap } from "react-icons/si";
import { AiOutlineCloseCircle, AiOutlineLoading } from "react-icons/ai";

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

	const handleSearch = (e) => {
		e.preventDefault();
		setLoading(true);
		provider
			.search({ query })
			.then((results) => {
				setSearchResults(results);
				setShowSearchResults(true);
				setLoading(false);
			})
			.catch((e) => {
				console.warn(e);
				setLoading(false);
			});
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
			className="border mb-2 py-2 px-4 rounded-md shadow-sm text-sm cursor-pointer duration-300 ease-in-out hover:shadow-md"
		>
			{result.label}
		</li>
	));

	return (
		<div className="h-full w-full p-4 flex flex-col">
			{/* Top */}
			<div className="bg-white px-5 py-4 rounded-md shadow-sm relative">
				<div className="flex items-center mb-4">
					{/* heading */}
					<div className="h-7 rounded flex items-center justify-center aspect-square bg-bg1 text-main text-lg mr-2">
						<SiOpenstreetmap />
					</div>
					<h1 className="text-darker">Get Location Data From Map</h1>

					{/* close */}
					<button
						className="ml-auto text-logo-red text-xl hover:opacity-60"
						onClick={() => setShowMap(false)}
					>
						<AiOutlineCloseCircle />
					</button>
				</div>

				{/* search */}
				<form onSubmit={handleSearch} className="flex py-2">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search a location"
						className="px-4 py-1.5 rounded-full text-sm w-[50%] min-w-[250px] border focus:outline-none"
					/>
					<button
						type="submit"
						className="duration-200 text-sm bg-logo-red text-white px-4 ml-2 rounded-full  disabled:opacity-90"
						disabled={loading}
					>
						{loading ? <AiOutlineLoading className="animate-spin" /> : "Search"}
					</button>
				</form>

				{/* results */}
				{showSearchResults === true &&
					(searchResults.length > 0 ? (
						<ul className="absolute top-full left-0 mt-1 z-[9999] w-full p-5 rounded-md bg-white shadow-md">
							{resultsList}
						</ul>
					) : (
						<div className="absolute top-full left-0 mt-1 z-[9999] w-full p-5 rounded-md bg-white shadow-lg text-gray-500 font-bold text-lg">
							No location found
						</div>
					))}
			</div>

			{/* Map */}
			<div className="bg-white p-5 rounded-md shadow-sm flex-1 overflow-auto mt-5">
				<MapContainer
					center={[33.6938118, 73.0651511]}
					zoom={13}
					touchZoom={false}
					scrollWheelZoom={false}
					style={{ height: "100%" }}
					ref={mapRef}
					// whenCreated={(mapInstance) => {
					// 	mapRef.current = mapInstance;
					// }}
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
