// src/pages/TraineeApplications.jsx
import React, { useState, useEffect } from "react";
import "../styles/TraineeApplications.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const statusMap = {
  0: "Pending",
  1: "Accepted",
  2: "Rejected"
};

export default function TraineeApplications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/my-enrollments");
        const text = await res.text();
        const data = JSON.parse(text);

        const appsFormatted = data.items.map(app => ({
          id: app.trainingProgramId,
          program: app.title,
          description: app.description || "No description.",
          duration: app.durationInDays ? `${app.durationInDays} days` : "N/A",
          start: app.startDate?.split("T")[0] || "N/A",
          end: app.endDate?.split("T")[0] || "N/A",
          location: app.location || "TBD",
          submitted: "—", // If your API supports it later, replace here.
          status: statusMap[app.status] || "Pending",
          response: app.status === 1
            ? "You've been accepted! See you soon 🎉"
            : app.status === 2
            ? "Unfortunately, your application was rejected."
            : "Application under review.",
          supervisor: app.supervisorName || "N/A",
          category: app.categoryName || "General"
        }));

        setApps(appsFormatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const shown = filter === "All" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="apps-wrap">
      <h2>My Applications</h2>

      <div className="filter-row">
        {["All", "Pending", "Accepted", "Rejected"].map(st => (
          <button
            key={st}
            className={filter === st ? "active" : ""}
            onClick={() => setFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="cards-grid">
          {shown.map(app => (
            <div key={app.id} className={`app-card ${app.status.toLowerCase()}`}>
              <div className="badge">
                {app.status === "Accepted"
                  ? "✅"
                  : app.status === "Rejected"
                  ? "❌"
                  : "⏳"}
              </div>

              <h3>#{app.id} - {app.program}</h3>
              <p className="desc">{app.description}</p>

              <div className="info-row">
                <span>{app.duration}</span>
                <span>{app.location}</span>
              </div>

              <ul className="meta">
                <li><strong>Category:</strong> {app.category}</li>
                <li><strong>Supervisor:</strong> {app.supervisor}</li>
                <li><strong>Start:</strong> {app.start}</li>
                <li><strong>End:</strong> {app.end}</li>
                <li><strong>Submitted:</strong> {app.submitted}</li>
              </ul>

              <p className="response">{app.response}</p>

              {app.status === "Rejected" && (
                <button className="browse-btn">Browse Similar Programs</button>
              )}
            </div>
          ))}

          {shown.length === 0 && <p className="empty">No applications here.</p>}
        </div>
      )}
    </div>
  );
}
