

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./TraineeLayout.css"; // استيراد ستايلات التنسيق

const TraineeLayout = () => {
return (
<div className="trainee-layout">
<nav className="sidebar">
<div className="sidebar-header">
<h2><i className="fas fa-user-graduate"></i> Trainee</h2>
</div>
<ul className="nav-links">
<li>
<NavLink to="/trainee" end activeclassname="active">
<i className="fas fa-home"></i>
<span>Dashboard</span>
</NavLink>
</li>
<li>
<NavLink to="/trainee/TraineeProfile" activeclassname="active">
<i className="fas fa-user"></i>
<span>Profile</span>
</NavLink>
</li>

<li>
<NavLink to="/trainee/TraineePrograms" activeclassname="active">
<i className="fas fa-book"></i>
<span>Programs</span>
</NavLink>
</li>
<li>
<NavLink to="/trainee/TraineeApplications" activeclassname="active">
<i className="fas fa-file-alt"></i>
<span>Applications</span>
</NavLink>
</li>
<li>
<NavLink to="/trainee/TraineeFeedback" activeclassname="active">
<i className="fas fa-comments"></i>
<span>Feedback</span>
</NavLink>
</li>
<li>
<NavLink to="/trainee/TMyFeedbacks" activeclassname="active">
<i className="fas fa-comments"></i>
<span>My Feedbacks</span>
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

export default TraineeLayout;





