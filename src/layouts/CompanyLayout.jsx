import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import "./CompanyLayout.css";

const CompanyLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };
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
