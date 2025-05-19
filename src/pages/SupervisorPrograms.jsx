import React, { useEffect, useState } from "react";
import "../styles/SupervisorPrograms.css";

export default function SupervisorPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // or get it from context/store

        const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/my-supervised", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setPrograms(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p>Error loading programs: {error}</p>;

  return (
    <div className="supervisor-container">
      <h1>Programs Under My Supervision</h1>
      <div className="program-grid">
        {programs.map((program) => (
          <div key={program.trainingProgramId} className="program-card">
            <img src={program.imagePath} alt={program.title} />
            <div className="program-content">
              <h2>{program.title}</h2>
              <p><strong>ID:</strong> {program.trainingProgramId}</p>
              <p><strong>Category:</strong> {program.categoryName}</p>
              <p><strong>Duration:</strong> {program.durationInDays}</p>
              <p><strong>Start:</strong> {new Date(program.startDate).toLocaleDateString()}</p>
              <p><strong>End:</strong> {new Date(program.endDate).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {program.location}</p>
              <p><strong>Seats Available:</strong> {program.seatsAvailable}</p>
              <p><strong>Rating:</strong> {program.rating} ⭐</p>
              <p className="tags">
                <a href={program.contentUrl} target="_blank" rel="noopener noreferrer">📚 Content</a> |{" "}
                <a href={program.classroomUrl} target="_blank" rel="noopener noreferrer">🏫 Classroom</a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
