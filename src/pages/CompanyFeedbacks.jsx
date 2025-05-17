import React, { useState } from "react";
import EditModal from "./EditModal";
import "../styles/TraineeFeedback.css";

const companyFeedbackList = [
{
id: 1,
target: "Trainee",
type: "Praise",
date: "2025‑05‑09 10:15",
msg: "Excellent collaboration during the last sprint!",
rating: 5
},
{
id: 2,
target: "Supervisor",
type: "Suggestion",
date: "2025‑05‑13 13:20",
msg: "Please provide more structured progress reports from trainees.",
rating: 4
}
];

export default function CompanyFeedbacks() {
const [companyFeedbacks, setCompanyFeedbacks] = useState(companyFeedbackList);
const [editItem, setEditItem] = useState(null);

const handleEditSave = (updatedItem) => {
const updatedList = companyFeedbacks.map((f) =>
f.id === updatedItem.id ? updatedItem : f
);
setCompanyFeedbacks(updatedList);
setEditItem(null);
};

return (
<div className="fb-wrap">
<h2>Company Sent Feedback</h2>

<div className="fb-list">
{companyFeedbacks.map((f) => (
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

{companyFeedbacks.length === 0 && <p className="empty">No feedback sent yet.</p>}
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



