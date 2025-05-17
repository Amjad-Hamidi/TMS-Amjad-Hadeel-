import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TDashboard.css";

const trainee = {
skills: ["HTML", "CSS", "JavaScript", "React", "Redux"]
};

const programsDummy = [
{
id: 1,
title: "Full‑Stack Bootcamp",
categoryId: "CAT001",
description: "Intensive MERN stack track.",
requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node"],
image: "https://images.unsplash.com/photo-1581090700227-1e8e2fe05b53?auto=format&fit=crop&w=600&q=80"
},
{
id: 2,
title: "Data Analysis Basics",
categoryId: "CAT002",
description: "Excel, Python & Tableau.",
requiredSkills: ["Python", "Excel", "SQL"],
image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80"
}
];

export default function Dashboard() {
const [programs] = useState(programsDummy);
const [query, setQuery] = useState("");
const navigate = useNavigate(); // Hook للتنقل

// الدالة للتنقل إلى صفحة CategoryTPrograms عند الضغط على الزر
const handleViewProgramClick = () => {
navigate("/CategoryTPrograms");
};

return (
<div className="shell">
{/* ----- Sidebar ----- */}
<div className="logout-btn" onClick={() => {
window.location.href = "/login";
}}>
<i className="fas fa-sign-out-alt"></i> Logout
</div>

{/* ----- Main content ----- */}
<main className="main">
<h1>Explore Categories</h1>

<div className="search">
<input
placeholder="Search programs…"
value={query}
onChange={e => setQuery(e.target.value)}
/>
</div>

<div className="grid">
{programs
.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
.map(p => (
<div key={p.id} className="card">
<img src={p.image} alt="Program" className="card-img" />
<h3>{p.title}</h3>
<span className="category-id">Category ID: {p.categoryId}</span>
<p className="desc">{p.description}</p>
<button
className="view-btn"
onClick={handleViewProgramClick} // استخدام الدالة هنا
>
View Training Programs
</button>
</div>
))}

{programs.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).length === 0 &&
<p className="empty">No programs found.</p>}
</div>
</main>
</div>
);
}
