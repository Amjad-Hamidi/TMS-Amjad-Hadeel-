import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import logo from '../images/TMS Logo.png'; // Place the provided image as logo.png in src/

export default function ForgetPassword() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Grid container sx={{ minHeight: '100vh', background: theme.palette.background.default, transition: 'background 0.3s' }}>
      {/* Illustration/Logo Side */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 60%, ${theme.palette.secondary.light} 100%)`,
        borderRadius: isMobile ? 0 : '0 40px 40px 0',
        p: 4,
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={logo} alt="TMS Logo" style={{ width: isMobile ? 120 : 200, borderRadius: '30%', marginBottom: 24, boxShadow: theme.shadows[4] }} />
          <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight={700} color="primary" sx={{ mb: 2 }}>
            Reset Your Password
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 350, mx: 'auto' }}>
            Enter your email to receive a verification code and reset your password.
          </Typography>
        </Box>
      </Grid>
      {/* Form Side */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={isMobile ? 0 : 6} sx={{ width: '100%', maxWidth: 420, p: { xs: 2, md: 6 }, borderRadius: 4, boxShadow: isMobile ? 'none' : undefined, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar src={logo} alt="TMS Logo" sx={{ width: 48, height: 48, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary">Reset Password</Typography>
          </Box>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="email"
          />
          {step === 1 && (
            <Button onClick={handleSendCode} variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, mb: 1, borderRadius: 2, fontWeight: 600 }}>
              Send Verification Code
            </Button>
          )}
          {step === 2 && (
            <>
              <TextField
                type="text"
                label="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleResetPassword} variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, mb: 1, borderRadius: 2, fontWeight: 600 }}>
                Reset Password
              </Button>
            </>
          )}
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            Back to{' '}
            <Button variant="text" size="small" onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Login
            </Button>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
