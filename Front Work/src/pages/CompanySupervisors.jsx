import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
  Stack,
  TextField,
  Paper,
  Chip,
  Pagination,
  Fade,
  Link as MuiLink, // Alias to avoid conflict with react-router Link
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  IconButton, // Import IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/CompanySupervisors.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description'; // For CV icon
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const LIMIT = 8;

const CompanySupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("all"); // 'all' or 'company'
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });
  const [openImagePreview, setOpenImagePreview] = useState(false); // New state for image preview dialog
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // New state for current image URL
  const navigate = useNavigate();

  const fetchSupervisors = async (page = 1, limit = LIMIT, search = "") => {
    setLoading(true);
    setError(null);
    let url =
      viewType === "all"
        ? `https://amjad-hamidi-tms.runasp.net/api/Users/all-supervisors?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        : `https://amjad-hamidi-tms.runasp.net/api/Users/supervisors-company?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    try {
      const res = await fetchWithAuth(url, {
        headers: { Accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch supervisors");
      const data = await res.json();
      setSupervisors(Array.isArray(data) ? data : data.items || []);
      setMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError("Failed to load supervisors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [viewType, meta.page, meta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchSupervisors(1, meta.limit, search);
      }, 500)
    );
    // eslint-disable-next-line
  }, [search]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleViewCompanySupervisors = () => {
    navigate("/company-supervisors");
  };

  // Handler for opening the image preview dialog
  const handleImageClick = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setOpenImagePreview(true);
  };

  // Handler for closing the image preview dialog
  const handleCloseImagePreview = () => {
    setOpenImagePreview(false);
    setCurrentImageUrl(null);
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72" }}>
            {viewType === "all" ? "All Supervisors" : "Company Supervisors"}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant={viewType === "all" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setViewType("all")}
            >
              All Supervisors
            </Button>
            <Button
              variant={viewType === "company" ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setViewType("company")}
            >
              Company Supervisors
            </Button>
          </Stack>
        </Stack>
        <TextField
          variant="outlined"
          placeholder="Search supervisors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2, mb: 2 }}
        />
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" />
          <Chip label={`Page: ${meta.page} / ${meta.totalPages}`} color="secondary" />
          <Chip label={`Limit: ${meta.limit}`} color="info" />
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {supervisors.length === 0 ? (
              <Grid item xs={12}><Typography>No supervisors found.</Typography></Grid>
            ) : (
              supervisors.map((sup, idx) => (
                <Fade in={!loading} timeout={600 + idx * 120} key={sup.id || sup.supervisorId}>
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
                      {sup.profileImageUrl ? (
                        <CardMedia
                          component="img"
                          height="180"
                          image={sup.profileImageUrl}
                          alt={sup.fullName}
                          sx={{ objectFit: "cover", cursor: 'pointer' }} // Add cursor pointer
                          onClick={() => handleImageClick(sup.profileImageUrl)} // Add onClick handler
                        />
                      ) : (
                        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200' }}>
                          <AccountCircleIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }} noWrap title={sup.fullName}>
                          {sup.fullName}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <FingerprintIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">ID: {sup.id || sup.supervisorId}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <MuiLink href={`mailto:${sup.email}`} variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }} noWrap title={sup.email}>
                            {sup.email}
                          </MuiLink>
                        </Stack>
                        {sup.phoneNumber && (
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">{sup.phoneNumber}</Typography>
                          </Stack>
                        )}
                        <Box sx={{ mt: 'auto', pt: 1 }}> {/* Push CV to bottom */}
                          {sup.cvPath ? (
                            <Button
                              href={sup.cvPath}
                              target="_blank"
                              rel="noreferrer"
                              variant="outlined"
                              size="small"
                              startIcon={<DescriptionIcon />}
                              sx={{
                                width: '100%',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.02)',
                                  boxShadow: (theme) => theme.shadows[2],
                                }
                              }}
                            >
                              View Resume
                            </Button>
                          ) : (
                            <Chip
                              icon={<DescriptionIcon fontSize="small" />}
                              label="No Resume Available"
                              variant="outlined"
                              size="small"
                              sx={{ width: '100%', borderRadius: 2, justifyContent: 'flex-start', pl: 1 }}
                            />
                          )}
                        </Box>
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
          />
        </Stack>
      </Paper>

      {/* Image Preview Dialog */}
      <Dialog open={openImagePreview} onClose={handleCloseImagePreview} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImagePreview}
            sx={{
              width: 'fit-content',
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1, // Ensure the close button is on top
            }}
          >
            <CloseIcon />
          </IconButton>
          {currentImageUrl && (
            <Box
              component="img"
              src={currentImageUrl}
              alt="Supervisor Profile"
              sx={{
                width: '50%',
                height: 'auto',
                display: 'block',
                borderRadius: 2, // Optional: Add some border radius to the image
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CompanySupervisors;