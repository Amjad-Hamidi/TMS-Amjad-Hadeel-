




import React, { useState, useMemo } from "react";
import "../styles/TraineeFeedback.css";

const dummy = [
{
id: 31,
source: "Trainee",
author: "Rana Jaber",
authorImg: "/avatars/trainee2.png",
receiverImg: "/avatars/supervisor.png",
date: "2025-05-10 09:15",
rating: 4.7,
msg: "Appreciated your guidance on the backend structure.",
type: "Praise",
attachment: null,
target: "Supervisor"
},
{
id: 32,
source: "Company",
author: "TechBridge HR",
authorImg: "/avatars/company3.png",
receiverImg: "/avatars/supervisor.png",
date: "2025-05-13 11:30",
rating: 4.3,
msg: "Thanks for supporting trainees’ attendance reporting.",
type: "General",
attachment: "report-summary.pdf",
target: "Supervisor"
},
{
id: 33,
source: "Company",
author: "InnovateX Team Lead",
authorImg: "/avatars/company1.png",
receiverImg: "/avatars/supervisor.png",
date: "2025-05-15 15:00",
rating: 3.9,
msg: "Please improve communication for project progress tracking.",
type: "Suggestion",
attachment: null,
target: "Supervisor"
}
];

export default function SupervisorFeedback() {
const [filterSource, setFilterSource] = useState("All");
const [filterType, setFilterType] = useState("All");
const [search, setSearch] = useState("");

const sorted = useMemo(() =>
[...dummy]
.filter(f => f.target === "Supervisor")
.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
, []);

const filtered = sorted.filter(f =>
(filterSource === "All" || f.source === filterSource) &&
(filterType === "All" || f.type === filterType) &&
f.msg.toLowerCase().includes(search.toLowerCase())
);

return (
<div className="fb-wrap">
<h2>Supervisor Feedback</h2>

{/* Search bar */}
<input
type="text"
className="search-bar"
placeholder="🔍 Search feedback..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>

{/* Filters */}
<div className="fb-filter">
<label>Source:</label>
{["All", "Trainee", "Company"].map((f) => (
<button
key={f}
className={filterSource === f ? "active" : ""}
onClick={() => setFilterSource(f)}
>
{f}
</button>
))}

<label>Type:</label>
{["All", "General", "Suggestion", "Praise"].map((t) => (
<button
key={t}
className={filterType === t ? "active" : ""}
onClick={() => setFilterType(t)}
>
{t}
</button>
))}
</div>

{/* Feedback list */}
<div className="fb-list">
{filtered.map((f) => (
<div key={f.id} className={`fb-card ${f.source.toLowerCase()}`}>
<div className="row">
<img src={f.authorImg} className="avatar" alt="author" />
<span className="badge">{f.source}</span>
<span className="rating">⭐ {f.rating}</span>
</div>

<p className="msg">{f.msg}</p>

<div className="meta">
<img src={f.receiverImg} className="avatar sm" alt="receiver" />
<span>{f.author}</span>
<span>{f.date}</span>
<span className="type">{f.type}</span>
</div>

{f.attachment && (
<div className="attach">
📎 <a href={`/${f.attachment}`} target="_blank" rel="noopener noreferrer">{f.attachment}</a>
</div>
)}

<button className="edit-btn">✏️ Edit</button>
</div>
))}

{filtered.length === 0 && <p className="empty">No feedback found.</p>}
</div>
</div>
);
}





