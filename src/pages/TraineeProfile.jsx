import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const TraineeProfile = () => {
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainee = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/me");

        // Log status and headers
        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);

        const text = await response.text();
        console.log("Response text:", text);

        if (!response.ok) {
          throw new Error(`Failed to fetch trainee profile. Status: ${response.status}`);
        }

        // Try parsing JSON after logging
        const data = JSON.parse(text);

        setTrainee({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileImageUrl: data.profileImageUrl,
          role: data.role,
          cvPath: data.cvPath,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainee();
  }, []);

  if (loading) return <p>Loading trainee profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Trainee Profile</h2>
      <p><strong>ID:</strong> {trainee.id}</p>
      <p><strong>Full Name:</strong> {trainee.fullName}</p>
      <p><strong>Email:</strong> {trainee.email}</p>
      <p><strong>Phone Number:</strong> {trainee.phoneNumber}</p>
      <p><strong>Role:</strong> {trainee.role}</p>
      <p>
        <strong>Profile Image:</strong>{" "}
        {trainee.profileImageUrl ? (
          <img src={trainee.profileImageUrl} alt="Profile" width={100} />
        ) : (
          "No image available"
        )}
      </p>
      <p>
        <strong>CV:</strong>{" "}
        {trainee.cvPath ? (
          <a href={trainee.cvPath} target="_blank" rel="noopener noreferrer">
            Download CV
          </a>
        ) : (
          "No CV uploaded"
        )}
      </p>
    </div>
  );
};

export default TraineeProfile;
