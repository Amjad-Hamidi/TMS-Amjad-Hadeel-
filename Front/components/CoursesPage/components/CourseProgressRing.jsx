"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CourseProgressRing = ({ title, progress, videos, color }) => {
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm w-48">
      <div className="w-20 h-20 mb-3">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#333",
            trailColor: "#f0f0f0",
          })}
        />
      </div>
      <h3 className="text-sm font-semibold text-center">{title}</h3>
      <p className="text-xs text-gray-500">{videos} videos</p>
    </div>
  );
};

export default CourseProgressRing;
