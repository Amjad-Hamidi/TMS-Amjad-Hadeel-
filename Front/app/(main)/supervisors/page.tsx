"use client";
import { useState, useEffect } from "react";
import GlobalLoadingPage from "@/app/loading";
import SupervisorCard from "@/components/SupervisorCard.tsx";
import useFetch from "@/app/hooks/useFetch";
import { ISupervisor } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import PaginationControls from "@/components/CoursesPage/components/PaginationControls";
import PopupModal from "@/components/PopupModal";
import { useAuth } from "@/context/AuthContext";
import ReactStars from "react-stars";

const SupervisorPage = () => {
  const { state } = useAuth();
  const { data, loading } = useFetch("user/supervisors");
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const handleTogglePopUp = () => setIsOpenPopUp(true);
  const [rating, setRating] = useState(0);
  const [SupervisorId,setSupervisorId]=useState('')
 const handlechangeSupervisorId=(newId:string)=>setSupervisorId(newId)

  const handleSendFeedBack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const feedback = formData.get("feedback") as string;

    fetch('/api/user/feedbacks', {
      method: 'POST',
      body: JSON.stringify({
        name: state.user?.username,
        supervisorId:SupervisorId|| '67f52350fa72e007e191ae0f',
        feedback,
        rating
      }),
      headers: {
        'Authorization': `Bearer ${state.token}`, // Use Bearer token in Authorization header
        'Content-Type': 'application/json',
      }
    }).then(res => {
      setIsOpenPopUp(false)
    });
  };

  const itemsPerPage = 3;

  // Total pages based on the length of data
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Slice the data to show only items of the current page
  const paginatedData = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top when changing pages
    document.getElementById("courses-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen p-6 w-full">
      <h2 className="text-xl font-bold text-center mb-6">My Supervisors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading ? (
          <GlobalLoadingPage />
        ) : (
          paginatedData?.map((supervisor: ISupervisor) => (
            <SupervisorCard key={supervisor.id} {...supervisor} handleTogglePopUp={handleTogglePopUp} handlechangeSupervisorId={handlechangeSupervisorId} />
          ))
        )}
        <PopupModal onClose={() => { setIsOpenPopUp(false) }} isOpen={isOpenPopUp} children={<>
          <h2 className="text-xl font-semibold mb-4 text-center ">We value your feedback 💬</h2>
          <form onSubmit={handleSendFeedBack}>
            <ReactStars size={24} onChange={(value) => setRating(Number(value))} />
            <textarea name='feedback'
              placeholder="Write your feedback..."
              className="w-full text-black h-28 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-4 py-2 rounded-xl hover:bg-blue-700 transition "
            >
              give feedback
            </button>
          </form>          </>} />
      </div>

      {/* Pagination */}
      {!loading && data?.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          theme={theme}
        />
      )}
    </div>
  );
};

export default SupervisorPage;
