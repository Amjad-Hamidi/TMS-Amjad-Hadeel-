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
  Alert,
  CssBaseline, // <--- هام جداً لتناسق الـ Material-UI
  AppBar,
  Toolbar,
  CardMedia,
  Modal,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Brightness7 as Brightness7Icon, // أيقونة للوضع النهاري
  Brightness2 as Brightness2Icon, // أيقونة للوضع الليلي
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
// Navigation Icons (يمكن تعديلها حسب الحاجة)
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArticleIcon from "@mui/icons-material/Article";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import logo from "../images/TMS Logo.png";
import qrImage from "../images/QR Code-TMS.png";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [darkMode, setDarkMode] = useState(false); // <--- حالة الـ Dark Mode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showQR, setShowQR] = useState(false); // حالة لإظهار/إخفاء QR في الـ footer
  const [isQRModalOpen, setQRModalOpen] = useState(false); // حالة لفتح/إغلاق Modal الـ QR
  const [isLogoModalOpen, setLogoModalOpen] = useState(false); // حالة لفتح/إغلاق Modal الشعار

  // عناصر التنقل للـ AppBar
  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Features", icon: <ExtensionIcon />, path: "/#features" },
    { label: "Blog", icon: <ArticleIcon />, path: "/#blog" },
    { label: "Contact", icon: <ContactMailIcon />, path: "/#contact" },
  ];

  useEffect(() => {
    // تحديث لون خلفية الجسم ولون النص بناءً على وضع الـ Dark Mode
    document.body.style.backgroundColor = darkMode ? "#121212" : "#fafafa";
    document.body.style.color = darkMode ? "#eee" : "#212121";

    // التحقق من وجود التوكنات لإعادة التوجيه التلقائي
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    if (accessToken && refreshToken && role) {
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
  }, [navigate, darkMode]); // إضافة darkMode للـ dependencies لكي يتفاعل useEffect مع تغيره

  // ********** دالة تسجيل الدخول - تم الحفاظ على صيغتها التي لا تسبب refresh **********
  const handleLogin = async () => {
    setErrorMessage(""); // مسح أي رسائل خطأ سابقة

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      console.log("Validation error: Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://amjad-hamidi-tms.runasp.net/api/Account/Login",
        {
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Login failed due to invalid credentials."
        );
        console.error("Login API error:", errorData.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
      console.log("Login successful, redirecting...");

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
          navigate("/dashboard");
          break;
      }
    } catch (error) {
      setErrorMessage(
        "Login failed: " + (error.message || "An unexpected error occurred.")
      );
      console.error("Network or unexpected error:", error);
    }
  };

  // دالة للتعامل مع ضغط Enter في حقول الإدخال
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#fafafa", // <--- تطبيق Dark Mode
        color: darkMode ? "#eee" : "#212121", // <--- تطبيق Dark Mode
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <CssBaseline /> {/* <--- هام جداً لإعادة تعيين CSS بشكل أساسي */}
      {/* ===== Navbar ===== */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: darkMode ? "#1a1a1a" : "#fff", // <--- تطبيق Dark Mode
          color: darkMode ? "#eee" : "#000", // <--- تطبيق Dark Mode
          boxShadow: darkMode
            ? "0 2px 4px rgba(255,255,255,0.05)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          transition: "0.3s",
          marginBottom: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Navigation Buttons (Left Side) */}
          <Box>
            {navItems.map(({ label, icon, path }) => (
              <Button
                key={label}
                href={path}
                startIcon={icon}
                sx={{
                  mx: 0.5,
                  color: darkMode ? "#e0e0e0" : "#212121", // <--- تطبيق Dark Mode
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0", // <--- تطبيق Dark Mode
                    color: darkMode ? "#90caf9" : "#1976d2", // <--- تطبيق Dark Mode
                  },
                  transition: "0.3s",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
          {/* Auth & Dark Mode Buttons (Right Side) */}
          <Box>
            <Button
              startIcon={<DescriptionIcon />}
              href="https://tugesucj.manus.space/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mx: 0.5,
                color: darkMode ? "#80cbc4" : "#00838f",
                "&:hover": {
                  bgcolor: darkMode ? "#2e2e2e" : "#e0f2f7",
                  color: darkMode ? "#a7ffeb" : "#00bfa5",
                },
                transition: "0.3s",
              }}
            >
              Build CV
            </Button>

            <Button
              startIcon={<PersonAddIcon />}
              href="/register"
              sx={{
                mx: 0.5,
                color: darkMode ? "#a5d6a7" : "#388e3c", // <--- تطبيق Dark Mode
                "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#e8f5e9" }, // <--- تطبيق Dark Mode
              }}
            >
              Register
            </Button>
            <Button
              startIcon={<LoginIcon />}
              href="/login"
              sx={{
                mx: 0.5,
                color: darkMode ? "#ffab91" : "#d84315", // <--- تطبيق Dark Mode
                "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#ffebee" }, // <--- تطبيق Dark Mode
              }}
            >
              Login
            </Button>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <Brightness7Icon sx={{ color: "#ffd54f" }} />
              ) : (
                <Brightness2Icon sx={{ color: "#1976d2" }} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content Grid for Login Form */}
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Illustration/Logo Side */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 60%, ${theme.palette.secondary.light} 100%)`,
            borderRadius: isMobile ? 0 : "0 40px 40px 0",
            p: 4,
            ...(darkMode && {
              // <--- تطبيق Dark Mode
              background: `linear-gradient(135deg, #333 60%, #555 100%)`,
            }),
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="TMS Logo"
              style={{
                width: isMobile ? 120 : 200,
                borderRadius: "30%",
                marginBottom: 24,
                boxShadow: theme.shadows[4],
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => setLogoModalOpen(true)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <Typography
              variant={isMobile ? "h5" : "h3"}
              fontWeight={700}
              color={darkMode ? "white" : "primary"}
              sx={{ mb: 2 }}
            >
              {" "}
              {/* <--- تطبيق Dark Mode */}
              Welcome Back to TMS
            </Typography>
            <Typography
              variant="h6"
              color={darkMode ? "lightgray" : "text.secondary"}
              sx={{ maxWidth: 350, mx: "auto" }}
            >
              {" "}
              {/* <--- تطبيق Dark Mode */}
              Sign in to your account to continue.
            </Typography>
          </Box>
        </Grid>

        {/* Form Side */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Paper
            elevation={isMobile ? 0 : 6}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: { xs: 2, md: 6 },
              borderRadius: 4,
              boxShadow: isMobile ? "none" : undefined,
              mx: "auto",
              bgcolor: darkMode ? "#1a1a1a" : "#fff", // <--- تطبيق Dark Mode
              color: darkMode ? "#eee" : "#212121", // <--- تطبيق Dark Mode
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={logo}
                alt="TMS Logo"
                sx={{ width: 48, height: 48, mr: 1 }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                color={darkMode ? "white" : "primary"}
              >
                Sign in
              </Typography>{" "}
              {/* <--- تطبيق Dark Mode */}
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <TextField
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown} // <--- تم الإبقاء على هذا
              fullWidth
              margin="normal"
              autoComplete="email"
              required
              InputLabelProps={{
                style: { color: darkMode ? "#bbb" : "inherit" },
              }} // <--- تطبيق Dark Mode
              InputProps={{
                style: { color: darkMode ? "#eee" : "inherit" }, // <--- تطبيق Dark Mode
                sx: {
                  "& .MuiOutlinedInput-input": {
                    backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                    color: darkMode ? "#eee" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#555" : "rgba(0, 0, 0, 0.23)",
                    }, // <--- تطبيق Dark Mode
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    }, // <--- تطبيق Dark Mode
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    }, // <--- تطبيق Dark Mode
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                },
              }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown} // <--- تم الإبقاء على هذا
              fullWidth
              margin="normal"
              autoComplete="current-password"
              required
              InputLabelProps={{
                style: { color: darkMode ? "#bbb" : "inherit" },
              }} // <--- تطبيق Dark Mode
              InputProps={{
                style: { color: darkMode ? "#eee" : "inherit" }, // <--- تطبيق Dark Mode
                sx: {
                  "& .MuiOutlinedInput-input": {
                    backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                    color: darkMode ? "#eee" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#555" : "rgba(0, 0, 0, 0.23)",
                    }, // <--- تطبيق Dark Mode
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    }, // <--- تطبيق Dark Mode
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    }, // <--- تطبيق Dark Mode
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{ color: darkMode ? "#bbb" : "rgba(0, 0, 0, 0.54)" }} // <--- تطبيق Dark Mode
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: darkMode ? "#2d2d2d" : "#fff", // <--- تطبيق Dark Mode
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexBasis: "66.66%",
                }}
              >
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    marginRight: 8,
                    accentColor: darkMode ? theme.palette.primary.main : "auto",
                  }} // <--- تطبيق Dark Mode
                />
                <Typography
                  variant="body2"
                  htmlFor="rememberMe"
                  sx={{
                    fontSize: "1.1rem",
                    color: darkMode ? "#bbb" : "inherit",
                  }}
                >
                  {" "}
                  {/* <--- تطبيق Dark Mode */}
                  Remember me
                </Typography>
              </Box>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/forgetPassword")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: darkMode
                    ? theme.palette.info.light
                    : theme.palette.primary.main, // <--- تطبيق Dark Mode
                  "&:hover": {
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(25,118,210,0.04)", // <--- تطبيق Dark Mode
                  },
                }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              onClick={handleLogin} // <--- تم الإبقاء على هذا
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                mb: 1,
                borderRadius: 2,
                fontWeight: 600,
                bgcolor: darkMode
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main, // <--- تطبيق Dark Mode
                "&:hover": {
                  bgcolor: darkMode
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
                }, // <--- تطبيق Dark Mode
              }}
            >
              Sign in
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              startIcon={<Google />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                mb: 2,
                borderColor: darkMode ? "#555" : "rgba(0, 0, 0, 0.23)", // <--- تطبيق Dark Mode
                color: darkMode ? "#eee" : "inherit", // <--- تطبيق Dark Mode
                "&:hover": {
                  borderColor: darkMode ? "#777" : "inherit",
                  bgcolor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                }, // <--- تطبيق Dark Mode
              }}
              onClick={() => alert("Google login not implemented.")}
            >
              Sign in with Google
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                mt: 1,
                color: darkMode ? "#bbb" : "inherit",
              }}
            >
              {" "}
              {/* <--- تطبيق Dark Mode */}
              Don't have an account?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/register")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: darkMode
                    ? theme.palette.info.light
                    : theme.palette.primary.main, // <--- تطبيق Dark Mode
                  "&:hover": {
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(25,118,210,0.04)", // <--- تطبيق Dark Mode
                  },
                }}
              >
                Register
              </Button>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Modal for TMS Logo (Clickable Image with X button) */}
      <Modal
        open={isLogoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(5px)",
          bgcolor: "rgba(0,0,0,0.7)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90%",
            maxHeight: "90%",
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setLogoModalOpen(false)}
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              bgcolor: darkMode ? "#333" : "#fff", // <--- تطبيق Dark Mode
              color: darkMode ? "#f48fb1" : "#d32f2f", // <--- تطبيق Dark Mode
              "&:hover": {
                bgcolor: darkMode ? "#f06292" : "#f44336", // <--- تطبيق Dark Mode
                transform: "rotate(45deg) scale(1.2)",
              },
              boxShadow: darkMode
                ? "0 0 12px rgba(255,105,135,0.5)"
                : "0 0 8px rgba(244,67,54,0.3)", // <--- تطبيق Dark Mode
              transition: "all 0.3s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            src={logo}
            alt="Full TMS Logo"
            sx={{
              borderRadius: 3,
              maxWidth: "100%",
              maxHeight: "80vh",
              boxShadow: darkMode
                ? "0 0 25px rgba(144,202,249,0.6)"
                : "0 0 25px rgba(0,0,0,0.2)", // <--- تطبيق Dark Mode
              animation: "zoomIn 0.4s ease-out",
            }}
          />
        </Box>
      </Modal>
      {/* ===== Footer (Contact + Share + Signature) ===== */}
      <Box
        id="contact"
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1c1c1c, #3a3a3a)"
            : "linear-gradient(135deg, #a7d9ff, #c6e7ff)", // <--- تطبيق Dark Mode
          color: darkMode ? "#fff" : "#333", // <--- تطبيق Dark Mode
          mt: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle in footer */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            bgcolor: darkMode ? "#444" : "#e0f2f7", // <--- تطبيق Dark Mode
            borderRadius: "50%",
            animation: "pulseCircle 4s infinite ease-in-out",
          }}
        />
        <Typography variant="h5" gutterBottom>
          📬 Stay Connected
        </Typography>
        <Typography variant="body1">
          Got questions? Reach out anytime!
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            fontSize: 30,
            mb: 2,
          }}
        >
          <IconButton
            href="mailto:tms.contactus1@gmail.com"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .1s",
            }}
          >
            <EmailIcon />
          </IconButton>{" "}
          {/* <--- تطبيق Dark Mode */}
          <IconButton
            href="https://www.linkedin.com/in/amjad-hamidi/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .5s",
            }}
          >
            <LinkedInIcon />
          </IconButton>{" "}
          {/* <--- تطبيق Dark Mode */}
          <IconButton
            href="https://www.instagram.com/amjada871/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .7s",
            }}
          >
            <InstagramIcon />
          </IconButton>{" "}
          {/* <--- تطبيق Dark Mode */}
          <IconButton
            href="https://www.facebook.com/AmjadHamidi01/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .9s",
            }}
          >
            <FacebookIcon />
          </IconButton>{" "}
          {/* <--- تطبيق Dark Mode */}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Check out TMS!",
                  text: "Explore the Training Management System (TMS) – where tech talents are born!",
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied! Share it anywhere you like.");
              }
            }}
            sx={{
              color: darkMode ? "#fff" : "#1976d2", // <--- تطبيق Dark Mode
              borderColor: darkMode ? "#fff" : "#1976d2", // <--- تطبيق Dark Mode
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(25,118,210,0.1)",
              }, // <--- تطبيق Dark Mode
              transition: "0.3s",
            }}
          >
            Share Website
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowQR((q) => !q)}
            sx={{
              color: darkMode ? "#fff" : "#1976d2", // <--- تطبيق Dark Mode
              borderColor: darkMode ? "#fff" : "#1976d2", // <--- تطبيق Dark Mode
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(25,118,210,0.1)",
              }, // <--- تطبيق Dark Mode
              transition: "0.3s",
            }}
          >
            {showQR ? "Hide QR" : "Show QR"}
          </Button>
        </Box>
        {showQR && (
          <Box sx={{ mt: 2, animation: "fadeIn 0.6s ease-in" }}>
            <CardMedia
              component="img"
              src={qrImage}
              alt="QR Code"
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                mx: "auto",
                cursor: "pointer",
                borderRadius: 2,
                boxShadow: darkMode
                  ? "0 0 12px rgba(144,202,249,0.4)"
                  : "0 0 10px rgba(0,0,0,0.2)", // <--- تطبيق Dark Mode
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: darkMode
                    ? "0 0 25px rgba(144,202,249,0.6)"
                    : "0 0 20px rgba(0,0,0,0.3)", // <--- تطبيق Dark Mode
                },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onClick={() => setQRModalOpen(true)}
            />
          </Box>
        )}
        {/* Modal for QR Code */}
        {isQRModalOpen && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              animation: "fadeIn 0.5s ease-in",
              backdropFilter: "blur(5px)",
            }}
            onClick={() => setQRModalOpen(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "relative",
                maxWidth: "90%",
                maxHeight: "90%",
                outline: "none",
              }}
            >
              <IconButton
                onClick={() => setQRModalOpen(false)}
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  bgcolor: darkMode ? "#333" : "#fff", // <--- تطبيق Dark Mode
                  color: darkMode ? "#f48fb1" : "#d32f2f", // <--- تطبيق Dark Mode
                  "&:hover": {
                    bgcolor: darkMode ? "#f06292" : "#f44336", // <--- تطبيق Dark Mode
                    transform: "rotate(45deg) scale(1.2)",
                  },
                  boxShadow: darkMode
                    ? "0 0 12px rgba(255,105,135,0.5)"
                    : "0 0 8px rgba(244,67,54,0.3)", // <--- تطبيق Dark Mode
                  transition: "all 0.3s ease",
                }}
              >
                <CloseIcon />
              </IconButton>
              <CardMedia
                component="img"
                src={qrImage}
                alt="Full QR"
                sx={{
                  borderRadius: 3,
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  boxShadow: darkMode
                    ? "0 0 25px rgba(144,202,249,0.6)"
                    : "0 0 25px rgba(0,0,0,0.2)", // <--- تطبيق Dark Mode
                  animation: "zoomIn 0.4s ease-out",
                }}
              />
            </Box>
          </Box>
        )}

        {/* ===== Footer Signature ===== */}
        <Box
          sx={{ mt: 4, textAlign: "center", animation: "fadeIn 1s ease-in" }}
        >
          {/* CRITICAL FIX FOR HTML NESTING ERROR:
                        Typography by default renders as <p> for "body2".
                        <p> cannot contain a <div>.
                        We change it to render as a <span> or a <div> to allow it to contain the inner Box.
                        Using 'span' as it's more semantically correct if it's primarily text flow.
                    */}
          <Typography
            variant="body2"
            component="span" // <--- هذا هو التغيير الحاسم لمنع أخطاء الـ HTML nesting (hydration)
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              color: darkMode ? "#90caf9" : "#333", // <--- تطبيق Dark Mode
              fontWeight: 500,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover .signature-text": {
                  textDecoration: "underline",
                  color: darkMode ? "#bbdefb" : "#42a5f5", // <--- تطبيق Dark Mode
                  transition: "0.3s ease",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  color: darkMode ? "#f48fb1" : "#d84315", // <--- تطبيق Dark Mode
                }}
              >
                Made with
                <span
                  style={{
                    display: "inline-block",
                    margin: "0 5px",
                    animation: "beatHeart 1.5s infinite",
                  }}
                >
                  ❤️
                </span>{" "}
                by
              </Box>

              <Box
                component="a"
                href="https://github.com/Amjad-Hamidi"
                target="_blank"
                rel="noopener noreferrer"
                className="signature-text"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "1rem",
                  color: darkMode ? "#90caf9" : "#1976d2", // <--- تطبيق Dark Mode
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  component="img"
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  sx={{
                    width: 22,
                    height: 22,
                    opacity: 0.9,
                    transition: "transform 0.4s ease",
                    "&:hover": {
                      transform: "rotate(15deg) scale(1.2)",
                      opacity: 1,
                    },
                  }}
                />
                Amjad Hamidi
              </Box>

              <svg
                width="50"
                height="25"
                viewBox="0 0 100 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: 4 }}
              >
                <path
                  d="M0 20 C20 0, 30 30, 50 20 S80 0, 100 20"
                  stroke={darkMode ? "#90caf9" : "#1976d2"}
                  strokeWidth="1.2"
                  fill="transparent"
                />{" "}
                {/* <--- تطبيق Dark Mode */}
              </svg>

              <Box
                component="a"
                href="https://github.com/hadeel-404"
                target="_blank"
                rel="noopener noreferrer"
                className="signature-text"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "1rem",
                  color: darkMode ? "#90caf9" : "#1976d2", // <--- تطبيق Dark Mode
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  component="img"
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  sx={{
                    width: 22,
                    height: 22,
                    opacity: 0.9,
                    transition: "transform 0.4s ease",
                    "&:hover": {
                      transform: "rotate(15deg) scale(1.2)",
                      opacity: 1,
                    },
                  }}
                />
                Hadeel Hamdan
              </Box>

              <svg
                width="50"
                height="25"
                viewBox="0 0 100 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: 4 }}
              >
                <path
                  d="M0 20 C20 0, 30 30, 50 20 S80 0, 100 20"
                  stroke={darkMode ? "#90caf9" : "#1976d2"}
                  strokeWidth="1.2"
                  fill="transparent"
                />{" "}
                {/* <--- تطبيق Dark Mode */}
              </svg>
            </Box>
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: darkMode ? "#cccccc" : "#616161", // <--- تطبيق Dark Mode
            }}
          >
            © 2025 | All Rights Reserved.
          </Typography>
          <style>{`
                        @keyframes beatHeart {
                            0%,100%{transform:scale(1);}
                            50%{transform:scale(1.3);}
                        }
                    `}</style>
        </Box>
      </Box>
      {/* ===== Global Animations (Moved here for accessibility) ===== */}
      <style>{`
                @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.07);} }
                @keyframes fadeSection {0%{opacity:0;}100%{opacity:1;} }
                @keyframes pulseCircle {0%,100%{transform:scale(1);opacity:0.6;}50%{transform:scale(1.3);opacity:0.3;} }
                @keyframes iconPulse {0%,100%{transform:scale(1);}50%{transform:scale(1.3);} }
                @keyframes fadeIn {from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);}}
                @keyframes zoomIn {from{transform:scale(0.7);opacity:0;} to{transform:scale(1);opacity:1;}}
            `}</style>
    </Box>
  );
}
