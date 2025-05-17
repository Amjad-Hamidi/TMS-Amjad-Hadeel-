import React, { useState } from "react";
import "../styles/PendingTrainingPrograms.css";

const dummyPrograms = [
{
id: 1,
name: "AI for Business",
companyName: "FutureTech Inc.",
description: "Learn how AI impacts business decision making.",
startDate: "2025-06-01",
endDate: "2025-07-15",
students: 35,
location: "Amman, Jordan",
image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=600&q=80",
supervisor: "Eng. Laila Jamal",
status: "pending"
},
{
id: 2,
name: "Cybersecurity Basics",
companyName: "SecureNow",
description: "Introduction to digital security principles.",
startDate: "2025-06-10",
endDate: "2025-08-01",
students: 20,
location: "Irbid, Jordan",
image: "https://images.unsplash.com/photo-1581092334042-ec2bb7f6f4cb?auto=format&fit=crop&w=600&q=80",
supervisor: "Dr. Omar Hassan",
status: "accepted"
}
];

export default function PendingTrainingPro() {
const [filter, setFilter] = useState("pending");
const [programs, setPrograms] = useState(dummyPrograms);

const handleAction = (id, action) => {
const updated = programs.map(p =>
p.id === id ? { ...p, status: action } : p
);
setPrograms(updated);
};

const filtered = programs.filter(p => filter === "all" || p.status === filter);

return (
<div className="pending-shell">
<h1>Training Programs Management</h1>

<div className="filter">
<button onClick={() => setFilter("all")}>All</button>
<button onClick={() => setFilter("pending")}>Pending</button>
<button onClick={() => setFilter("accepted")}>Accepted</button>
<button onClick={() => setFilter("rejected")}>Rejected</button>
</div>

<div className="program-list">
{filtered.map(p => (
<div key={p.id} className="program-card">
<img src={p.image} alt={p.name} />
<div className="info">
<h2>{p.name}</h2>
<p><strong>Company:</strong> {p.companyName}</p>
<p>{p.description}</p>
<p><strong>Start:</strong> {p.startDate} — <strong>End:</strong> {p.endDate}</p>
<p><strong>Students:</strong> {p.students}</p>
<p><strong>Location:</strong> {p.location}</p>
<p><strong>Supervisor:</strong> {p.supervisor}</p>
</div>
{p.status === "pending" && (
<div className="actions">
<button className="accept" onClick={() => handleAction(p.id, "accepted")}>Accept</button>
<button className="reject" onClick={() => handleAction(p.id, "rejected")}>Reject</button>
</div>
)}
{p.status !== "pending" && (
<span className={`status-tag ${p.status}`}>{p.status.toUpperCase()}</span>
)}
</div>
))}
</div>
</div>
);
}






