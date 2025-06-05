import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Guest.css";
import logo from "../images/TMS Logo.png";

export default function GuestPage() {
  const navigate = useNavigate();

  return (
    <div className="guest-container">
      <header className="guest-header">
        {/* عرض الشعار بدلاً من النص */}
        <img
          src={logo}
          alt="TMS Logo"
          className="logo"
        />
        <p className="tagline">Not just training. A launchpad to your dream career 🚀</p>
        <p className="description">Join thousands of learners upgrading their skills in top-demand fields.</p>

        {/* أزرار الدخول والتسجيل */}
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
        </div>
      </header>
    </div>
  );
}
