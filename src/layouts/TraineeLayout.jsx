import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./TraineeLayout.css";

const TraineeLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className={`trainee-layout ${collapsed ? "collapsed" : ""}`}>
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
            <li>
            <NavLink to="/trainee/CompaniesSupervisors" activeclassname="active">
              <i className="fas fa-user"></i>
              <span>Companies&Supervisors</span>
            </NavLink>
          </li>
          <li></li>
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

      {/* زر إغلاق وفتح الـ sidebar */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1001 }}>
        <Button
          variant="contained"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </Button>
      </div>

      {/* زر تسجيل الخروج */}
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
