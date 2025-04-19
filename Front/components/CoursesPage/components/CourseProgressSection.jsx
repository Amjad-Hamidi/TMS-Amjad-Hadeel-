"use client";

import CourseProgressRing from "./CourseProgressRing";

const courseProgressData = [
  {
    title: "HTML5 Design",
    videos: 140,
    progress: 50,
    color: "#f87171",
    bgColor: "bg-rose-50",
  },
  {
    title: "UI/UX Design",
    videos: 847,
    progress: 68,
    color: "#6366f1",
    bgColor: "bg-indigo-100",
  },
  {
    title: "Copywriting",
    videos: 21,
    progress: 25,
    color: "#3b82f6",
    bgColor: "bg-blue-100",
  },
  {
    title: "Mobile Apps",
    videos: 535,
    progress: 32,
    color: "#30DF70",
    bgColor: "bg-green-100",
  },
];

const CourseProgressSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-6">Course Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courseProgressData.map((course, index) => (
          <div
            key={index}
            className={`w-[240px] h-[240px] flex items-center justify-center rounded-2xl p-4 shadow-md ${course.bgColor}`}
          >
            <CourseProgressRing
              title={course.title}
              videos={course.videos}
              progress={course.progress}
              color={course.color}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseProgressSection;
