import React, { useState, useEffect } from 'react';
import '../styles/CompanyApplications.css';

const statusMap = {
  0: "pending",
  1: "accepted",
  2: "rejected",
};

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchProgramId, setSearchProgramId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      setError("Access token not found.");
      setLoading(false);
      return;
    }

    fetch("http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/all-applicants", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch"))
      .then(data => {
        console.log("📦 Full API Response:", data); // ✅ هنا طباعة الريسبونس
        const mappedApps = (data.items || []).map(app => ({
          ...app,
          status: statusMap[app.status] || "unknown",
        }));
        setApplications(mappedApps);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("❌ Failed to load applications.");
        setLoading(false);
      });
  }, [token]);

  const handleAction = async (traineeId, programId, accept) => {
    setActionMessage("Processing...");
    try {
      const res = await fetch(`http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/review/trainee/${traineeId}/program/${programId}?accept=${accept}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const message = await res.text();
      if (!res.ok) throw new Error(message);

      setApplications(prev =>
        prev.map(app =>
          app.traineeId === traineeId && app.trainingProgramId === programId
            ? { ...app, status: accept ? "accepted" : "rejected" }
            : app
        )
      );

      setActionMessage(message);
    } catch (err) {
      setActionMessage(err.message || "❌ Something went wrong.");
    }
  };

  const filteredApps = applications.filter(app => {
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    const matchProgramId = app.trainingProgramId.toString().includes(searchProgramId);
    return matchStatus && matchProgramId;
  });

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="company-applications">
      <h1>Training Applications</h1>

      {/* Filter & Search */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by Program ID..."
          value={searchProgramId}
          onChange={(e) => setSearchProgramId(e.target.value)}
        />
        <div className="status-buttons">
          {["all", "pending", "accepted", "rejected"].map(status => (
            <button
              key={status}
              className={filterStatus === status ? "active-status" : ""}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && <p style={{ marginTop: 10, color: "green" }}>{actionMessage}</p>}

      {/* Applications List */}
      <div className="applications-list">
        {filteredApps.length === 0 ? (
          <p>No applications match the criteria.</p>
        ) : (
          filteredApps.map((app) => (
            <div className="application-card" key={`${app.traineeId}-${app.trainingProgramId}`}>
              <div className="trainee-info">
                <img
                  src={app.profileImageUrl || "https://i.pravatar.cc/100"}
                  alt={app.fullName}
                  className="trainee-avatar"
                />
                <div>
                  <h3>{app.fullName}</h3>
                  <p><strong>ID:</strong> {app.traineeId}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Enrolled At:</strong> {new Date(app.enrolledAt).toLocaleDateString()}</p>
                  <p><strong>Program:</strong> {app.programTitle}</p>
                  <p><strong>Program ID:</strong> {app.trainingProgramId}</p>
                  <p><strong>Resume:</strong>{" "}
                    <a href={app.cvPath} target="_blank" rel="noopener noreferrer">📄 View</a>
                  </p>
                  <p><strong>Status:</strong> {app.status}</p>
                </div>
              </div>

              {app.status === "pending" && (
                <div className="application-actions">
                  <button className="accept-btn" onClick={() => handleAction(app.traineeId, app.trainingProgramId, true)}>
                    ✅ Accept
                  </button>
                  <button className="reject-btn" onClick={() => handleAction(app.traineeId, app.trainingProgramId, false)}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyApplications;
