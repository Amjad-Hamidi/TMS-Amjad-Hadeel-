

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
return (
<div className="admin-layout">
<nav className="sidebar">
<div className="sidebar-header">
<h2><i className="fas fa-user-shield"></i> Admin</h2>
</div>
<ul className="nav-links">
<li>
<NavLink to="/admin" end>
<i className="fas fa-home"></i>
<span>Dashboard</span>
</NavLink>
</li>
<li>
<NavLink to="/admin/users">
<i className="fas fa-users-cog"></i>
<span>User Management</span>
</NavLink>
</li>
<li>
<NavLink to="/admin/categories">
<i className="fas fa-layer-group"></i>
<span>Categories</span>
</NavLink>
</li>
<li>
<NavLink to="/admin/pendingTrainingPro">
<i className="fas fa-clock"></i>
<span>Pending Programs</span>
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

export default AdminLayout;


