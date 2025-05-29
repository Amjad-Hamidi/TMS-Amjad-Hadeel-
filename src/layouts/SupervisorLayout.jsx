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

  async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    let headers = options.headers || {};
    headers['Authorization'] = `Bearer ${accessToken}`;
    options.headers = headers;

    let response = await fetch(url, options);

    if (response.status === 401) {
      const refreshRes = await fetch('http://amjad-hamidi-tms.runasp.net/api/Account/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        options.headers = headers;
        return fetch(url, options);
      } else {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired, please login again.');
      }
    }

    return response;
  }

  return (
    <div className={`supervisor-layout ${collapsed ? "collapsed" : ""}`}>
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-chalkboard-teacher"></i> Supervisor</h2>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/supervisor" end><i className="fas fa-home"></i><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorProfile"><i className="fas fa-user-tie"></i><span>Profile</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorPrograms"><i className="fas fa-book-open"></i><span>Programs</span></NavLink></li>
          <li><NavLink to="/supervisor/STraineesList"><i className="fas fa-users"></i><span>Trainees</span></NavLink></li>
                    <li><NavLink to="/supervisor/CompaniesTrainees"><i className="fas fa-user-tie"></i><span>Companies&Trainees</span></NavLink></li>

          <li><NavLink to="/supervisor/SupervisorFeedback"><i className="fas fa-comments"></i><span>Feedback</span></NavLink></li>
          <li><NavLink to="/supervisor/SupervisorFeedbacks"><i className="fas fa-comments"></i><span>my sent Feedback</span></NavLink></li>
        </ul>
      </nav>

      {/* Toggle button */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1001 }}>
        <Button
          variant="contained"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
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
