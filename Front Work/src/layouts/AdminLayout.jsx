import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import "./AdminLayout.css";
import "../Responsive/AdminResponsive.css";

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
          <h2 style={{color:"#fff23e"}}><i className="fas fa-user-shield"></i> {isSidebarOpen && "Admin"}</h2>
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
              {isSidebarOpen && <span>Users Management</span>}
            </NavLink>
          </li>   
          <li>
            <NavLink to="/admin/categories">
              <i class="fa-solid fa-layer-group"></i>
              {isSidebarOpen && <span>Categories Management</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/programs">
              <i class="fa-solid fa-table-cells-row-unlock"></i>
              {isSidebarOpen && <span>Programs Management</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-user">
              <i class="fa-solid fa-user-plus"></i>
              {isSidebarOpen && <span>Add User</span>}
            </NavLink>
          </li>          
          <li>
            <NavLink to="/admin/add-category">
              <i className="fas fa-layer-group"></i>
              {isSidebarOpen && <span>Add Category</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/programs-overview">
              <i className="fas fa-clock"></i>
              {isSidebarOpen && <span>Porgrams Overview</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-program">
              <i class="fa-solid fa-fan"></i>
              {isSidebarOpen && <span>Add Program</span>}
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
