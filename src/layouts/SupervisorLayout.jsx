import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./SupervisorLayout.css";

const SupervisorLayout = () => {
return (
<div className="supervisor-layout">
<nav className="sidebar">
<div className="sidebar-header">
<h2><i className="fas fa-chalkboard-teacher"></i> Supervisor</h2>
</div>
<ul className="nav-links">
<li>
<NavLink to="/supervisor" end>
<i className="fas fa-home"></i>
<span>Dashboard</span>
</NavLink>
</li>
<li>
<NavLink to="/supervisor/SupervisorProfile">
<i className="fas fa-user-tie"></i>
<span>Profile</span>
</NavLink>
</li>
<li>
<NavLink to="/supervisor/SupervisorPrograms">
<i className="fas fa-book-open"></i>
<span>Programs</span>
</NavLink>
</li>
<li>
<NavLink to="/supervisor/STraineesList">
<i className="fas fa-users"></i>
<span>Trainees</span>
</NavLink>
</li>
<li>
<NavLink to="/supervisor/SupervisorFeedback">
<i className="fas fa-comments"></i>
<span>Feedback</span>
</NavLink>
</li>
<li>
<NavLink to="/supervisor/SupervisorFeedbacks">
<i className="fas fa-comments"></i>
<span>my sent Feedback</span>
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

export default SupervisorLayout;



