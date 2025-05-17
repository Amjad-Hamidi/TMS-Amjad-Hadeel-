

import React from "react";
import "../styles/EditModal.css";

export default function EditModal({ feedback, onSave, onClose }) {
  const [message, setMessage] = React.useState(feedback.msg);
  const [type, setType] = React.useState(feedback.type || "General");

  const handleSave = () => {
    if (message.trim()) {
      onSave({ ...feedback, msg: message, type });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Feedback</h3>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="General">General</option>
          <option value="Praise">Praise</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Complaint">Complaint</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}




