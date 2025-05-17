import React, { useState } from "react";
import EditModal from "./EditModal";
import "../styles/TraineeFeedback.css";

const myFeedbackList = [
{
id: 1,
target: "Supervisor",
type: "General",
date: "2025‑05‑10 09:45",
msg: "Thanks for your support during the training!",
rating: 5
},
{
id: 2,
target: "Company",
type: "Suggestion",
date: "2025‑05‑12 11:30",
msg: "It would be helpful to receive clearer project requirements.",
rating: 4
}
];

export default function TMyFeedbacks() {
const [myFeedbacks, setMyFeedbacks] = useState(myFeedbackList);
const [editItem, setEditItem] = useState(null);

const handleEditSave = (updatedItem) => {
const updatedList = myFeedbacks.map((f) =>
f.id === updatedItem.id ? updatedItem : f
);
setMyFeedbacks(updatedList);
setEditItem(null);
};

return (
<div className="fb-wrap">
<h2>My Sent Feedback</h2>

<div className="fb-list">
{myFeedbacks.map((f) => (
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

{myFeedbacks.length === 0 && <p className="empty">You haven’t sent any feedback yet.</p>}
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




