// src/pages/GuestPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Chip,
  Fade,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Brightness7 as Brightness7Icon,
  Brightness2 as Brightness2Icon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  School as SchoolIcon,
  Public as PublicIcon,
  Person as PersonIcon,
  SupervisorAccount as SupervisorIcon,
  Business as CompanyIcon,
  LaptopMac as OnlineIcon,
  LocationCity as SiteIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AssignmentTurnedIn as IdIcon,
  TextFields as NameIcon,
  Notes as DescriptionTextIcon,
  Psychology as SkillsIcon,
  FormatListNumbered as TotalCountIcon,
  Layers as PageIcon,
  AspectRatio as LimitIcon,
  ImportContacts as TotalPagesIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArticleIcon from "@mui/icons-material/Article";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import qrImage from "../images/QR Code-TMS.png";
import logo from "../images/TMS Logo.png";
import introVideo from "../videos/Intro-TMS.mp4";

export default function GuestPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState({});
  const [showQR, setShowQR] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const typedRef = useRef(null);

  // Pagination and Search state as requested by the user
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10); // Keeping limit constant for now, based on previous code
  const [searchTerm, setSearchTerm] = useState(""); // Not actively used for filtering categories in this current code, but kept as per user's request
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Not actively used for filtering categories in this current code, but kept as per user's request

  // State for Categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [categorySearch, setCategorySearch] = useState(""); // This is the actual search term used for API

  // State for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: "", alt: "" });

  const navItems = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "Features", icon: <ExtensionIcon /> },
    { label: "Categories", icon: <CategoryIcon /> },
    { label: "Blog", icon: <ArticleIcon /> },
    { label: "Contact", icon: <ContactMailIcon /> },
  ];

  const stats = [
    { icon: <SchoolIcon />, label: "Graduates", count: 5000 },
    { icon: <PublicIcon />, label: "Countries", count: 15 },
    { icon: <PersonIcon />, label: "Trainees", count: 2000 },
    { icon: <SupervisorIcon />, label: "Supervisors", count: 120 },
    { icon: <CompanyIcon />, label: "Companies", count: 300 },
    { icon: <OnlineIcon />, label: "Online Courses", count: 200 },
    { icon: <SiteIcon />, label: "Site Courses", count: 100 },
  ];

  const testimonials = [
    {
      author: "Maya (Trainee)",
      text: "Landed a top-tier internship after completing two projects on TMS!",
    },
    {
      author: "Omar (Trainee)",
      text: "TMS gave me the clarity & confidence to pivot into tech.",
    },
    {
      author: "TechBridge Inc. (Company)",
      text: "TMS grads matched our hiring needs with precision.",
    },
    {
      author: "Dr. Yasmine (Supervisor)",
      text: "I manage dozens of trainees with full visibility & real-time feedback.",
    },
  ];

  const features = [
    {
      title: "👤 Guest Access",
      desc: "Open exploration of training categories and general program overviews, enabling first-time users to navigate offerings without registration.",
    },
    {
      title: "🎓 Trainee Portal",
      desc: "Comprehensive profile building, CV upload, and seamless access to approved programs, with integrated submission tools for tasks, projects, and feedback cycles to support continuous personal development.",
    },
    {
      title: "🏢 Company Tools",
      desc: "End-to-end management of training programs, including structured creation flows, status tracking, supervisor assignment, and streamlined application review dashboards.",
    },
    {
      title: "🧑‍🏫 Supervisor Dashboard",
      desc: "Centralized hub for managing assigned programs with capabilities for task and project assignment, trainee tracking, and performance evaluation mechanisms.",
    },
    {
      title: "🛠️ Admin Control Panel",
      desc: "Platform-wide user moderation, role oversight, category management, and program approval infrastructure ensuring policy alignment and operational integrity.",
    },
    {
      title: "💬 Feedback & Assessment Engine",
      desc: "Dynamic channels for structured, role-based feedback exchange, project assessments, and performance insights to elevate training quality and stakeholder collaboration.",
    },
  ];

  const articleData = [
    {
      title: "2025: The Year of AI-Centric Careers",
      details:
        "Explore how AI is reshaping job markets and the vital skills professionals need to stay ahead through TMS-supported programs.",
    },
    {
      title: "How 5000+ Learners Transformed via TMS",
      details:
        "Real success stories highlighting how trainees advanced their careers through personalized training paths on TMS.",
    },
    {
      title: "React Projects That Land Jobs — A 4‑Week Challenge",
      details:
        "Discover our intensive frontend challenge designed to simulate real-world scenarios, ideal for building a job-ready portfolio.",
    },
    {
      title: "From Feedback to Growth: The Power of Reflection",
      details:
        "See how our feedback system fuels continuous development for both trainees and companies.",
    },
    {
      title: "TMS & The Skills Revolution: What’s Next?",
      details:
        "Gain insight into emerging trends in tech education and how TMS stays ahead through innovation.",
    },
    {
      title: "Career-Ready Soft Skills You Must Master",
      details:
        "Learn why communication, collaboration, and adaptability are as vital as coding in today’s tech world.",
    },
  ];

  const partners = [
    "Partnered with Global Tech Hubs",
    "Endorsed by Innovation‑Driven Companies",
    "Linked with High‑Impact Hiring Networks",
    "Accelerating Careers with Strategic Alliances",
    "Backed by Leading Industry Mentors",
    "Powering Talent for the Digital Future",
  ];

  const toggleDetails = (index) => {
    setExpandedArticles((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const fetchWithAuth = useCallback(async (url, options) => {
    return fetch(url, options);
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const url = `https://amjad-hamidi-tms.runasp.net/api/Categories?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
        categorySearch
      )}`;
      const res = await fetchWithAuth(url, {
        headers: { Accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data.items) ? data.items : []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
      // Removed setCategoriesMeta as per new state structure
    } catch (err) {
      console.error("Error fetching categories:", err);
      setErrorCategories("Failed to load categories. Please try again later.");
    } finally {
      setLoadingCategories(false);
    }
  }, [currentPage, limit, categorySearch, fetchWithAuth]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, currentPage]); // Added currentPage to dependency array to refetch on page change

  // --- Handle Pagination Change ---
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleImageClick = (imageUrl, categoryName) => {
    setCurrentImage({
      src: imageUrl,
      alt: `Image for ${categoryName}`,
    });
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImage({ src: "", alt: "" });
  };

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#fafafa";
    document.body.style.color = darkMode ? "#eee" : "#212121";

    if (window.Typed && typedRef.current) {
      const typed = new window.Typed(typedRef.current, {
        strings: [
          "🚀 TMS: Where Tech Talents Are Born.",
          "🌍 Empowering the Next Million Developers.",
        ],
        typeSpeed: 45,
        backSpeed: 25,
        backDelay: 1500,
        loop: true,
        cursorChar: "|",
      });
      return () => typed.destroy();
    }
  }, [darkMode]);

  return (
    <>
      <CssBaseline />
      {/* ===== Navbar ===== */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: darkMode ? "#1a1a1a" : "#fff",
          color: darkMode ? "#eee" : "#000",
          boxShadow: darkMode
            ? "0 2px 4px rgba(255,255,255,0.05)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          transition: "0.3s",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            {navItems.map(({ label, icon }) => (
              <Button
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, "")}`}
                startIcon={icon}
                sx={{
                  mx: 0.5,
                  color: darkMode ? "#e0e0e0" : "#212121",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0",
                    color: darkMode ? "#90caf9" : "#1976d2",
                  },
                  transition: "0.3s",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
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
                color: darkMode ? "#a5d6a7" : "#388e3c",
                "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#e8f5e9" },
              }}
            >
              Register
            </Button>
            <Button
              startIcon={<LoginIcon />}
              href="/login"
              sx={{
                mx: 0.5,
                color: darkMode ? "#ffab91" : "#d84315",
                "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#ffebee" },
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

      {/* ===== Hero ===== */}
      <Container
        id="home"
        sx={{
          textAlign: "center",
          py: 4,
          opacity: 0,
          animation: "fadeSection 0.8s forwards",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="TMS Logo"
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            animation: "pulse 1.8s infinite ease-in-out",
            boxShadow: darkMode ? "0 0 20px #90caf9" : "0 0 20px #82b1ff",
            cursor: "pointer",
            "&:hover": { transform: "scale(1.05)", transition: "0.4s" },
          }}
          onClick={() => setIsModalOpen(true)}
        />
        <Typography
          variant="h4"
          sx={{ mt: 2, opacity: 0, animation: "fadeSection 1s 0.3s forwards" }}
        >
          🚀 Launchpad for Your Dream Tech Career
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, opacity: 0, animation: "fadeSection 1s 0.5s forwards" }}
        >
          Join thousands upgrading skills in in‑demand fields.
        </Typography>
        <Box
          sx={{
            fontSize: "1.25rem",
            color: darkMode ? "#90caf9" : "#1976d2",
            opacity: 0,
            animation: "fadeSection 1s 0.7s forwards",
          }}
        >
          <span ref={typedRef}></span>
        </Box>
      </Container>

      {/* ===== Logo Modal ===== */}
      {isModalOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              maxWidth: "90%",
              opacity: 0,
              animation: "fadeSection 0.5s forwards",
            }}
          >
            <IconButton
              onClick={() => setIsModalOpen(false)}
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                bgcolor: darkMode ? "#292929" : "#fafafa",
                color: darkMode ? "#ff8a65" : "#d32f2f",
                "&:hover": {
                  bgcolor: darkMode ? "#ff7043" : "#f44336",
                  transform: "rotate(45deg) scale(1.1)",
                },
                boxShadow: darkMode
                  ? "0 0 12px rgba(255,112,67,0.7)"
                  : "0 0 8px rgba(211,47,47,0.3)",
                transition: "0.3s",
              }}
            >
              <CloseIcon />
            </IconButton>
            <CardMedia
              component="img"
              src={logo}
              alt="TMS logo expanded"
              sx={{
                borderRadius: 3,
                boxShadow: "0 0 20px rgba(0,0,0,0.2)",
              }}
            />
          </Box>
        </Box>
      )}

      {/* ===== Stats + Testimonials ===== */}
      <Container
        id="stats-stories"
        sx={{ py: 4, opacity: 0, animation: "fadeSection 1s 0.2s forwards" }}
      >
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {stats.map((s, i) => (
            <Grid
              key={i}
              item
              xs={6}
              sm={4}
              md={2}
              sx={{
                textAlign: "center",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: darkMode
                    ? "0 0 25px rgba(144,202,249,0.5)"
                    : "0 0 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  bgcolor: darkMode ? "#1e1e1e" : "#f0f0f0",
                  color: darkMode ? "#29b6f6" : "#1976d2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: darkMode
                    ? "0 0 15px rgba(41,182,246,0.5)"
                    : "0 0 10px rgba(25,118,210,0.3)",
                }}
              >
                {s.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{ mt: 1, color: darkMode ? "#eef7ff" : "#212121" }}
              >
                +{s.count}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: darkMode ? "#b0bec5" : "#555" }}
              >
                {s.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3 }}>
          🎓 Success Stories from All Roles
        </Typography>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: darkMode ? "#1c1c1c" : "#fff",
                  color: darkMode ? "#eef7ff" : "#212121",
                  boxShadow: darkMode
                    ? "0 0 20px rgba(144,202,249,0.3)"
                    : "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Typography sx={{ fontStyle: "italic", mb: 1 }}>
                    "{t.text}"
                  </Typography>
                  <Typography fontWeight="bold">— {t.author}</Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* ===== What We Offer ===== */}
      <Container id="features" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          🎯 What We Offer
        </Typography>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={15}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 4000 }}
          loop
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          {features.map((f, i) => (
            <SwiperSlide key={i}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: darkMode ? "#212121" : "#f5f5f5",
                  color: darkMode ? "#e0f7fa" : "#01579b",
                  boxShadow: darkMode
                    ? "0 0 15px rgba(144,202,249,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: darkMode
                      ? "0 0 25px rgba(144,202,249,0.4)"
                      : "0 0 12px rgba(0,0,0,0.2)",
                  },
                  textAlign: "center",
                  transition: "0.3s ease",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {f.desc}
                </Typography>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* ===== Categories Section ===== */}
      <Container id="categories" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 4, background: darkMode ? "#1c1c1c" : "#fff" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: darkMode ? "#eee" : "#333" }}
            >
              Categories
            </Typography>
          </Stack>

          {/* Categories Meta Info in Buttons */}
          <Grid container spacing={1} mb={4} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<TotalCountIcon />}
                size="small"
                sx={{
                  color: darkMode ? "#90caf9" : "#1976d2",
                  borderColor: darkMode ? "#90caf9" : "#1976d2",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(144,202,249,0.1)" : "rgba(25,118,210,0.1)",
                  },
                }}
              >
                Total: {totalCount}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<PageIcon />}
                size="small"
                sx={{
                  color: darkMode ? "#90caf9" : "#1976d2",
                  borderColor: darkMode ? "#90caf9" : "#1976d2",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(144,202,249,0.1)" : "rgba(25,118,210,0.1)",
                  },
                }}
              >
                Page: {currentPage}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<LimitIcon />}
                size="small"
                sx={{
                  color: darkMode ? "#90caf9" : "#1976d2",
                  borderColor: darkMode ? "#90caf9" : "#1976d2",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(144,202,249,0.1)" : "rgba(25,118,210,0.1)",
                  },
                }}
              >
                Limit: {limit}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<TotalPagesIcon />}
                size="small"
                sx={{
                  color: darkMode ? "#90caf9" : "#1976d2",
                  borderColor: darkMode ? "#90caf9" : "#1976d2",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(144,202,249,0.1)" : "rgba(25,118,210,0.1)",
                  },
                }}
              >
                Total Pages: {totalPages}
              </Button>
            </Grid>
          </Grid>

          {loadingCategories ? (
            <Stack alignItems="center" sx={{ my: 6 }}>
              <CircularProgress size={44} color="primary" />
            </Stack>
          ) : errorCategories ? (
            <Typography color="error">{errorCategories}</Typography>
          ) : (
            <Grid container spacing={4}>
              {categories.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    sx={{ py: 4, color: darkMode ? "#ccc" : "#555" }}
                  >
                    No categories found.
                  </Typography>
                </Grid>
              ) : (
                categories.map((c, idx) => (
                  <Fade
                    in={!loadingCategories}
                    timeout={600 + idx * 120}
                    key={c.id}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Card
                        elevation={4}
                        sx={{
                          borderRadius: 4,
                          background: darkMode ? "#212121" : "#f9fafb",
                          boxShadow: "0 4px 24px 0 #00000014",
                          minHeight: 340,
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-6px) scale(1.03)",
                            boxShadow: "0 8px 32px 0 #00000022",
                          },
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {c.categoryImage && (
                          <CardMedia
                            component="img"
                            height="170"
                            image={
                              c.categoryImage.startsWith("http")
                                ? c.categoryImage
                                : `https://amjad-hamidi-tms.runasp.net${c.categoryImage}`
                            }
                            alt={c.name}
                            sx={{
                              objectFit: "cover",
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                              borderBottom: "2px solid #f0f0f0",
                              cursor: "pointer",
                              "&:hover": {
                                opacity: 0.8,
                              },
                            }}
                            onClick={() =>
                              handleImageClick(
                                c.categoryImage.startsWith("http")
                                  ? c.categoryImage
                                  : `https://amjad-hamidi-tms.runasp.net${c.categoryImage}`,
                                c.name
                              )
                            }
                          />
                        )}
                        <CardContent sx={{ flex: 1 }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <IdIcon
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: darkMode ? "#a7ffeb" : "#00838f",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: darkMode ? "#b0bec5" : "#555",
                              }}
                            >
                              ID: {c.id}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <NameIcon
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: darkMode ? "#a7ffeb" : "#00838f",
                              }}
                            />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: darkMode ? "#e0e0e0" : "#212121",
                              }}
                            >
                              {c.name || "Unnamed Category"}
                            </Typography>
                          </Box>
                          {c.description && (
                            <Box display="flex" alignItems="flex-start" mb={1}>
                              <DescriptionTextIcon
                                sx={{
                                  fontSize: 18,
                                  mt: 0.2,
                                  mr: 1,
                                  color: darkMode ? "#a7ffeb" : "#00838f",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ color: darkMode ? "#b0bec5" : "text.secondary" }}
                              >
                                {c.description}
                              </Typography>
                            </Box>
                          )}
                          {c.generalSkills && c.generalSkills.length > 0 && (
                            <Box display="flex" alignItems="center" mt={2}>
                              <SkillsIcon
                                sx={{
                                  fontSize: 18,
                                  mr: 1,
                                  color: darkMode ? "#a7ffeb" : "#00838f",
                                }}
                              />
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                sx={{ mb: 1 }}
                              >
                                {c.generalSkills.map((skill, skillIdx) => (
                                  <Chip
                                    key={skillIdx}
                                    label={skill}
                                    color="info"
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      bgcolor: darkMode ? "#1976d2" : "#42a5f5",
                                      color: "#fff",
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Fade>
                ))
              )}
            </Grid>
          )}

          {/* Pagination component */}
          {totalPages > 0 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 700,
                    fontSize: 18,
                    borderRadius: 2,
                    mx: 0.5,
                    transition: "all 0.2s",
                    color: darkMode ? "#e0e0e0" : "#212121",
                  },
                  "& .Mui-selected": {
                    color: "#fff !important",
                    ...(darkMode && {
                      background: "#90caf9 !important",
                      color: "#121212 !important",
                    }),
                    ...(!darkMode && {
                      background: "#1976d2 !important",
                      color: "#fff !important",
                    }),
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: darkMode ? "#b0bec5" : "#757575",
                  },
                  "& .MuiPaginationItem-firstLast": {
                    color: darkMode ? "#90caf9" : "#1976d2",
                  },
                  "& .MuiPaginationItem-previousNext": {
                    color: darkMode ? "#90caf9" : "#1976d2",
                  },
                }}
              />
            </Stack>
          )}
        </Paper>
      </Container>

      {/* Image Modal for Category Images */}
      <Dialog
        open={isImageModalOpen}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: darkMode ? "#1a1a1a" : "#fff",
            boxShadow: darkMode
              ? "0 0 25px rgba(144,202,249,0.5)"
              : "0 0 25px rgba(0,0,0,0.2)",
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={handleCloseImageModal}
          sx={{
            width: 'fit-content',
            position: "absolute",
            top: 10,
            right: 10,
            color: darkMode ? "#e0e0e0" : "#555",
            bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
              transform: "rotate(90deg) scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          {currentImage.src && (
            <CardMedia
              component="img"
              image={currentImage.src}
              alt={currentImage.alt}
              sx={{
                maxWidth: "50%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 3,
                animation: "zoomIn 0.4s ease-out",
                margin: "auto",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Intro Video ===== */}
      <Container
        id="introvideo"
        sx={{
          py: 4,
          textAlign: "center",
          opacity: 0,
          animation: "fadeSection 1s 0.6s forwards",
        }}
      >
        <Typography variant="h5" gutterBottom>
          🎬 Watch Our Intro
        </Typography>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <SwiperSlide>
            <Box
              component="video"
              src={introVideo}
              controls
              sx={{
                width: "100%",
                maxWidth: 640,
                borderRadius: 2,
                boxShadow: darkMode
                  ? "0 4px 16px rgba(144,202,249,0.3)"
                  : "0 4px 16px rgba(0,0,0,0.2)",
              }}
            />
          </SwiperSlide>
        </Swiper>
      </Container>

      {/* ===== Latest Articles ===== */}
      <Container id="blog" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          📰 Latest Articles
        </Typography>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={15}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3500 }}
          loop
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          {articleData.map((a, i) => (
            <SwiperSlide key={i}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: darkMode ? "#1e1e1e" : "#fff",
                  color: darkMode ? "#b2ebf2" : "#01579b",
                  boxShadow: darkMode
                    ? "0 0 15px rgba(144,202,249,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "0.3s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {a.title}
                </Typography>
                {expandedArticles[i] && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {a.details}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 2,
                    borderColor: darkMode ? "#90caf9" : "#1976d2",
                    color: darkMode ? "#90caf9" : "#1976d2",
                    "&:hover": {
                      backgroundColor: darkMode ? "#1e88e5" : "#1976d2",
                      color: "#fff",
                      borderColor: darkMode ? "#1e88e5" : "#1976d2",
                    },
                    transition: "0.3s",
                  }}
                  onClick={() => toggleDetails(i)}
                >
                  {expandedArticles[i] ? "Hide Details" : "Show Details"}
                </Button>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* ===== Partners ===== */}
      <Container id="partners" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          🤝 Our Partners
        </Typography>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={15}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3500 }}
          loop
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          {partners.map((p, i) => (
            <SwiperSlide key={i}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: darkMode ? "#232f34" : "#e3f2fd",
                  color: darkMode ? "#b0bec5" : "#01579b",
                  boxShadow: darkMode
                    ? "0 0 15px rgba(144,202,249,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": { transform: "scale(1.03)" },
                  textAlign: "center",
                  transition: "0.3s ease",
                }}
              >
                <Typography variant="subtitle1">{p}</Typography>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* ===== Footer (Contact + Share + Signature) ===== */}
      <Box
        id="contact"
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1c1c1c, #3a3a3a)"
            : "linear-gradient(135deg, #a7d9ff, #c6e7ff)",
          color: darkMode ? "#fff" : "#333",
          mt: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            bgcolor: darkMode ? "#444" : "#e0f2f7",
            borderRadius: "50%",
            animation: "pulseCircle 4s infinite ease-in-out",
          }}
        />
        <Typography variant="h5" gutterBottom>
          📬 Stay Connected
        </Typography>
        <Typography variant="body1">Got questions? Reach out anytime!</Typography>
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
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/amjad-hamidi/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .5s",
            }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            href="https://www.instagram.com/amjada871/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .7s",
            }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://www.facebook.com/AmjadHamidi01/"
            target="_blank"
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              animation: "iconPulse 2s infinite .9s",
            }}
          >
            <FacebookIcon />
          </IconButton>
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
              color: darkMode ? "#fff" : "#1976d2",
              borderColor: darkMode ? "#fff" : "#1976d2",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(25,118,210,0.1)",
              },
              transition: "0.3s",
            }}
          >
            Share Website
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowQR((q) => !q)}
            sx={{
              color: darkMode ? "#fff" : "#1976d2",
              borderColor: darkMode ? "#fff" : "#1976d2",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(25,118,210,0.1)",
              },
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
                  : "0 0 10px rgba(0,0,0,0.2)",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: darkMode
                    ? "0 0 25px rgba(144,202,249,0.6)"
                    : "0 0 20px rgba(0,0,0,0.3)",
                },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onClick={() => setQRModalOpen(true)}
            />
          </Box>
        )}
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
            }}
            onClick={() => setQRModalOpen(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}
            >
              <IconButton
                onClick={() => setQRModalOpen(false)}
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  bgcolor: darkMode ? "#333" : "#fff",
                  color: darkMode ? "#f48fb1" : "#d32f2f",
                  "&:hover": {
                    bgcolor: darkMode ? "#f06292" : "#f44336",
                    transform: "rotate(45deg) scale(1.2)",
                  },
                  boxShadow: darkMode
                    ? "0 0 12px rgba(255,105,135,0.5)"
                    : "0 0 8px rgba(244,67,54,0.3)",
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
                    : "0 0 25px rgba(0,0,0,0.2)",
                  animation: "zoomIn 0.4s ease-out",
                }}
              />
            </Box>
          </Box>
        )}

        {/* ===== Footer Signature ===== */}
        <Box sx={{ mt: 4, textAlign: "center", animation: "fadeIn 1s ease-in" }}>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              color: darkMode ? "#90caf9" : "#333",
              fontWeight: 500,
            }}
          >
            <Box
              component="span"
              sx={{
                fontStyle: "italic",
                color: darkMode ? "#f48fb1" : "#d84315",
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
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
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
              <Box
                component="a"
                href="https://github.com/Amjad-Hamidi"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "1rem",
                  color: darkMode ? "#90caf9" : "#1976d2",
                }}
              >
                Amjad Hamidi
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes fadeSection {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(130, 177, 255, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(130, 177, 255, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(130, 177, 255, 0);
          }
        }
        @keyframes pulseCircle {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.8;
          }
        }
        @keyframes iconPulse {
          0% {
            transform: scale(1);
            color: ${darkMode ? "#fff" : "#1976d2"};
          }
          50% {
            transform: scale(1.2);
            color: ${darkMode ? "#90caf9" : "#1e88e5"};
          }
          100% {
            transform: scale(1);
            color: ${darkMode ? "#fff" : "#1976d2"};
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes beatHeart {
          0%,
          100% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.2);
          }
          30% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
}