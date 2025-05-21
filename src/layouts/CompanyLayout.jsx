

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./CompanyLayout.css";

const CompanyLayout = () => {
return (
<div className="company-layout">
<nav className="sidebar">
<div className="sidebar-header">
<h2><i className="fas fa-building"></i> Company</h2>
</div>
<ul className="nav-links">
<li>
<NavLink to="/company" end>
<i className="fas fa-home"></i>
<span>Dashboard</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanyProfile">
<i className="fas fa-user-tie"></i>
<span>Profile</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanySupervisors">
<i className="fas fa-users-cog"></i>
<span>Supervisors</span>
</NavLink>
</li>
<li>
<NavLink to="/company/TraineesList">
<i className="fas fa-users"></i>
<span>Trainees</span>
</NavLink>
</li>
<li>
<NavLink to="/company/AddTrainingProgram">
<i className="fas fa-plus-circle"></i>
<span>Add Program</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanyTrainingPrograms">
<i className="fas fa-chalkboard-teacher"></i>
<span>Programs</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanyApplications">
<i className="fas fa-file-alt"></i>
<span>Applications</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanyFeedback">
<i className="fas fa-comments"></i>
<span>Feedback</span>
</NavLink>
</li>
<li>
<NavLink to="/company/CompanyFeedbacks">
<i className="fas fa-comments"></i>
<span>our Feedback</span>
</NavLink>
</li>
</ul>
</nav>

<main className="main-content">
<Outlet />
</main>
</div>
);
};

export default CompanyLayout;
