// CompanyFeedbacks.jsx
import React, { useEffect, useState } from "react";
import "../styles/TraineeFeedback.css";
import EditModal from "../pages/EditModal"; // تأكد أن المسار صحيح عندك

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

export default function CompanyFeedbacks() {
  const [companyFeedbacks, setCompanyFeedbacks] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("CompanyFeedbacks - Fetching feedbacks with token:", token);
      try {
        const response = await fetch(
          "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/sent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("CompanyFeedbacks - Fetch Feedbacks Response:", response);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("CompanyFeedbacks - Failed to fetch feedbacks:", response.status, errorText);
          throw new Error(`Failed to fetch feedbacks: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("CompanyFeedbacks - Fetched data:", data);
        setCompanyFeedbacks(data.items);
      } catch (error) {
        console.error("CompanyFeedbacks - Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleEditSave = (updatedItem) => {
    console.log("CompanyFeedbacks - handleEditSave called with:", updatedItem);
    setCompanyFeedbacks((prev) =>
      prev.map((f) => (f.id === updatedItem.id ? updatedItem : f))
    );
    setEditItem(null);
  };

  return (
    <div className="fb-wrap">
      <h2>Company Sent Feedback</h2>

      <div className="fb-list">
        {companyFeedbacks.length === 0 && (
          <p className="empty">No feedback sent yet.</p>
        )}

        {companyFeedbacks.map((f) => {
          console.log("CompanyFeedbacks - Individual feedback item:", f);

          return (
            <div key={f.createdAt} className="fb-card my-feedback">
              <div className="row">
                <span className="badge">To: {f.toFullName}</span>
                <span className="rating">⭐ {f.rating}</span>
<button
  className="edit-btn"
  onClick={() => {
    const itemToEdit = {
      ...f,
      receiverId: f.toUserAccountId, // تأكد من أن هذا هو المعرف الصحيح
      feedbackId: f.id, // تأكد من أن هذا هو المعرف الصحيح
    };
    console.log("CompanyFeedbacks - Setting editItem to:", itemToEdit);
    setEditItem(itemToEdit);
  }}
>
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
          );
        })}
      </div>

      {editItem && (
        <EditModal
          feedback={editItem}
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}