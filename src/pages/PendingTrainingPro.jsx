import React, { useEffect, useState } from "react";
import "../styles/CTraineePrograms.css";

export default function PendingTrainingPro() {
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/all-pending";
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      setError("Authorization token not found");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    fetch(`${baseUrl}?page=1&limit=10`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = data.items || [];
        // نضبط كل برنامج ليكون له status "Pending"
        const pendingPrograms = items.map((p) => ({
          ...p,
          status: "Pending",
        }));
        setPrograms(pendingPrograms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load pending programs.");
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="prog-wrap">
      <h2>Pending Training Programs</h2>

      <div className="grid">
        {programs.length === 0 && <p>No pending programs found.</p>}
        {programs.map((p) => (
          <div key={p.trainingProgramId} className={`card ${p.status.toLowerCase()}`}>
            <div className="badge">{p.status}</div>
            {p.imagePath && <img src={p.imagePath} alt={p.title} className="prog-img" />}
            <h3>{p.title}</h3>
            <span className="company">{p.companyName || "No Company Name"}</span>
            <ul className="meta">
              <li><strong>ID:</strong> {p.trainingProgramId}</li>
              {p.categoryName && <li><strong>Category:</strong> {p.categoryName}</li>}
              {p.supervisorName && <li><strong>Supervisor:</strong> {p.supervisorName}</li>}
              {p.durationInDays && <li><strong>Duration (days):</strong> {p.durationInDays}</li>}
              {p.duration && <li><strong>Duration:</strong> {p.duration}</li>}
              {p.startDate && (
                <li><strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</li>
              )}
              {p.endDate && (
                <li><strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</li>
              )}
              {p.rejectionReason && (
                <li><strong>Rejection Reason:</strong> {p.rejectionReason}</li>
              )}
            </ul>

            <button
              className="apply"
              onClick={() => setExpanded(expanded === p.trainingProgramId ? null : p.trainingProgramId)}
            >
              {expanded === p.trainingProgramId ? "Hide" : "Show"}
            </button>

            {expanded === p.trainingProgramId && (
              <div>
                {p.description && <p><strong>Description:</strong> {p.description}</p>}
                {p.contentUrl && (
                  <p><a href={p.contentUrl} target="_blank" rel="noreferrer">عرض المحتوى</a></p>
                )}
                {p.classroomUrl && (
                  <p><a href={p.classroomUrl} target="_blank" rel="noreferrer">رابط الفصل</a></p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
