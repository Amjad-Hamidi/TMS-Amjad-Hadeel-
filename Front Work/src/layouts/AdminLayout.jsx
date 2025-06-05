import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-user-shield"></i> {isSidebarOpen && "Admin"}</h2>
          <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/admin" end>
              <i className="fas fa-home"></i>
              {isSidebarOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <i className="fas fa-users-cog"></i>
              {isSidebarOpen && <span>User Management</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories">
              <i className="fas fa-layer-group"></i>
              {isSidebarOpen && <span>Categories</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/pendingTrainingPro">
              <i className="fas fa-clock"></i>
              {isSidebarOpen && <span>Pending Programs</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="logout-button-container">
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
          >
            Logout
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
