import React from "react";
import { FaCheck, FaCheckCircle } from "react-icons/fa";

const StatusBadge = ({ type }) => {
  const isUpcoming = type === "upcoming";
  return (
    <p
      className={`inline-flex items-center gap-2 text-sm font-medium mt-3 px-3 py-1 rounded-full ${
        isUpcoming ? "bg-red-100 text-red-600" : "bg-green-600 text-white"
      }`}
    >
      {isUpcoming ? (
        <FaCheck className="text-red-600" />
      ) : (
        <FaCheckCircle className="text-white" />
      )}
      {isUpcoming ? "Confirmed" : "Completed"}
    </p>
  );
};

export default StatusBadge;
