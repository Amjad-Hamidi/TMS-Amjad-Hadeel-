// TMyFeedbacks.jsx
import React, { useEffect, useState } from "react";
import EditModal from "./EditModal";
import "../styles/TraineeFeedback.css";

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

export default function TMyFeedbacks() {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchMyFeedbacks = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("TMyFeedbacks - Fetching feedbacks with token:", token);
      try {
        const response = await fetch(
          "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/sent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("TMyFeedbacks - Response:", response);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("TMyFeedbacks - Fetch failed:", response.status, errorText);
          throw new Error(`Failed to fetch feedbacks: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("TMyFeedbacks - Fetched data:", data);
        setMyFeedbacks(data.items || []);
      } catch (error) {
        console.error("TMyFeedbacks - Error fetching feedbacks:", error);
      }
    };

    fetchMyFeedbacks();
  }, []);

  const handleEditClick = (f) => {
    const itemToEdit = {
      ...f,
      receiverId: f.toUserAccountId, // 👈 مهم جداً
      feedbackId: f.id,              // 👈 مهم جداً
    };
    setEditItem(itemToEdit);
  };

  const handleEditSave = (updatedItem) => {
    console.log("TMyFeedbacks - Saving edited item:", updatedItem);
    setMyFeedbacks((prev) =>
      prev.map((f) => (f.id === updatedItem.id ? updatedItem : f))
    );
    setEditItem(null);
  };

  return (
    <div className="fb-wrap">
      <h2>My Sent Feedback</h2>

      <div className="fb-list">
        {myFeedbacks.length === 0 && (
          <p className="empty">You haven’t sent any feedback yet.</p>
        )}

        {myFeedbacks.map((f) => (
          <div key={f.id} className="fb-card my-feedback">
            <div className="row">
              <span className="badge">To: {f.toFullName}</span>
              {f.rating != null && <span className="rating">⭐ {f.rating}</span>}
              <button className="edit-btn" onClick={() => handleEditClick(f)}>
                ✏️
              </button>
            </div>
            <p className="msg">{f.message}</p>
            <div className="meta">
              <span>Type: {feedbackTypeLabels[f.type] || "Unknown"}</span>
              <span>{new Date(f.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <strong>Program:</strong> {f.programName}
            </div>
            {f.attachmentUrl && (
              <a href={f.attachmentUrl} target="_blank" rel="noreferrer">
                📎 View Attachment
              </a>
            )}
          </div>
        ))}
      </div>

      {editItem && (
        <EditModal
          feedback={editItem}        // يحتوي الآن على receiverId و feedbackId
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}
