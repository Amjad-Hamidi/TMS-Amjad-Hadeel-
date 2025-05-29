import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import "./TraineeLayout.css"; // استيراد ستايلات التنسيق

const TraineeLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };
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

export default TraineeLayout;





