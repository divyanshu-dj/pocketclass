import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/solid";
import { DatePicker } from "antd";
import { categories as categoryData } from "../utils/categories";

const { RangePicker } = DatePicker;

const TeacherSearch = () => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [searchDistance, setSearchDistance] = useState("15");
  const [searchSortBy, setSearchSortBy] = useState("rating");
  const [dateRange, setDateRange] = useState(null);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const isPickerPanel = event.target.closest('.ant-picker-panel');
        if (isPickerPanel) {
          return; 
        }
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      distance: searchDistance,
      sortBy: searchSortBy,
    };
    
    if (dateRange) {
      searchParams.startDate = dateRange[0].toISOString();
      searchParams.endDate = dateRange[1].toISOString();
    }
    
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v != null)
    );
    
    router.push({
      pathname: `/browse/${searchCategory}/${searchSubCategory}`,
      query: filteredParams,
    });
    
    setShowSearch(false);
  };

  const handleDatePickerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleSearch}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition duration-150"
      >
        <SearchIcon className="h-5 w-5 text-gray-600" />
        <span className="text-gray-700">Find a Teacher</span>
      </button>

      {showSearch && (
        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-5 w-80 md:w-96 z-50">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <SearchIcon className="h-5 w-5 mr-2 text-logo-red" />
              Find a Teacher
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={searchCategory}
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                  setSearchSubCategory("");
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-logo-red focus:border-logo-red"
              >
                <option value="">Select a category</option>
                {categoryData.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            {searchCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Category
                </label>
                <select
                  value={searchSubCategory}
                  onChange={(e) => setSearchSubCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-logo-red focus:border-logo-red"
                >
                  <option value="">Select a sub-category</option>
                  {categoryData
                    .find(cat => cat.name === searchCategory)
                    ?.subCategories.map((subCat) => (
                      <option key={subCat.name} value={subCat.name}>
                        {subCat.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <select
                value={searchDistance}
                onChange={(e) => setSearchDistance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-logo-red focus:border-logo-red"
              >
                <option value="2">2 km</option>
                <option value="5">5 km</option>
                <option value="15">15 km</option>
                <option value="30">30 km</option>
                <option value="">Any distance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={searchSortBy}
                onChange={(e) => setSearchSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-logo-red focus:border-logo-red"
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="price">Price (Low to High)</option>
                <option value="distance">Distance (Nearest)</option>
              </select>
            </div>
            
            <div onClick={handleDatePickerClick}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Between
              </label>
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                className="w-full"
                disabledDate={(current) => current && current < Date.now()}
                getPopupContainer={(trigger) => trigger.parentNode}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-logo-red text-white rounded-md hover:bg-red-700 transition duration-150"
                disabled={!searchCategory || !searchSubCategory}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherSearch;
