import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Button,
  CardMedia,
  Chip,
  Pagination,
  Stack,
  Fade,
  Grow,
  Paper,
} from "@mui/material";
import { Grid } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const statCards = [
  { key: "usersCount", label: "Users", icon: <GroupIcon color="primary" /> },
  { key: "compainesCount", label: "Companies", icon: <BusinessIcon color="secondary" /> },
  { key: "supervisorsCount", label: "Supervisors", icon: <SupervisorAccountIcon color="info" /> },
  { key: "traineesCount", label: "Trainees", icon: <SchoolIcon color="success" /> },
  { key: "categoriesCount", label: "Categories", icon: <CategoryIcon color="warning" /> },
  { key: "totalTrainingProgramsCount", label: "Total Programs", icon: <CheckCircleIcon color="primary" /> },
  { key: "approvedTrainingProgramsCount", label: "Approved Programs", icon: <CheckCircleIcon color="success" /> },
  { key: "rejectedTrainingProgramsCount", label: "Rejected Programs", icon: <CancelIcon color="error" /> },
  { key: "pendingTrainingProgramsCount", label: "Pending Programs", icon: <HourglassEmptyIcon color="warning" /> },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesMeta, setCategoriesMeta] = useState({ totalCount: 0, page: 1, limit: 10, totalPages: 1 });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [query, setQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://amjad-hamidi-tms.runasp.net/api/Users/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setErrorStats("Failed to load statistics.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const fetchCategories = async (page = 1, limit = 10, search = "") => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const token = localStorage.getItem("accessToken");
      const url = `http://amjad-hamidi-tms.runasp.net/api/Categories?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, {
        headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.items || []);
      setCategoriesMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setErrorCategories("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories(categoriesMeta.page, categoriesMeta.limit, query);
    // eslint-disable-next-line
  }, [categoriesMeta.page, categoriesMeta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchCategories(1, categoriesMeta.limit, query);
      }, 500)
    );
    // eslint-disable-next-line
  }, [query]);

  const handlePageChange = (event, value) => {
    setCategoriesMeta((prev) => ({ ...prev, page: value }));
  };

  const handleViewProgramClick = (categoryId) => {
    navigate(`/CategoryTProgramsW/${categoryId}`);
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: "#1e3c72", letterSpacing: 1 }}>
        System Overview
      </Typography>

      {/* Stats Section with Swiper */}
      <Box sx={{ mb: 5 }}>
        {loadingStats ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 120 }}>
            <CircularProgress size={48} color="primary" />
          </Stack>
        ) : errorStats ? (
          <Typography color="error">{errorStats}</Typography>
        ) : (
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            navigation={true}
            keyboard={{ enabled: true }}
            loop={true}
            autoplay={{
              delay: 1000, // 👈 يتحرك كل 3 ثواني
              disableOnInteraction: false, // إذا تفاعل المستخدم مع السلايدر (مثل التمرير اليدوي) السوايبر يواصل العمل بعد التفاعل
            }}
            modules={[Navigation, Keyboard, Autoplay]}
          >
            {statCards.map((stat, idx) => (
              <SwiperSlide key={stat.key}>
                <Grow in={!loadingStats} style={{ transformOrigin: "0 0 0" }} timeout={500 + idx * 150}>
                  <Card
                    elevation={6}
                    sx={{
                      borderRadius: 4,
                      background: "linear-gradient(120deg, #1e3c72 60%, #f5a623 100%)",
                      color: "#fff",
                      boxShadow: "0 8px 32px 0 #00000022",
                      minHeight: 120,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.04)" },
                      m: 1,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {stat.icon}
                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                          {stat.label}
                        </Typography>
                      </Stack>
                      <Typography variant="h4" sx={{ mt: 2, fontWeight: 900, letterSpacing: 1 }}>
                        {stats ? stats[stat.key] : 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>

      {/* Categories Section */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72" }}>
            Explore Categories
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2 }}
          />
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`Total: ${categoriesMeta.totalCount}`} color="primary" />
          <Chip label={`Page: ${categoriesMeta.page} / ${categoriesMeta.totalPages}`} color="secondary" />
          <Chip label={`Limit: ${categoriesMeta.limit}`} color="info" />
        </Stack>
        {loadingCategories ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : errorCategories ? (
          <Typography color="error">{errorCategories}</Typography>
        ) : (
          <Grid container spacing={4}>
            {categories.length === 0 ? (
              <Grid item xs={12}><Typography>No categories found.</Typography></Grid>
            ) : (
              categories.map((c, idx) => (
                <Fade in={!loadingCategories} timeout={600 + idx * 120} key={c.id}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      elevation={4}
                      sx={{
                        borderRadius: 4,
                        background: "#f9fafb",
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
                          image={c.categoryImage.startsWith("http") ? c.categoryImage : `http://amjad-hamidi-tms.runasp.net${c.categoryImage}`}
                          alt={c.name}
                          sx={{
                            objectFit: "cover",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            borderBottom: "2px solid #f0f0f0",
                          }}
                        />
                      )}
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {c.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {c.description}
                        </Typography>
                        {c.generalSkills && c.generalSkills.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                            {c.generalSkills.map((skill, idx) => (
                              <Chip key={idx} label={skill} color="info" size="small" sx={{ fontWeight: 600 }} />
                            ))}
                          </Stack>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                            boxShadow: "0 2px 8px 0 #1e3c7233",
                            letterSpacing: 1,
                            background: "linear-gradient(90deg, #1e3c72 60%, #f5a623 100%)",
                          }}
                          onClick={() => handleViewProgramClick(c.id)}
                        >
                          View Training Programs
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Fade>
              ))
            )}
          </Grid>
        )}
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={categoriesMeta.totalPages}
            page={categoriesMeta.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 2,
                mx: 0.5,
                transition: "all 0.2s",
              },
              "& .Mui-selected": {
                color: "#fff !important",
                background: "#1e3c72 !important",
              },
            }}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
