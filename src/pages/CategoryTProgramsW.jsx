import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ViewPrograms.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { Button } from "@mui/material";

export default function CategoryTProgramsW() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📦 categoryId from URL:", categoryId);

    const fetchPrograms = async () => {
      try {
        const response = await fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/by-category/${categoryId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("🟢 Programs fetched:", data);
        setPrograms(data.items || []);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [categoryId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="programs-page">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: 8, fontWeight: 700 }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          LOGOUT
        </Button>
      </div>
      <h1 className="category-title">Training Programs</h1>

      {loading ? (
        <p>Loading programs...</p>
      ) : (
        <div className="programs-grid">
          {programs.length === 0 ? (
            <p>No training programs found for this category.</p>
          ) : (
            programs.map((prog, i) => (
              <div className="program-card" key={i}>
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
                    prog.approvalStatus === 0 ? "Pending" :
                    prog.approvalStatus === 1 ? "Approved" :
                    "Rejected"
                  }</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button className="back-btn" onClick={handleBack}>
        Back
      </button>
    </div>
  );
}
