import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
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
  Dialog, // Import Dialog for the image preview
  DialogContent, // Import DialogContent for the image preview
  IconButton, // Import IconButton for the close button
  Tooltip,
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
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon for the close button
import { useNavigate } from "react-router-dom";

import {
    FormatListNumbered as TotalCountIcon,
    Layers as PageIcon,
    AspectRatio as LimitIcon,
    ImportContacts as TotalPagesIcon,
    VpnKey as VpnKeyIcon, // For ID
    Description as DescriptionIcon, // For description
    Psychology as PsychologyIcon, // For general skills
} from "@mui/icons-material";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const statCards = [
  { key: "usersCount", label: "Users", icon: <GroupIcon color="primary" /> },
  {
    key: "compainesCount",
    label: "Companies",
    icon: <BusinessIcon color="secondary" />,
  },
  {
    key: "supervisorsCount",
    label: "Supervisors",
    icon: <SupervisorAccountIcon color="info" />,
  },
  {
    key: "traineesCount",
    label: "Trainees",
    icon: <SchoolIcon color="success" />,
  },
  {
    key: "categoriesCount",
    label: "Categories",
    icon: <CategoryIcon color="warning" />,
  },
  {
    key: "totalTrainingProgramsCount",
    label: "Total Programs",
    icon: <CheckCircleIcon color="primary" />,
  },
  {
    key: "approvedTrainingProgramsCount",
    label: "Approved Programs",
    icon: <CheckCircleIcon color="success" />,
  },
  {
    key: "rejectedTrainingProgramsCount",
    label: "Rejected Programs",
    icon: <CancelIcon color="error" />,
  },
  {
    key: "pendingTrainingProgramsCount",
    label: "Pending Programs",
    icon: <HourglassEmptyIcon color="warning" />,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesMeta, setCategoriesMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [query, setQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // New state for image preview

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          "https://amjad-hamidi-tms.runasp.net/api/Users/statistics",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const fetchCategories = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const token = localStorage.getItem("accessToken");
        const url = `https://amjad-hamidi-tms.runasp.net/api/Categories?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`;
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
    },
    []
  ); // useCallback dependency array is empty as fetchCategories doesn't depend on external state

  useEffect(() => {
    fetchCategories(categoriesMeta.page, categoriesMeta.limit, query);
    // eslint-disable-next-line
  }, [categoriesMeta.page, categoriesMeta.limit, fetchCategories]); // Added fetchCategories to dependency array

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const newTimeout = setTimeout(() => {
      fetchCategories(1, categoriesMeta.limit, query);
    }, 500);
    setSearchTimeout(newTimeout);
    return () => clearTimeout(newTimeout); // Clear timeout on unmount or re-render
    // eslint-disable-next-line
  }, [query, categoriesMeta.limit, fetchCategories]); // Added fetchCategories to dependency array

  const handlePageChange = (event, value) => {
    setCategoriesMeta((prev) => ({ ...prev, page: value }));
  };

  const handleViewProgramClick = (categoryId) => {
    navigate(`/CategoryTProgramsW/${categoryId}`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        p: { xs: 1, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      }}
    >
      <Typography
        variant="h3"
        sx={{ fontWeight: 700, mb: 3, color: "#1e3c72", letterSpacing: 1 }}
      >
        System Overview
      </Typography>

      {/* Stats Section with Swiper */}
      <Box sx={{ mb: 5 }}>
        {loadingStats ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 120 }}
          >
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
                <Grow
                  in={!loadingStats}
                  style={{ transformOrigin: "0 0 0" }}
                  timeout={500 + idx * 150}
                >
                  <Card
                    elevation={6}
                    sx={{
                      borderRadius: 4,
                      background:
                        "linear-gradient(120deg, #1e3c72 60%, #f5a623 100%)",
                      color: "#fff",
                      boxShadow: "0 8px 32px 0 #00000022",
                      minHeight: 120,
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.04)" },
                      m: 1,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {stat.icon}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, flex: 1 }}
                        >
                          {stat.label}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, fontWeight: 900, letterSpacing: 1 }}
                      >
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
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
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

        {/* Categories Meta Info in Buttons */}
        <Grid container spacing={1} mb={4} justifyContent="center">
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<TotalCountIcon />}
              size="small"
              sx={{
                color: "#0b3458",
                borderColor: "#1976d2",
                bgcolor: "#e3f2fd", // Added background color
                "&:hover": {
                  bgcolor: "#bbdefb", // Darker background on hover
                },
              }}
            >
              Total: {categoriesMeta.totalCount}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<PageIcon />}
              size="small"
              sx={{
                color: "#0b3458",
                borderColor: "#1976d2",
                bgcolor: "#e3f2fd", // Added background color
                "&:hover": {
                  bgcolor: "#bbdefb", // Darker background on hover
                },
              }}
            >
              Page: {categoriesMeta.page}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<LimitIcon />}
              size="small"
              sx={{
                color: "#0b3458",
                borderColor: "#1976d2",
                bgcolor: "#e3f2fd", // Added background color
                "&:hover": {
                  bgcolor: "#bbdefb", // Darker background on hover
                },
              }}
            >
              Limit: {categoriesMeta.limit}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<TotalPagesIcon />}
              size="small"
              sx={{
                color: "#0b3458",
                borderColor: "#1976d2",
                bgcolor: "#e3f2fd", // Added background color
                "&:hover": {
                  bgcolor: "#bbdefb", // Darker background on hover
                },
              }}
            >
              Total Pages: {categoriesMeta.totalPages}
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
                <Typography>No categories found.</Typography>
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
                            cursor: "pointer", // Add cursor pointer
                            width: 'fit-content',
                            maxWidth: "100%",
                            display: 'block',
                            "&:hover": {
                              opacity: 0.8,
                            },                           
                          }}
                          onClick={() =>
                            handleImageClick(
                              c.categoryImage.startsWith("http")
                                ? c.categoryImage
                                : `https://amjad-hamidi-tms.runasp.net${c.categoryImage}`
                            )
                          } // Open dialog on click
                        />
                      )}
                      <CardContent sx={{ flex: 1 }}>
                        {/* Tooltip for ID */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Tooltip title="Category ID" placement="bottom" arrow>
                            <VpnKeyIcon
                              sx={{ color: "#555" }}
                              fontSize="small"
                            />
                          </Tooltip>
                          <Typography variant="body2" color="text.secondary">
                            {c.id}
                          </Typography>
                        </Stack>
                        {/* Tooltip for Name */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Tooltip
                            title="Category Name"
                            placement="bottom"
                            arrow
                          >
                            <CategoryIcon sx={{ color: "#1e3c72" }} />
                          </Tooltip>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {c.name}
                          </Typography>
                        </Stack>
                        {/* Tooltip for Description */}
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Tooltip
                            title="Category Description"
                            placement="bottom"
                            arrow
                          >
                            <DescriptionIcon sx={{ color: "#4CAF50" }} />
                          </Tooltip>
                          <Typography variant="body2" color="text.secondary">
                            {c.description}
                          </Typography>
                        </Stack>
                        {c.generalSkills && c.generalSkills.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ mb: 1 }}
                            alignItems="center"
                          >
                            {/* Tooltip for General Skills */}
                            <Tooltip
                              title="General Skills"
                              placement="bottom"
                              arrow
                            >
                              <PsychologyIcon sx={{ color: "#9C27B0" }} />
                            </Tooltip>
                            {c.generalSkills.map((skill, skillIdx) => (
                              <Chip
                                key={skillIdx}
                                label={skill}
                                color="info"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
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
                            background:
                              "linear-gradient(90deg, #1e3c72 60%, #f5a623 100%)",
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
            showFirstButton // Added showFirstButton
            showLastButton // Added showLastButton
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
              "& .MuiPaginationItem-firstLast": {
                color: "#1976d2", // Consistent color for first/last buttons
              },
              "& .MuiPaginationItem-previousNext": {
                color: "#1976d2", // Consistent color for prev/next buttons
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "#757575", // Consistent color for ellipsis
              },
            }}
          />
        </Stack>
      </Paper>

      {/* ─── نافذة معاينة الصورة ────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#fff",
            boxShadow: "0 0 25px rgba(0,0,0,0.2)",
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogContent dividers sx={{ position: "relative", p: 0 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: "fit-content",
              position: "absolute",
              right: 10, // Adjusted for better spacing
              top: 10, // Adjusted for better spacing
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              color: "#555", // Default color for light theme
              boxShadow: "0 0 8px rgba(244,67,54,0.3)", // Added boxShadow as requested
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                transform: "rotate(45deg) scale(1.1)", // Added hover effect
                boxShadow: "0 0 12px rgba(244,67,54,0.5)", // Stronger shadow on hover
              },
              transition: "all 0.3s ease", // Smooth transition
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Category Image Preview"
              sx={{
                width: "50%",
                height: "auto",
                maxHeight: "80vh",
                display: "block",
                mx: "auto",
                objectFit: "contain",
                p: 2,
                margin: "auto",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
