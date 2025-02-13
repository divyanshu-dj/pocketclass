import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { categories } from "../utils/categories";
import NewHeader from "../components/NewHeader";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  doc as firestoreDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Select from "react-select";

mapboxgl.accessToken = process.env.mapbox_key;

export default function Results() {
  const router = useRouter();
  const { subCategory, category } = router.query;
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    subCategory || ""
  );
  const [sortBy, setSortBy] = useState("");
  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [activeView, setActiveView] = useState("classes");

  // MapBox Initialization
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 9,
    });
  }, []);

  // Add Markers for Classes
  useEffect(() => {
    if (!map.current || !filteredClasses.length) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.marker.remove());
    markers.current = [];

    // Determine map bounds
    const bounds = new mapboxgl.LngLatBounds();

    filteredClasses.forEach((classItem) => {
      if (classItem.longitude && classItem.latitude) {
        const marker = new mapboxgl.Marker()
          .setLngLat([classItem.longitude, classItem.latitude])
          .addTo(map.current);

        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="text-lg font-bold">${classItem.Name}</h3>
            <p class="text-sm text-gray-600">${
              classItem.Address || "No Address"
            }</p>
            <p class="text-sm text-blue-600">${classItem.Category} | ${
          classItem.SubCategory || classItem.Type || "N/A"
        }</p>
            <p class="text-sm text-yellow-500">⭐ ${
              classItem.averageRating
                ? classItem.averageRating.toFixed(1)
                : "N/A"
            } (${classItem.reviewCount || 0}+ reviews)</p>
            <p class="text-sm text-logo-red">Price: $${classItem.Price}</p>
          </div>
        `);

        marker.setPopup(popup);

        marker.getElement().addEventListener("click", () => {
          setSelectedClassDetails(classItem);
        });

        markers.current.push({ marker, classId: classItem.id });
        bounds.extend([classItem.longitude, classItem.latitude]);
      }
    });

    // Zoom to user location if available
    if (location) {
      map.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 12,
      });
    }
    // Fit map to markers if any exist
    else if (markers.current.length) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    }
  }, [filteredClasses]);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      const { geolocation } = navigator;
      if (!geolocation) {
        return;
      }
      const position = await new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(resolve, reject);
      });
      if (!position.coords) {
        return;
      }
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    })();
  }, []);
  const distanceCalculator = (lat1, lon1, lat2, lon2) => {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const R = 6371;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  useEffect(() => {
    const options = categories
      .find((cat) => cat.name === selectedCategory)
      ?.subCategories.map((sub) => ({
        value: sub.name,
        label: sub.name,
      }));
    setSubCategoryOptions(options || []);
  }, [selectedCategory]);

  const distanceOptions = [
    { value: "1", label: "1 km" },
    { value: "2", label: "2 km" },
    { value: "5", label: "5 km" },
    { value: "10", label: "10 km" },
    { value: "15", label: "15 km" },
    { value: "20", label: "20 km" },
  ];
  const [selectedDistance, setSelectedDistance] = useState(
    distanceOptions[5].value
  );

  const sortOptions = [
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "distance", label: "Distance" },
  ];

  useEffect(() => {
    const fetchClassesAndInstructors = async () => {
      setLoading(true);
      try {
        const classesQuery = query(collection(db, "classes"));
        const classesSnapshot = await getDocs(classesQuery);
        const classesWithInstructors = await Promise.all(
          classesSnapshot.docs.map(async (doc) => {
            const classData = { id: doc.id, ...doc.data() };

            if (classData.classCreator) {
              const instructorRef = firestoreDoc(
                db,
                "Users",
                classData.classCreator
              );
              const instructorDoc = await getDoc(instructorRef);
              if (instructorDoc.exists()) {
                classData.instructorName = instructorDoc.data().firstName
                  ? instructorDoc.data().firstName +
                    " " +
                    instructorDoc.data().lastName
                  : "N/A";
              }
            }

            const classReviews = reviews.filter(
              (rev) => rev.classID === classData.id
            );
            const avgRating =
              classReviews.length > 0
                ? classReviews.reduce(
                    (acc, rev) =>
                      acc +
                      (rev.qualityRating +
                        rev.recommendRating +
                        rev.safetyRating) /
                        3,
                    0
                  ) / classReviews.length
                : 0;

            classData.averageRating = avgRating;
            classData.reviewCount = classReviews.length;
            return classData;
          })
        );

        setClasses(classesWithInstructors);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndInstructors();
  }, [reviews]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Reviews"), (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...classes];
    console.log(classes);

    if (selectedCategory) {
      filtered = filtered.filter((data) => data.Category === selectedCategory);
    }
    if (selectedSubCategory) {
      filtered = filtered.filter(
        (data) =>
          data.SubCategory === selectedSubCategory ||
          data.Type === selectedSubCategory
      );
    }
    if (selectedDistance) {
      if (location) {
        filtered = filtered.filter((data) => {
          const distance = distanceCalculator(
            location.latitude,
            location.longitude,
            data.latitude,
            data.longitude
          );
          return (
            distance <= Number(selectedDistance) ||
            data.Mode === "Online" ||
            data.Address === "Online"
          );
        });
      }
    }
    if (sortBy === "rating") {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "price") {
      filtered.sort((a, b) => a.Price - b.Price);
    } else if (sortBy === "distance" && location) {
      if (location) {
        filtered.sort((a, b) => {
          const distanceA = distanceCalculator(
            location.latitude,
            location.longitude,
            a.latitude,
            a.longitude
          );
          const distanceB = distanceCalculator(
            location.latitude,
            location.longitude,
            b.latitude,
            b.longitude
          );
          return distanceA - distanceB;
        });
      }
    }

    setFilteredClasses(filtered);
  }, [
    selectedCategory,
    selectedSubCategory,
    sortBy,
    classes,
    selectedDistance,
    location,
  ]);

  return (
    <div className="overflow-hidden h-screen">
      <NewHeader />
      <div className="flex flex-col md:flex-row overflow-hidden h-full">
        {/* Mobile view toggle for small screens */}
        <div className="md:hidden flex justify-center my-2">
          <div className="inline-flex bg-gray-200 rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 
                ${
                  activeView === "classes"
                    ? "bg-logo-red text-white"
                    : "text-gray-700"
                }`}
              onClick={() => setActiveView("classes")}
            >
              Classes
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 
                ${
                  activeView === "map"
                    ? "bg-logo-red text-white"
                    : "text-gray-700"
                }`}
              onClick={() => setActiveView("map")}
            >
              Map
            </button>
          </div>
        </div>

        {/* Classes section - visible on mobile when "classes" view is active, always visible on larger screens */}
        <div
          className={`
          w-full md:w-1/2 overflow-hidden h-full 
          ${activeView === "classes" || "hidden md:block"}
        `}
        >
          <div className="flex flex-wrap gap-4 mb-6 mt-2 px-4">
            <Select
              options={categoryOptions}
              placeholder="Category"
              className="w-full md:w-40 rounded-lg"
              value={
                categoryOptions.find(
                  (option) => option.value === selectedCategory
                ) || null
              }
              onChange={(option) => {
                setSelectedCategory(option ? option.value : "");
                setSelectedSubCategory("");
              }}
            />
            <Select
              options={subCategoryOptions}
              placeholder="Sub-category"
              className="w-full md:w-40 rounded-lg"
              value={
                subCategoryOptions.find(
                  (option) => option.value === selectedSubCategory
                ) || null
              }
              onChange={(option) =>
                setSelectedSubCategory(option ? option.value : "")
              }
            />
            <Select
              options={distanceOptions}
              placeholder="Distance"
              className="w-full md:w-40 rounded-lg"
              value={selectedDistance.value}
              onChange={(option) =>
                setSelectedDistance(option ? option.value : "")
              }
            />
            <Select
              options={sortOptions}
              placeholder="Sort By"
              className="w-full md:w-40 rounded-lg"
              value={
                sortOptions.find((option) => option.value === sortBy) || null
              }
              onChange={(option) => setSortBy(option ? option.value : "")}
            />
          </div>

          <div className="p-4 overflow-auto h-full max-h-full">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`flex items-center cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 border-2 border-gray-100 hover:border-logo-red ${
                      selectedClassDetails?.id === classItem.id
                        ? "border-logo-red"
                        : ""
                    }`}
                    onMouseEnter={() => {
                      if (
                        !(
                          classItem.Mode === "Online" ||
                          classItem.Address === "Online"
                        ) &&
                        classItem.longitude &&
                        classItem.latitude
                      ) {
                        map.current.flyTo({
                          center: [classItem.longitude, classItem.latitude],
                          zoom: 12,
                        });
                        markers.current
                          .find((marker) => {
                            const { lng, lat } = marker.marker.getLngLat();
                            return (
                              lng === classItem.longitude &&
                              lat === classItem.latitude
                            );
                          })
                          ?.marker.getElement()
                          .querySelectorAll('svg [fill="' + "#3FB1CE" + '"]')[0]
                          ?.setAttribute("fill", "red");
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        !(
                          classItem.Mode === "Online" ||
                          classItem.Address === "Online"
                        ) &&
                        classItem.longitude &&
                        classItem.latitude
                      ) {
                        markers.current
                          .find((marker) => {
                            const { lng, lat } = marker.marker.getLngLat();
                            return (
                              lng === classItem.longitude &&
                              lat === classItem.latitude
                            );
                          })
                          ?.marker.getElement()
                          .querySelectorAll('svg [fill="' + "red" + '"]')[0]
                          ?.setAttribute("fill", "#3FB1CE");
                      }
                    }}
                    onClick={() => {
                      router.push(`/classes/id=${classItem.id}`);
                      setSelectedClassDetails(classItem);
                    }}
                  >
                    <img
                      src={classItem.Images[0] || "/default-image.jpg"}
                      alt={classItem.Name}
                      className="w-32 h-32 object-cover rounded-xl ml-2"
                    />
                    <div className="p-4 flex flex-grow flex-col justify-between">
                      <h3 className="text-lg font-semibold flex flex-row justify-between items-center text-gray-900">
                        <p>{classItem.Name}</p>
                        <p className="text-logo-red">${classItem.Price}</p>
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {classItem.Category} |{" "}
                        {classItem.SubCategory || classItem.Type || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {classItem.Address || "No Address Available"}
                      </p>
                      <p className="text-yellow-500 text-sm">
                        ⭐ {classItem.averageRating.toFixed(1)} (
                        {classItem.reviewCount}+ reviews)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map section - visible on mobile when "map" view is active, always visible on larger screens */}
        <div
          className={`
          w-full md:w-1/2 p-4 relative h-full 
          ${activeView === "map" || "hidden md:block"}
        `}
        >
          <div
            ref={mapContainer}
            className="h-[90%] min-h-[600px] w-full rounded-xl bg-gray-200"
          />
          {selectedClassDetails && (
            <div
              key={selectedClassDetails.id}
              onClick={() => {
                router.push(`/classes/id=${selectedClassDetails.id}`);
              }}
              className={`flex cursor-pointer items-center z-50 absolute bottom-24 box-border left-4 right-4 bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 border-2 border-gray-100 hover:border-logo-red`}
            >
              <img
                src={selectedClassDetails.Images[0] || "/default-image.jpg"}
                alt={selectedClassDetails.Name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="p-4 flex flex-grow flex-col justify-between">
                <h3 className="text-lg font-semibold flex flex-row justify-between items-center text-gray-900">
                  <p>{selectedClassDetails.Name}</p>
                  <p className="text-logo-red">${selectedClassDetails.Price}</p>
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {selectedClassDetails.Category} |{" "}
                  {selectedClassDetails.SubCategory ||
                    selectedClassDetails.Type ||
                    "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedClassDetails.Address || "No Address Available"}
                </p>
                <p className="text-yellow-500 text-sm">
                  ⭐ {selectedClassDetails.averageRating.toFixed(1)} (
                  {selectedClassDetails.reviewCount}+ reviews)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
