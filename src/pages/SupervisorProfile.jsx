import React, { useEffect, useState } from "react";

const SupervisorProfile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupervisor = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found.");

        const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/Profiles/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);

        const text = await response.text();
        console.log("Response text:", text);

        if (!response.ok) {
          throw new Error(`Failed to fetch supervisor profile. Status: ${response.status}`);
        }

        const data = JSON.parse(text);

        setSupervisor({
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

    fetchSupervisor();
  }, []);

  if (loading) return <p>Loading supervisor profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Supervisor Profile</h2>
      <p><strong>ID:</strong> {supervisor.id}</p>
      <p><strong>Full Name:</strong> {supervisor.fullName}</p>
      <p><strong>Email:</strong> {supervisor.email}</p>
      <p><strong>Phone Number:</strong> {supervisor.phoneNumber}</p>
      <p><strong>Role:</strong> {supervisor.role}</p>
      <p>
        <strong>Profile Image:</strong>{" "}
        {supervisor.profileImageUrl ? (
          <img src={supervisor.profileImageUrl} alt="Profile" width={100} />
        ) : (
          "No image available"
        )}
      </p>
      <p>
        <strong>CV:</strong>{" "}
        {supervisor.cvPath ? (
          <a href={supervisor.cvPath} target="_blank" rel="noopener noreferrer">
            Download CV
          </a>
        ) : (
          "No CV uploaded"
        )}
      </p>
    </div>
  );
};

export default SupervisorProfile;
