import DashboardSidebar from "@/components/DashboardSidebar";
import CourseProgressSection from "@/components/CourseProgressSection";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-grow p-8">
        <CourseProgressSection />
      </main>
    </div>
  );
}
