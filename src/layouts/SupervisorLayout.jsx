import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./SupervisorLayout.css";

const SupervisorLayout = () => {
  const navigate = useNavigate();
const [collapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };



  return (
    <div className={`supervisor-layout ${collapsed ? "collapsed" : ""}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2 style={{color:"#fff23e"}}><i className="fas fa-chalkboard-teacher"></i> Supervisor</h2>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/supervisor" end><i className="fas fa-home"></i><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorProfile"><i className="fas fa-user-tie"></i><span>My Profile</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorPrograms"><i className="fas fa-book-open"></i><span>My Programs</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorTraineesList"><i className="fas fa-users"></i><span>Trainees</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorProfiles"><i className="fas fa-user-tie"></i><span>All Profiles</span></NavLink></li>

          <li><NavLink to="/supervisor/SupervisorFeedback"><i className="fas fa-comments"></i><span>Received Feedbacks</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorFeedbacks"><i className="fas fa-comments"></i><span>Sent Feedbacks</span></NavLink></li>
        </ul>
      </nav>

      {/* Toggle button */}
      <div style={{ position: 'sticky', top: 20, left: 20, zIndex: 1001, width: 'fit-content', height: 0 }}>
        <Button
          variant="contained"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
          className="togg-btn"
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </Button>
      </div>

      {/* Logout button */}
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

export default SupervisorLayout;
