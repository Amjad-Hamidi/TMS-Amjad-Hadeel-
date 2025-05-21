import React, { useEffect, useState } from "react";
import "../styles/CompanySupervisors.css";

const CompanySupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://amjad-hamidi-tms.runasp.net/api/Users/supervisors", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        const text = await res.text();
        console.log("Response body:", text);

        if (!res.ok) throw new Error(`Failed to fetch supervisors: ${res.status}`);
        return JSON.parse(text);
      })
      .then((data) => {
        setSupervisors(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading supervisors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="directory-container">
      <h1>Company Supervisors</h1>
      <p className="subtitle">Supervisors currently working with our company.</p>

      <div className="supervisor-grid">
        {supervisors.length === 0 && <p>No supervisors found.</p>}

        {supervisors.map((sup) => (
          <div key={sup.id} className="supervisor-card">
            <img
              src={
                sup.profileImageUrl
                  ? sup.profileImageUrl
                  : "https://via.placeholder.com/150?text=No+Image"
              }
              alt={sup.profileImageUrl ? sup.fullName : "no image"}
            />
            <h2>{sup.fullName}</h2>
            <p><strong>ID:</strong> {sup.id}</p>
            <p><strong>Email:</strong> {sup.email}</p>
            <p><strong>Phone:</strong> {sup.phoneNumber}</p>
            {sup.cvPath ? (
              <a
                href={sup.cvPath}
                target="_blank"
                rel="noreferrer"
                className="resume-link"
              >
                📄 View Resume
              </a>
            ) : (
              <p>No resume available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanySupervisors;
