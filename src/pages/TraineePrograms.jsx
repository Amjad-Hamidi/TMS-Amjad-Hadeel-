// src/pages/TraineePrograms.jsx
import React, { useEffect, useState } from "react";
import "../styles/TraineePrograms.css";

export default function TraineePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found.");

        const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/my-enrollments", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const text = await response.text();
        console.log("Response text:", text);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = JSON.parse(text);

        const formattedPrograms = data.items.map(p => ({
          id: p.trainingProgramId,
          title: p.title,
          category: p.categoryName,
          start: p.startDate?.split("T")[0] || "",
          end: p.endDate?.split("T")[0] || "",
          status: p.status === 1 ? "Ongoing" : "Completed",
          description: p.description || "No description provided.",
          duration: p.durationInDays ? `${p.durationInDays} days` : "N/A",
          location: p.location || "TBD",
          contentUrl: p.contentUrl || "#",
          classroomUrl: p.classroomUrl || "#",
          supervisor: p.supervisorName || "N/A"
        }));

        setPrograms(formattedPrograms);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="prog-wrap">
      <h2>My Training Programs</h2>

      <div className="grid">
        {programs.map(p => (
          <div key={p.id} className={`card ${p.status.toLowerCase()}`}>
            <div className="badge">{p.status}</div>

            <h3>#{p.id} - {p.title}</h3>
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
