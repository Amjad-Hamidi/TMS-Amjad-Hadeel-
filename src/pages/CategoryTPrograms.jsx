import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ViewPrograms.css";
import ApplyModal from "./ApplyModal"; // استيراد المودال

export default function CategoryTPrograms() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null); // لمودال التقديم

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/by-category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setPrograms(data.items || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [categoryId]);

  const handleApplySuccess = (programId) => {
    // بعد النجاح يمكنك تحديث واجهة المستخدم أو عرض إشعار
    console.log(`Applied to program ${programId}`);
  };

  return (
    <div className="programs-page">
      <h1 className="category-title">Training Programs</h1>

      {loading ? (
        <p>Loading programs...</p>
      ) : programs.length === 0 ? (
        <p>No training programs found.</p>
      ) : (
        <div className="programs-grid">
          {programs.map((prog) => (
            <div className="program-card" key={prog.id}>
              <img src={prog.imagePath} alt={prog.title} />
              <div className="info">
                <h2>{prog.title}</h2>
                <p><strong>Start:</strong> {prog.startDate?.slice(0, 10)}</p>
                <p><strong>End:</strong> {prog.endDate?.slice(0, 10)}</p>
                <p><strong>Location:</strong> {prog.location}</p>
                <p><strong>Status:</strong> {prog.status ? "Open" : "Closed"}</p>
                <p><strong>Company:</strong> {prog.companyName}</p>
                <p><strong>Supervisor:</strong> {prog.supervisorName}</p>
                <p><strong>Rating:</strong> ⭐ {prog.rating}</p>
                <p><strong>Seats:</strong> {prog.seatsAvailable}</p>
                <p><strong>Approval:</strong> {
                  prog.approvalStatus === 0 ? "Pending"
                  : prog.approvalStatus === 1 ? "Approved"
                  : "Rejected"
                }</p>

                <button
                  disabled={!prog.status || prog.seatsAvailable === 0}
                  onClick={() => setSelectedProgram(prog)}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      {/* Show modal if program selected */}
      {selectedProgram && (
        <ApplyModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onApplySuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}
