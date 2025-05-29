import React, { useState, useEffect } from "react";
import "../styles/TraineeFeedback.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const feedbackCategories = {
  1: "General",
  2: "Suggestion",
  3: "Complaint",
  4: "Praise",
};

const FeedbackComponent = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [programId, setProgramId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackType, setFeedbackType] = useState("General");
  const [fileAttachment, setFileAttachment] = useState(null);

  const allowedFeedbackTypes = ["General", "Suggestion", "Complaint", "Praise"];
  const authToken = localStorage.getItem("accessToken");

  const fetchFeedbacks = async () => {
    if (!authToken) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetchWithAuth(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/received"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks.");
      }
      const data = await response.json();
      setFeedbacks(data.items || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load feedbacks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleFeedbackSubmission = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!authToken) {
      setErrorMessage("User is not authenticated. Please log in.");
      setIsSubmitting(false);
      return;
    }

    if (!recipientId) {
      setErrorMessage("Please enter the recipient's User ID.");
      setIsSubmitting(false);
      return;
    }

    if (!programId) {
      setErrorMessage("Please enter the Training Program ID.");
      setIsSubmitting(false);
      return;
    }

    if (feedbackMessage.length < 5) {
      setErrorMessage("Message must be at least 5 characters.");
      setIsSubmitting(false);
      return;
    }

    if (!allowedFeedbackTypes.includes(feedbackType)) {
      setErrorMessage("Invalid feedback type.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ToUserAccountId", recipientId);
      formData.append("TrainingProgramId", programId);
      formData.append("Message", feedbackMessage);
      formData.append("Type", feedbackType);

      if (feedbackRating !== "") {
        formData.append("Rating", feedbackRating);
      }

      if (fileAttachment) {
        formData.append("Attachment", fileAttachment);
      }

      console.log("📤 Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetchWithAuth(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/send",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("📥 Server response:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Failed to send feedback.");
      }

      setSuccessMessage(responseText || "✅ Feedback sent successfully.");
      resetForm();
      fetchFeedbacks();
    } catch (error) {
      console.error("❌ Submission error:", error);
      setErrorMessage(error.message || "❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackMessage("");
    setFeedbackRating("");
    setFeedbackType("General");
    setRecipientId("");
    setProgramId("");
    setFileAttachment(null);
    setIsFormVisible(false);
  };

  return (
    <div className="fb-wrap" style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Received Feedbacks</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {isLoading ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks received yet.</p>
      ) : (
        <ul className="feedback-list" style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((feedback, index) => (
            <li
              key={index}
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
                src={feedback.fromImageUrl}
                alt={feedback.fromFullName}
                style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <strong>{feedback.fromFullName}</strong> <br />
                <small style={{ color: "#666" }}>
                  Program: {feedback.programName} | Type: {feedbackCategories[feedback.type] || "Unknown"} | Rating:{" "}
                  {feedback.rating ? `${feedback.rating} ⭐` : "N/A"}
                </small>
                <p style={{ marginTop: 8 }}>{feedback.message}</p>
                {feedback.attachmentUrl && (
                  <p>
                    Attachment:{" "}
                    <a href={feedback.attachmentUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                )}
                <small style={{ color: "#999" }}>{new Date(feedback.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="open-feedback-btn"
          style={{ marginTop: 20, padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
        >
          Send Feedback
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setIsFormVisible(false)}
            className="close-feedback-btn"
            style={{ marginBottom: 15, cursor: "pointer" }}
          >
            Close Form
          </button>

          <h2>Send Feedback</h2>

          <form onSubmit={handleFeedbackSubmission} encType="multipart/form-data" className="fb-form">
            <label>
              To User ID:
              <input
                type="number"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
              />
            </label>

            <label>
              Training Program ID:
              <input
                type="number"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
              />
            </label>

            <label>
              Message:
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                minLength={5}
                required
              />
            </label>

            <label>
              Rating (optional):
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={feedbackRating}
                onChange={(e) => setFeedbackRating(e.target.value)}
                placeholder="Leave empty if not needed"
              />
            </label>

            <label>
              Feedback Type:
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
              >
                {allowedFeedbackTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Attachment (optional):
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={(e) => setFileAttachment(e.target.files[0])}
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;
