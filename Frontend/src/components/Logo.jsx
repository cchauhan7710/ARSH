import React from "react";

export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"
        className="fill-blue-600 dark:fill-blue-400"
        fillOpacity="0.8"
      />
      <path
        d="M12 18V6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        className="stroke-blue-200 dark:stroke-blue-800"
        strokeWidth="1.5"
      />
      <path
        d="M9 12H15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
