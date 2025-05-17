// src/pages/TraineeApplications.jsx
import React, { useState } from "react";
import "../styles/TraineeApplications.css";

const dummyApps = [
  {
    id: 1,
    program: "Full‑Stack Bootcamp",
    description: "Intensive web development track.",
    duration: "3 months",
    start: "2025‑05‑01",
    end: "2025‑08‑01",
    location: "Amman",
    submitted: "2025‑03‑20",
    status: "Pending",
    response: "Application under review",
    supervisor: "Eng. Lina Khaled",
    category: "Web Development"
  },
  {
    id: 2,
    program: "Data Analysis Basics",
    description: "Excel, Python & Tableau fundamentals.",
    duration: "6 weeks",
    start: "2025‑04‑15",
    end: "2025‑05‑30",
    location: "Remote",
    submitted: "2025‑02‑28",
    status: "Accepted",
    response: "Welcome aboard! see you on 15 Apr.",
    supervisor: "Dr. Mahmoud Awad",
    category: "Data Analysis"
  },
  {
    id: 3,
    program: "React Frontend Mastery",
    description: "Advanced React & TypeScript.",
    duration: "2 months",
    start: "2025‑06‑10",
    end: "2025‑08‑10",
    location: "Nablus",
    submitted: "2025‑03‑01",
    status: "Rejected",
    response: "Seats full, try next cohort.",
    supervisor: "Eng. Huda Omar",
    category: "Frontend"
  }
];

export default function TraineeApplications() {
  const [apps] = useState(dummyApps);
  const [filter, setFilter] = useState("All");

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

      <div className="cards-grid">
        {shown.map(app => (
          <div key={app.id} className={`app-card ${app.status.toLowerCase()}`}>
            <div className="badge">
              {app.status === "Accepted" ? "✅" : app.status === "Rejected" ? "❌" : "⏳"}
            </div>

            <h3>{app.program}</h3>
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
    </div>
  );
}
