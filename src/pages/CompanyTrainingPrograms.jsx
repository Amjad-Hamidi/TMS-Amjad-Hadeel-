import React, { useState, useEffect } from "react";
import "../styles/CTraineePrograms.css";

export default function SupervisorPrograms() {
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms";
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

    Promise.all([
      fetch(`${baseUrl}/my-approved`, { headers }).then((res) => res.json()),
      fetch(`${baseUrl}/my-rejected`, { headers }).then((res) => res.json()),
      fetch(`${baseUrl}/my-pending`, { headers }).then((res) => res.json()),
    ])
      .then(([approved, rejected, pending]) => {
        const approvedPrograms = (approved.items || []).map((p) => ({
          ...p,
          status: "Approved",
        }));

        const rejectedPrograms = (rejected.items || []).map((p) => ({
          ...p,
          status: "Rejected",
        }));

        const pendingPrograms = (pending.items || []).map((p) => ({
          ...p,
          status: "Pending",
        }));

        setPrograms([
          ...approvedPrograms,
          ...rejectedPrograms,
          ...pendingPrograms,
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load programs.");
        setLoading(false);
      });
  }, []);

  const filtered =
    filterStatus === "All"
      ? programs
      : programs.filter(
          (p) => (p.status ?? "").toLowerCase() === filterStatus.toLowerCase()
        );

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="prog-wrap">
      <h2>My Training Programs</h2>

      <div className="status-filters">
        {["All", "Approved", "Rejected", "Pending"].map((stat) => (
          <button
            key={stat}
            className={filterStatus === stat ? "active" : ""}
            onClick={() => setFilterStatus(stat)}
          >
            {stat}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.length === 0 && <p>No programs found for "{filterStatus}".</p>}
        {filtered.map((p) => (
          <div key={p.trainingProgramId} className={`card ${p.status.toLowerCase()}`}>
            <div className="badge">{p.status}</div>
            {p.imagePath && <img src={p.imagePath} alt={p.title} className="prog-img" />}
            <h3>{p.title}</h3>
            <span className="company">{p.companyName || "No Company Name"}</span>
            <ul className="meta">
              <li><strong>ID:</strong> {p.trainingProgramId}</li>
              {p.categoryName && <li><strong>Category:</strong> {p.categoryName}</li>}
              {p.supervisorName && <li><strong>Supervisor:</strong> {p.supervisorName}</li>}
              {p.durationInDays && <li><strong>Duration:</strong> {p.durationInDays}</li>}
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
              Show
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
