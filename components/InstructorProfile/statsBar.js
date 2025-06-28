const StatsBar = ({classLength, averageRating, totalStudentsTaught,totalReviews}) => {
    return (
        <div className="mt-6 flex justify-center overflow-x-auto px-4">
            <div className="flex w-full max-w-4xl rounded-xl border border-gray-200 bg-gray-50 text-center shadow-sm overflow-hidden flex-nowrap dm:flex-row flex-col">
                {/* Rating */}
                <div className="flex items-center justify-center flex-1 px-4 py-4 dm:border-r dm:border-b-0 border-b border-gray-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-black mr-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg font-bold">{averageRating || '0.0'}/5</div>
                        <div className="text-sm">{totalReviews || '0'} reviews</div>
                    </div>
                </div>

                {/* Classes */}
                <div className="flex items-center justify-center flex-1 px-4 py-4 dm:border-r dm:border-b-0 border-b border-gray-200">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 18C16.35 18 14.9375 17.4125 13.7625 16.2375C12.5875 15.0625 12 13.65 12 12C12 10.35 12.5875 8.9375 13.7625 7.7625C14.9375 6.5875 16.35 6 18 6C19.65 6 21.0625 6.5875 22.2375 7.7625C23.4125 8.9375 24 10.35 24 12C24 13.65 23.4125 15.0625 22.2375 16.2375C21.0625 17.4125 19.65 18 18 18ZM6 30V25.8C6 24.95 6.21875 24.1687 6.65625 23.4562C7.09375 22.7437 7.675 22.2 8.4 21.825C9.95 21.05 11.525 20.4688 13.125 20.0812C14.725 19.6937 16.35 19.5 18 19.5C19.65 19.5 21.275 19.6937 22.875 20.0812C24.475 20.4688 26.05 21.05 27.6 21.825C28.325 22.2 28.9062 22.7437 29.3438 23.4562C29.7812 24.1687 30 24.95 30 25.8V30H6ZM9 27H27V25.8C27 25.525 26.9312 25.275 26.7938 25.05C26.6562 24.825 26.475 24.65 26.25 24.525C24.9 23.85 23.5375 23.3438 22.1625 23.0063C20.7875 22.6688 19.4 22.5 18 22.5C16.6 22.5 15.2125 22.6688 13.8375 23.0063C12.4625 23.3438 11.1 23.85 9.75 24.525C9.525 24.65 9.34375 24.825 9.20625 25.05C9.06875 25.275 9 25.525 9 25.8V27ZM18 15C18.825 15 19.5313 14.7063 20.1188 14.1187C20.7063 13.5312 21 12.825 21 12C21 11.175 20.7063 10.4688 20.1188 9.88125C19.5313 9.29375 18.825 9 18 9C17.175 9 16.4688 9.29375 15.8813 9.88125C15.2937 10.4688 15 11.175 15 12C15 12.825 15.2937 13.5312 15.8813 14.1187C16.4688 14.7063 17.175 15 18 15Z" fill="#1D1B20" />
                    </svg>
                    <div className="flex flex-col items-center ml-6 justify-center">
                        <div className="text-lg font-bold">{classLength}</div>
                        <div className="text-sm">classes</div>
                    </div>
                </div>

                {/* Students */}
                <div className="flex items-center justify-center flex-1 px-4 py-4 dm:border-r dm:border-b-0 border-b border-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C10.35 12 8.9375 11.4125 7.7625 10.2375C6.5875 9.0625 6 7.65 6 6C6 4.35 6.5875 2.9375 7.7625 1.7625C8.9375 0.5875 10.35 0 12 0C13.65 0 15.0625 0.5875 16.2375 1.7625C17.4125 2.9375 18 4.35 18 6C18 7.65 17.4125 9.0625 16.2375 10.2375C15.0625 11.4125 13.65 12 12 12ZM0 24V19.8C0 18.95 0.21875 18.1687 0.65625 17.4562C1.09375 16.7437 1.675 16.2 2.4 15.825C3.95 15.05 5.525 14.4688 7.125 14.0812C8.725 13.6937 10.35 13.5 12 13.5C13.65 13.5 15.275 13.6937 16.875 14.0812C18.475 14.4688 20.05 15.05 21.6 15.825C22.325 16.2 22.9062 16.7437 23.3438 17.4562C23.7812 18.1687 24 18.95 24 19.8V24H0ZM3 21H21V19.8C21 19.525 20.9312 19.275 20.7938 19.05C20.6562 18.825 20.475 18.65 20.25 18.525C18.9 17.85 17.5375 17.3438 16.1625 17.0063C14.7875 16.6688 13.4 16.5 12 16.5C10.6 16.5 9.2125 16.6688 7.8375 17.0063C6.4625 17.3438 5.1 17.85 3.75 18.525C3.525 18.65 3.34375 18.825 3.20625 19.05C3.06875 19.275 3 19.525 3 19.8V21ZM12 9C12.825 9 13.5313 8.70625 14.1188 8.11875C14.7063 7.53125 15 6.825 15 6C15 5.175 14.7063 4.46875 14.1188 3.88125C13.5313 3.29375 12.825 3 12 3C11.175 3 10.4688 3.29375 9.88125 3.88125C9.29375 4.46875 9 5.175 9 6C9 6.825 9.29375 7.53125 9.88125 8.11875C10.4688 8.70625 11.175 9 12 9Z" fill="#1D1B20" />
                    </svg>
                    <div className="flex flex-col items-center ml-6 justify-center">
                        <div className="text-lg font-bold">{totalStudentsTaught}</div>
                        <div className="text-sm">students</div>
                    </div>
                </div>

                {/* Verified Instructor */}
                <div className="flex items-center justify-center flex-1 px-4 py-4">
                    <div className="relative w-6 h-6 mb-1">
                        {/* User icon */}
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_8_64)">
                                <path d="M20 26.25V23.75C20 22.4239 19.4732 21.1521 18.5355 20.2145C17.5979 19.2768 16.3261 18.75 15 18.75H6.25C4.92392 18.75 3.65215 19.2768 2.71447 20.2145C1.77678 21.1521 1.25 22.4239 1.25 23.75V26.25M21.25 13.75L23.75 16.25L28.75 11.25M15.625 8.75C15.625 11.5114 13.3864 13.75 10.625 13.75C7.86358 13.75 5.625 11.5114 5.625 8.75C5.625 5.98858 7.86358 3.75 10.625 3.75C13.3864 3.75 15.625 5.98858 15.625 8.75Z" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_8_64">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="text-lg flex flex-wrap font-bold ml-6">Verified Instructor</div>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
