import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography,
    Stack,
    TextField,
    Button,
    Paper,
    Chip,
    Pagination,
    Fade,
    Dialog,
    DialogContent,
    IconButton,
    Tooltip // Make sure Tooltip is imported
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Close as CloseIcon } from "@mui/icons-material";

// Importing specific icons for consistency
import CalculateIcon from '@mui/icons-material/Calculate'; // For totalCount
import LayersIcon from '@mui/icons-material/Layers'; // For page/totalPages
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'; // For limit

// Icons for category card details
import CategoryIcon from '@mui/icons-material/Category'; // Icon for category name
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for description
import PsychologyIcon from '@mui/icons-material/Psychology'; // Icon for general skills
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Icon for ID

const SupervisorDashboard = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [meta, setMeta] = useState({
        totalCount: 0,
        page: 1,
        limit: 8,
        totalPages: 1,
    });

    // New state for image preview modal
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [selectedImageAlt, setSelectedImageAlt] = useState("");

    // Use useCallback for fetchCategories to optimize performance and prevent unnecessary re-renders
    const fetchCategories = useCallback(async (page = 1, limit = 8, search = "") => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://amjad-hamidi-tms.runasp.net/api/Categories?page=${page}&limit=${limit}&search=${encodeURIComponent(
                search
            )}`;
            const res = await fetchWithAuth(url, {
                headers: { Accept: "*/*" },
            });
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : data.items || []);
            setMeta({
                totalCount: data.totalCount,
                page: data.page,
                limit: data.limit,
                totalPages: data.totalPages,
            });
        } catch (err) {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array as `fetchWithAuth` is a utility, and `setStates` are stable

    useEffect(() => {
        fetchCategories(meta.page, meta.limit, query);
    }, [meta.page, meta.limit, query, fetchCategories]); // Added query and fetchCategories to deps

    useEffect(() => {
        if (searchTimeout) clearTimeout(searchTimeout);
        const newTimeout = setTimeout(() => {
            fetchCategories(1, meta.limit, query);
        }, 500);
        setSearchTimeout(newTimeout);
        return () => clearTimeout(newTimeout);
    }, [query, meta.limit, fetchCategories]); // Added fetchCategories to deps

    const handlePageChange = (e, value) => {
        setMeta((prev) => ({ ...prev, page: value }));
    };

    const handleViewProgramClick = (id) => {
        navigate(`/CategoryTProgramsW/${id}`);
    };

    // Handler for image click to open modal
    const handleImageClick = (imageUrl, altText) => {
        setSelectedImageUrl(imageUrl);
        setSelectedImageAlt(altText);
        setOpenImageModal(true);
    };

    // Handler to close the image modal
    const handleCloseImageModal = () => {
        setOpenImageModal(false);
        setSelectedImageUrl("");
        setSelectedImageAlt("");
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
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
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

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    {/* Consistent Chips styling and order with Tooltips */}
                    <Tooltip title="Total Number of Categories">
                        <Chip
                            label={`Total: ${meta.totalCount}`}
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#fff',
                                backgroundColor: '#1e3c72',
                                '& .MuiChip-icon': {
                                    color: '#fff',
                                },
                            }}
                            icon={<CalculateIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Current Page / Total Pages">
                        <Chip
                            label={`Page: ${meta.page} / ${meta.totalPages}`}
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#fff',
                                backgroundColor: '#1e3c72',
                                '& .MuiChip-icon': {
                                    color: '#fff',
                                },
                            }}
                            icon={<LayersIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Items Displayed Per Page">
                        <Chip
                            label={`Limit: ${meta.limit}`}
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#fff',
                                backgroundColor: '#1e3c72',
                                '& .MuiChip-icon': {
                                    color: '#fff',
                                },
                            }}
                            icon={<FormatListNumberedIcon />}
                        />
                    </Tooltip>
                </Stack>

                {loading ? (
                    <Stack alignItems="center" sx={{ my: 6 }}>
                        <CircularProgress size={44} color="primary" />
                    </Stack>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Grid container spacing={4}>
                        {categories.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography>No categories found.</Typography>
                            </Grid>
                        ) : (
                            categories.map((c, idx) => (
                                <Fade in={!loading} timeout={600 + idx * 120} key={c.id}>
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
                                                <Tooltip title="Click to view image">
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
                                                                    : `https://amjad-hamidi-tms.runasp.net${c.categoryImage}`,
                                                                c.name
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                            )}
                                            <CardContent sx={{ flex: 1 }}>
                                                {/* Tooltip for ID */}
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                    <Tooltip title="Category ID" placement="bottom" arrow>
                                                        <VpnKeyIcon sx={{ color: '#555' }} fontSize="small" />
                                                    </Tooltip>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {c.id}
                                                    </Typography>
                                                </Stack>
                                                {/* Tooltip for Name */}
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                    <Tooltip title="Category Name" placement="bottom" arrow>
                                                        <CategoryIcon sx={{ color: '#1e3c72' }} />
                                                    </Tooltip>
                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                        {c.name}
                                                    </Typography>
                                                </Stack>
                                                {/* Tooltip for Description */}
                                                <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
                                                    <Tooltip title="Category Description" placement="bottom" arrow>
                                                        <DescriptionIcon sx={{ color: '#4CAF50' }} />
                                                    </Tooltip>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {c.description}
                                                    </Typography>
                                                </Stack>
                                                {c.generalSkills && c.generalSkills.length > 0 && (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }} alignItems="center">
                                                        {/* Tooltip for General Skills */}
                                                        <Tooltip title="General Skills" placement="bottom" arrow>
                                                            <PsychologyIcon sx={{ color: '#9C27B0' }} />
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
                        count={meta.totalPages}
                        page={meta.page}
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

            {/* Image Preview Dialog */}
            <Dialog
                open={openImageModal}
                onClose={handleCloseImageModal}
                maxWidth="md"
                fullWidth
                aria-labelledby="image-preview-dialog-title"
            >
                <DialogContent
                    dividers
                    sx={{ position: 'relative', p: 0 }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseImageModal}
                        sx={{
                            width: 'fit-content',
                            position: "absolute",
                            right: 10,
                            top: 10,
                            zIndex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            color: '#555',
                            boxShadow: "0 0 8px rgba(244,67,54,0.3)",
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                transform: "rotate(45deg) scale(1.1)",
                                boxShadow: "0 0 12px rgba(244,67,54,0.5)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={selectedImageUrl}
                        alt={selectedImageAlt}
                        style={{
                            width: "50%",
                            height: "auto",
                            maxHeight: '80vh',
                            display: "block",
                            margin: "auto",
                            objectFit: 'contain',
                            padding: 2,
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SupervisorDashboard;