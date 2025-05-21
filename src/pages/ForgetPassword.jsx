import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1); // Step 1: Send Code, Step 2: Reset Password
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendCode = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code.");
      }

      setSuccessMessage("Verification code sent to your email.");
      setStep(2);
    } catch (error) {
      setErrorMessage("Error: " + error.message);
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !code || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/send-code", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      setSuccessMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage("Error: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Reset Password</h2>

        {errorMessage && <div className="error-box">{errorMessage}</div>}
        {successMessage && <div className="success-box">{successMessage}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {step === 1 && (
          <button onClick={handleSendCode}>Send Verification Code</button>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}

        <p className="register-text">
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
