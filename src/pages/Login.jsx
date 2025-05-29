import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    if (accessToken && refreshToken && role) {
      // Redirect to dashboard based on role
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Supervisor":
          navigate("/supervisor");
          break;
        case "Trainee":
          navigate("/trainee");
          break;
        case "Company":
          navigate("/company");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // حفظ التوكنات والـ role
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);

      // توجيه حسب الدور
      switch (data.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Supervisor":
          navigate("/supervisor");
          break;
        case "Trainee":
          navigate("/trainee");
          break;
        case "Company":
          navigate("/company");
          break;
        default:
          navigate("/dashboard"); // fallback
          break;
      }
    } catch (error) {
      setErrorMessage("Login failed: " + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {errorMessage && <div className="error-box">{errorMessage}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        <button onClick={handleLogin}>Log In</button>

        <div className="forgot-password">
          <a href="/forgetPassword">Forgot password?</a>
        </div>

        <p className="register-text">
          Not registered? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
}
