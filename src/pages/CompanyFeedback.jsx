import React, { useState, useEffect } from "react";
import "../styles/TraineeFeedback.css";

const feedbackTypes = {
  1: "General",
  2: "Suggestion",
  3: "Complaint",
  4: "Praise",
};

const CompanyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [toUserId, setToUserId] = useState("");
  const [trainingProgramId, setTrainingProgramId] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [type, setType] = useState("General");
  const [attachment, setAttachment] = useState(null);

  const allowedTypes = ["General", "Suggestion", "Complaint", "Praise"];

  const token = localStorage.getItem("accessToken");

  // Fetch received feedbacks
  const fetchFeedbacks = async () => {
    if (!token) {
      setError("User is not authenticated. Please log in.");
      return;
    }
    setLoadingFeedbacks(true);
    setError("");
    try {
      const res = await fetch(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch feedbacks.");
      }
      const data = await res.json();
      setFeedbacks(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load feedbacks.");
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSend(true);
    setError("");
    setSuccessMsg("");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoadingSend(false);
      return;
    }

    if (!toUserId) {
      setError("Please enter the receiver's User ID.");
      setLoadingSend(false);
      return;
    }

    if (!trainingProgramId) {
      setError("Please enter the Training Program ID.");
      setLoadingSend(false);
      return;
    }

    if (message.length < 5) {
      setError("Message must be at least 5 characters.");
      setLoadingSend(false);
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      setLoadingSend(false);
      return;
    }
    if (!allowedTypes.includes(type)) {
      setError("Invalid feedback type.");
      setLoadingSend(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ToUserAccountId", toUserId);
      formData.append("TrainingProgramId", trainingProgramId);
      formData.append("Message", message);
      formData.append("Rating", rating);
      formData.append("Type", type);
      if (attachment) {
        formData.append("Attachment", attachment);
      }

      const res = await fetch(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Failed to send feedback.");
      }

      setSuccessMsg(text || "✅ Feedback sent successfully.");
      setMessage("");
      setRating(1);
      setType("General");
      setToUserId("");
      setTrainingProgramId("");
      setAttachment(null);

      setShowForm(false);
      fetchFeedbacks(); // Refresh feedback list
    } catch (err) {
      setError(err.message || "❌ Something went wrong.");
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="fb-wrap" style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Received Feedbacks</h1>

      {error && <p className="error">{error}</p>}

      {loadingFeedbacks ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks received yet.</p>
      ) : (
        <ul className="feedback-list" style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((fb, idx) => (
            <li
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 15,
                marginBottom: 15,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                gap: 15,
              }}
            >
              <img
                src={fb.fromImageUrl}
                alt={fb.fromFullName}
                style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <strong>{fb.fromFullName}</strong> <br />
                <small style={{ color: "#666" }}>
                  Program: {fb.programName} | Type:{" "}
                  {feedbackTypes[fb.type] || "Unknown"} | Rating: {fb.rating} ⭐
                </small>
                <p style={{ marginTop: 8 }}>{fb.message}</p>
                {fb.attachmentUrl && (
                  <p>
                    Attachment:{" "}
                    <a href={fb.attachmentUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                )}
                <small style={{ color: "#999" }}>
                  {new Date(fb.createdAt).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="open-feedback-btn"
          style={{
            marginTop: 20,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Send Feedback
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setShowForm(false)}
            className="close-feedback-btn"
            style={{ marginBottom: 15, cursor: "pointer" }}
          >
            Close Form
          </button>

          <h2>Send Feedback</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="fb-form">
            <label>
              To User ID:
              <input
                type="number"
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                required
              />
            </label>

            <label>
              Training Program ID:
              <input
                type="number"
                value={trainingProgramId}
                onChange={(e) => setTrainingProgramId(e.target.value)}
                required
              />
            </label>

            <label>
              Message:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minLength={5}
                required
              />
            </label>

            <label>
              Rating (1 to 5):
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </label>

            <label>
              Feedback Type:
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                {allowedTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Attachment (optional):
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
            </label>

            <button type="submit" disabled={loadingSend}>
              {loadingSend ? "Sending..." : "Send Feedback"}
            </button>

            {error && <p className="error">{error}</p>}
            {successMsg && <p className="success">{successMsg}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyFeedback;
