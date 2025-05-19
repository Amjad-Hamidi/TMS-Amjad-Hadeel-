import React, { useState } from "react";
import "../styles/EditModal.css";

export default function EditModal({ feedback, onSave, onClose }) {
  const [editedMessage, setEditedMessage] = useState(feedback.message || "");
  const [editedRating, setEditedRating] = useState(feedback.rating || 0);
  const [editedType, setEditedType] = useState(feedback.type || 0);
  const [editedAttachment, setEditedAttachment] = useState(feedback.attachment || "");

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/${feedback.receiverId}/${feedback.feedbackId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: editedMessage,
            rating: editedRating,
            type: editedType,
            attachment: editedAttachment,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("EditModal - Failed to update feedback:", errorText);
        alert("Failed to update feedback.");
        return;
      }

      const updatedItem = await response.json();
      console.log("EditModal - Feedback updated:", updatedItem);
      onSave(updatedItem);
    } catch (error) {
      console.error("EditModal - Error while updating feedback:", error);
      alert("An error occurred while updating feedback.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Feedback</h3>

        <label>Message:</label>
        <textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
        />

        <label>Rating:</label>
        <input
          type="number"
          value={editedRating}
          min={1}
          max={5}
          onChange={(e) => setEditedRating(parseInt(e.target.value))}
        />

        <label>Type:</label>
        <select
          value={editedType}
          onChange={(e) => setEditedType(parseInt(e.target.value))}
        >
          <option value={0}>General</option>
          <option value={1}>Suggestion</option>
          <option value={2}>Complaint</option>
          <option value={3}>Praise</option>
        </select>

        <label>Attachment URL:</label>
        <input
          type="text"
          value={editedAttachment}
          onChange={(e) => setEditedAttachment(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
