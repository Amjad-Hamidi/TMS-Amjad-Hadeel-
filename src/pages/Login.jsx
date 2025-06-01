import React, { useState, useEffect } from "react";
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
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import logo from '../images/TMS Logo.png'; // Place the provided image as logo.png in src/

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        const errorData = await response.json();
        const apiErrorMessage = errorData.message;
        setErrorMessage(apiErrorMessage);
        return;
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
            Welcome Back to TMS
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 350, mx: 'auto' }}>
            Sign in to your account to continue.
          </Typography>
        </Box>
      </Grid>
      {/* Form Side */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={isMobile ? 0 : 6} sx={{ width: '100%', maxWidth: 420, p: { xs: 2, md: 6 }, borderRadius: 4, boxShadow: isMobile ? 'none' : undefined, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar src={logo} alt="TMS Logo" sx={{ width: 48, height: 48, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary">Sign in</Typography>
          </Box>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            margin="normal"
            autoComplete="email"
          />
          <TextField
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" aria-label="toggle password visibility">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexBasis: '66.66%' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <Typography variant="body2" htmlFor="rememberMe" sx={{ fontSize: '1.1rem' }}>
                Remember me
              </Typography>
            </Box>
            <Button variant="text" size="small" onClick={() => navigate('/forgetPassword')} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Forgot password?
            </Button>
          </Box>
          <Button onClick={handleLogin} variant="contained" color="primary" fullWidth size="large" sx={{ mt: 3, mb: 1, borderRadius: 2, fontWeight: 600 }}>
            Sign in
          </Button>
          <Button variant="outlined" color="inherit" fullWidth startIcon={<Google />} sx={{ textTransform: 'none', borderRadius: 2, mb: 2 }} onClick={() => alert('Google login not implemented.')}>Sign in with Google</Button>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            Don't have an account?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/register')} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Register
            </Button>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}