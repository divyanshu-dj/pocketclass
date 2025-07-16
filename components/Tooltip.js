import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-md opacity-90 whitespace-nowrap">
          <div className="flex flex-col gap-1 items-center text-center">
            <span>{text}</span>
            {/* <span className="text-xs text-gray-300">Learn more</span> */}
          </div>
          {/* Downward pointing arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
