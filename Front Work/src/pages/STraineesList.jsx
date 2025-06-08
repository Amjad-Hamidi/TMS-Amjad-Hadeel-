import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/TraineesList.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';

export default function TraineesList() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrainees() {
      try {
        const response = await fetchWithAuth(
          "https://amjad-hamidi-tms.runasp.net/api/Users/trainees-supervisor"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTrainees(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrainees();
  }, []);

const handleInvite = (email) => {
  // Open mail client
  window.location.href = `mailto:${email}`;

  // Show SweetAlert
  Swal.fire({
    icon: "info",
    title: "Redirecting to Email",
    text: `You will be forwarded to your email client to send an invitation to ${email}`,
    confirmButtonText: "OK",
  });
};

  if (loading) return <p>Loading trainees...</p>;
  if (error) return <p>Error loading trainees: {error}</p>;

  return (
    <div className="trainees-page">
      <h2>Available Trainees</h2>
      <div className="trainee-grid">
        {trainees.length === 0 ? (
          <p>No trainees found under your supervision.</p>
        ) : (
          trainees.map((t) => (
            <div key={t.id} className="trainee-card">
              <img
                src={t.profileImageUrl || `https://i.pravatar.cc/100?u=${t.email}`}
                alt={t.fullName}
                className="avatar"
              />
              <h3>{t.fullName}</h3>
              {t.cvPath ? (
                <a href={t.cvPath} target="_blank" rel="noreferrer">
                  📄 View CV
                </a>
              ) : (
                <p>No CV uploaded</p>
              )}
              <button
                className="email-button"
                onClick={() => handleInvite(t.email)}
                title={`Send invitation email to ${t.fullName}`}
              >
                📧 Send Email
              </button>
              <p>
                <strong>Program:</strong> {t.trainingProgramName}
              </p>
              <p>
                <strong>Category:</strong> {t.categoryName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
