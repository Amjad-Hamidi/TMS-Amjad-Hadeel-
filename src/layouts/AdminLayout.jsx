import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };
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
      <div style={{ position: 'absolute', top: 20, right: 40, zIndex: 1000 }}>
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
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;


