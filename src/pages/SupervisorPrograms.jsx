import React from "react";
import "../styles/SupervisorPrograms.css";

const programs = [
{
id: 2,
title: "Frontend Development Essentials",
category: "Frontend",
supervisor: "Eng. Laila Naser",
duration: "4 weeks",
start: "2025-06-01",
end: "2025-07-01",
location: "Remote",
seats: 15,
rating: 4,
image: "https://images.unsplash.com/photo-1581090700227-1e8e2fe05b53?auto=format&fit=crop&w=600&q=80"
},
{
id: 3,
title: "Advanced React.js",
category: "Frontend",
supervisor: "Eng. Laila Naser",
duration: "6 weeks",
start: "2025-07-10",
end: "2025-08-20",
location: "Onsite - Amman",
seats: 10,
rating: 5,
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
},
{
id: 4,
title: "UI/UX Design Bootcamp",
category: "Design",
supervisor: "Eng. Laila Naser",
duration: "3 weeks",
start: "2025-08-01",
end: "2025-08-21",
location: "Remote",
seats: 20,
rating: 4,
image: "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d3?auto=format&fit=crop&w=600&q=80"
}
];

export default function SupervisorPrograms() {
return (
<div className="supervisor-container">
<h1>Programs Under My Supervision</h1>
<div className="program-grid">
{programs.map((program) => (
<div key={program.id} className="program-card">
<img src={program.image} alt={program.title} />
<div className="program-content">
<h2>{program.title}</h2>
<p><strong>ID:</strong> {program.id}</p>
<p><strong>Category:</strong> {program.category}</p>
<p><strong>Duration:</strong> {program.duration}</p>
<p><strong>Start:</strong> {program.start}</p>
<p><strong>End:</strong> {program.end}</p>
<p><strong>Location:</strong> {program.location}</p>
<p><strong>Seats:</strong> {program.seats}</p>
<p><strong>Rating:</strong> {program.rating} ⭐</p>
<p className="tags">📚 Content | 🏫 Classroom</p>
</div>
</div>
))}
</div>
</div>
);
}



