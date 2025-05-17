


import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
const menu = [
{ icon: "fa-home", label: "Dashboard" },
{ icon: "fa-users", label: "User Management" },
{ icon: "fa-layer-group", label: "Add Category" },
{ icon: "fa-chart-line", label: "Pending Training Programs" },
];

const programsDummy = [
{
id: 1,
title: "Full‑Stack Bootcamp",
categoryId: "CAT001",
description: "Intensive MERN stack track.",
requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node"],
image:
"https://images.unsplash.com/photo-1581090700227-1e8e2fe05b53?auto=format&fit=crop&w=600&q=80",
},
{
id: 2,
title: "Data Analysis Basics",
categoryId: "CAT002",
description: "Excel, Python & Tableau.",
requiredSkills: ["Python", "Excel", "SQL"],
image:
"https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80",
},
];
const navigate = useNavigate(); // Hook للتنقل
    
    const handleViewProgramClick = () => {
      navigate("/CategoryTProgramsW");
      };
      

return (
<div className="a-shell">


{/* ▸ Main */}
<main className="a-main">
<h1>System Overview</h1>

<div className="stat-grid">
<Stat title="Users" value="1 200" />
<Stat title="Companies" value="48" />
<Stat title="Active Programs" value="32" />
<Stat title="Pending Apps" value="87" />
</div>

{/* ▸ Programs Section */}
<section className="programs-section">
<h2>Explore Categories</h2>
<div className="grid">
{programsDummy.map((p) => (
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
</div>
</section>
</main>
</div>
);
}

/* ▸ Component: Stat Card */
function Stat({ title, value }) {
return (
<div className="stat-card">
<h3>{title}</h3>
<p>{value}</p>
</div>
);
}






