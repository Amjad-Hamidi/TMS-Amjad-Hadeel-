"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import DashboardSidebar from "@/components/CoursesPage/components/DashboardSidebar";
import CourseProgressSection from "@/components/CoursesPage/components/CourseProgressSection";

export default function StudentDashboard() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.user) {
      router.push("/user/signin");
    }
  }, [state.user, router]);

  if (!state.user) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-bold mb-4">
          Welcome back, {state.user.username}
        </h1>
        <CourseProgressSection />
      </main>
    </div>
  );
}
