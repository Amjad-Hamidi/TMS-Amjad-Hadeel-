"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaUser,
  FaBook,
  FaUsers,
  FaComments,
  FaStar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const navLinks = [
  { label: "Dashboard", icon: <FaUser />, path: "/student/dashboard" },
  { label: "Courses", icon: <FaBook />, path: "/student/courses" },
  { label: "Students", icon: <FaUsers />, path: "/student/students" },
  { label: "Discussions", icon: <FaComments />, path: "/student/discussions" },
  { label: "Reviews", icon: <FaStar />, path: "/student/reviews" },
  { label: "My Settings", icon: <FaCog />, path: "/student/settings" },
];

const DashboardSidebar = () => {
  const router = useRouter();
  const { state } = useAuth();
  const user = state?.user;

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user) return null;

  return (
    <aside className="w-64 bg-white p-6 shadow-md min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              user.googlePhotoUrl ||
              "https://randomuser.me/api/portraits/lego/1.jpg"
            }
            alt="User Avatar"
            className="w-20 h-20 rounded-full mb-2"
          />
          <h2 className="font-semibold capitalize">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>

        <nav className="space-y-4">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => router.push(link.path)}
              className="w-full flex items-center px-4 py-2 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-10">
        <button
          className="w-full flex items-center justify-center text-gray-500 hover:text-red-500 text-sm"
          onClick={() => alert("Logging out...")}
        >
          <FaSignOutAlt className="mr-2" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
