// src/pages/TraineePrograms.jsx
import React, { useState } from "react";
import "../styles/TraineePrograms.css";

const dummyPrograms = [
  {
    id: 1,
    title: "Full‑Stack Bootcamp",
    description: "Intensive MERN track.",
    duration: "3 months",
    start: "2025‑05‑01",
    end: "2025‑08‑01",
    location: "Amman",
    status: "Ongoing",
    contentUrl: "https://docs.techcorp.com/bootcamp",
    classroomUrl: "https://classroom.google.com/bootcamp",
    supervisor: "Eng. Lina Qasem",
    category: "Web Development"
  },
  {
    id: 2,
    title: "Data Analysis Basics",
    description: "Excel, Python & Tableau.",
    duration: "6 weeks",
    start: "2025‑04‑15",
    end: "2025‑05‑30",
    location: "Remote",
    status: "Completed",
    contentUrl: "https://drive.dataspark.com/analysis",
    classroomUrl: "https://teams.microsoft.com/dataspark",
    supervisor: "Dr. Omar Abu Saif",
    category: "Data Science"
  }
];

export default function TraineePrograms() {
  const [programs] = useState(dummyPrograms); // لاحقاً fetch API

  return (
    <div className="prog-wrap">
      <h2>My Training Programs</h2>

      <div className="grid">
        {programs.map(p => (
          <div key={p.id} className={`card ${p.status.toLowerCase()}`}>
            <div className="badge">{p.status}</div>

            <h3>{p.title}</h3>
            <p className="desc">{p.description}</p>

            <ul className="meta">
              <li><strong>Supervisor:</strong> {p.supervisor}</li>
              <li><strong>Category:</strong> {p.category}</li>
              <li><strong>Duration:</strong> {p.duration}</li>
              <li><strong>Start:</strong> {p.start}</li>
              <li><strong>End:</strong> {p.end}</li>
              <li><strong>Location:</strong> {p.location}</li>
            </ul>

            <div className="links">
              <a href={p.contentUrl} target="_blank" rel="noreferrer">📚 Content</a>
              <a href={p.classroomUrl} target="_blank" rel="noreferrer">🏫 Classroom</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
