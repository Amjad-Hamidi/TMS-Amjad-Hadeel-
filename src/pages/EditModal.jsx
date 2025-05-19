// EditModal.jsx
import React, { useState } from "react";
import "../styles/EditModal.css";

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

export default function EditModal({ feedback, onSave, onClose }) {
  console.log("EditModal - Received feedback prop:", feedback);

  const [message, setMessage] = useState(feedback?.message || "");
  const [rating, setRating] = useState(feedback?.rating || 1);
  const [type, setType] = useState(feedback?.type ?? 0);

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    const payload = {};
    if (message !== feedback?.message) payload.message = message;
    if (rating !== feedback?.rating) payload.rating = rating;
    if (type !== feedback?.type) payload.type = type;

    console.log("EditModal - Attempting to update feedback with:", {
      receiverId: feedback?.receiverId, // استخدام القيمة من الخاصية feedback
      feedbackId: feedback?.feedbackId, // استخدام القيمة من الخاصية feedback
      payload,
      token,
    });

    try {
      const response = await fetch(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/receiver-user/${feedback?.receiverId}/feedback/${feedback?.feedbackId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("EditModal - PATCH Response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("EditModal - Failed to update feedback:", response.status, errorText);
        throw new Error(`Failed to update feedback: ${response.status} - ${errorText}`);
      }

      const updatedData = await response.json();
      console.log("EditModal - Feedback updated successfully:", updatedData);
      onSave(updatedData);
    } catch (error) {
      console.error("EditModal - Error updating feedback:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Feedback</h3>

        <label>Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

        <label>Rating</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(Number(e.target.value))}>
          {Object.entries(feedbackTypeLabels).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}