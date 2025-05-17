import React, { useState } from "react";
import EditModal from "./EditModal";
import "../styles/TraineeFeedback.css";

const supervisorFeedbackList = [
{
id: 1,
target: "Trainee",
type: "General",
date: "2025‑05‑11 10:00",
msg: "Keep up the consistent progress on daily reports.",
rating: 4.5
},
{
id: 2,
target: "Company",
type: "Suggestion",
date: "2025‑05‑14 16:30",
msg: "Consider extending the trainee evaluation period by one week.",
rating: 4
}
];

export default function SupervisorFeedbacks() {
const [feedbacks, setFeedbacks] = useState(supervisorFeedbackList);
const [editItem, setEditItem] = useState(null);

const handleEditSave = (updatedItem) => {
const updatedList = feedbacks.map((f) =>
f.id === updatedItem.id ? updatedItem : f
);
setFeedbacks(updatedList);
setEditItem(null);
};

return (
<div className="fb-wrap">
<h2>Supervisor Sent Feedback</h2>

<div className="fb-list">
{feedbacks.map((f) => (
<div key={f.id} className="fb-card my-feedback">
<div className="row">
<span className="badge">To: {f.target}</span>
<span className="rating">⭐ {f.rating}</span>
<button className="edit-btn" onClick={() => setEditItem(f)}>✏️</button>
</div>
<p className="msg">{f.msg}</p>
<div className="meta">
<span>Type: {f.type}</span>
<span>{f.date}</span>
</div>
</div>
))}

{feedbacks.length === 0 && <p className="empty">No feedback sent yet.</p>}
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






