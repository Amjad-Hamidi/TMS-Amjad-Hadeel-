import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu"; // زر القائمة
import "./CompanyLayout.css";
import "../Responsive/CompanyResponsive.css";

const CompanyLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // مصغر بالبداية

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={`company-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2 style={{color:"#fff23e"}}><i className="fas fa-building"></i> <span>{isSidebarOpen ? "Company" : "Comp"}</span></h2>
          <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/company" end>
              <i className="fas fa-home"></i>
              {isSidebarOpen && <span>My Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyProfile">
              <i className="fas fa-user-tie"></i>
              {isSidebarOpen && <span>My Profile</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanySupervisors">
              <i className="fas fa-users-cog"></i>
              {isSidebarOpen && <span>Supervisors</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/TraineesList">
              <i className="fas fa-users"></i>
              {isSidebarOpen && <span>Trainees</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/AddTrainingProgram">
              <i className="fas fa-plus-circle"></i>
              {isSidebarOpen && <span>Add Program</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyTrainingPrograms">
              <i className="fas fa-chalkboard-teacher"></i>
              {isSidebarOpen && <span>My Programs</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyApplications">
              <i className="fas fa-file-alt"></i>
              {isSidebarOpen && <span>My Applications</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyProfiles">
              <i className="fas fa-user-tie"></i>
              {isSidebarOpen && <span>All Profiles</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyFeedback">
              <i className="fas fa-comments"></i>
              {isSidebarOpen && <span>Received Feedbacks</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/CompanyFeedbacks">
              <i className="fas fa-comments"></i>
              {isSidebarOpen && <span>Sent Feedbacks</span>}
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

export default CompanyLayout;
