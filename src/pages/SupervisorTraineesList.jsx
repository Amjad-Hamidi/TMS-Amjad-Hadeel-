import React, { useEffect, useState, useCallback } from "react";
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
  Link as MuiLink,
  Tooltip,
  Alert,
  Grow,
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  IconButton, // Import IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close"; // Import a close icon for the dialog

const LIMIT = 8;

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

export default function SupervisorTraineesList() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("supervisor"); // 'supervisor' or 'allPlatform'
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });

  // New state for image preview modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setMeta((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchTrainees = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url;
    const params = `page=${meta.page}&limit=${meta.limit}&search=${encodeURIComponent(
      debouncedSearch
    )}`;

    if (viewType === "supervisor") {
      url = `https://amjad-hamidi-tms.runasp.net/api/Users/trainees-supervisor?${params}`;
    } else {
      url = `https://amjad-hamidi-tms.runasp.net/api/Users/all-trainees?${params}`;
    }

    try {
      const res = await fetchWithAuth(url);
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `Failed to fetch trainees: ${res.status} ${errorData || "Server error"}`
        );
      }
      const data = await res.json();
      setTrainees(data.items || []);
      setMeta((prevMeta) => ({
        ...prevMeta,
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
      }));
      if ((data.items || []).length === 0) {
        setError("No trainees found for the current criteria.");
      }
    } catch (err) {
      console.error("Error fetching trainees:", err);
      setError(`Failed to load trainees. ${err.message}`);
      setTrainees([]);
      setMeta((prevMeta) => ({ ...prevMeta, totalCount: 0, totalPages: 1, page: 1 }));
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, debouncedSearch, viewType]);

  useEffect(() => {
    fetchTrainees();
  }, [fetchTrainees]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handleInvite = (email, traineeName) => {
    const subject = encodeURIComponent(`Invitation to Join Program`);
    const body = encodeURIComponent(
      `Dear ${traineeName},\n\nI hope you're doing well. I would like to invite you to join my training program that I supervised on TMS platform. Please check the current programs and find my name to apply to it, you are very talanted in my opinion, and I recommend you to join the program: [Program Name].\n\nBest regards,\n[Your Supervisor]`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // New handler for image click to open modal
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
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 3 }, minHeight: "90vh", bgcolor: "grey.100" }}>
      {/* Header Paper */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3, bgcolor: "white" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
            {viewType === "supervisor" ? "My Supervised Trainees" : "All Platform Trainees"}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant={viewType === "supervisor" ? "contained" : "outlined"}
              onClick={() => handleViewTypeChange("supervisor")}
              startIcon={<SupervisorAccountIcon />}
              sx={{ borderRadius: 2 }}
            >
              My Supervised Trainees
            </Button>
            <Button
              variant={viewType === "allPlatform" ? "contained" : "outlined"}
              onClick={() => handleViewTypeChange("allPlatform")}
              startIcon={<PeopleOutlineIcon />}
              sx={{ borderRadius: 2 }}
            >
              All Platform Trainees
            </Button>
          </Stack>
        </Stack>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search trainees by name, email, program..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2, bgcolor: "grey.50", borderRadius: 1 }}
        />
        {meta.totalCount > 0 && !loading && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mb: 2.5, flexWrap: "wrap", justifyContent: "center" }}
          >
            <Chip
              icon={
                <Tooltip title="Total number of trainees" placement="top">
                  <AssessmentIcon fontSize="large" />
                </Tooltip>
              }
              label={`Total: ${meta.totalCount}`}
              variant="outlined"
              color="primary"
              size="medium"
              sx={{ transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" } }}
            />
            <Chip
              icon={
                <Tooltip title="Current page" placement="top">
                  <FormatListNumberedIcon fontSize="large" />
                </Tooltip>
              }
              label={`Page: ${meta.page} / ${meta.totalPages}`}
              variant="outlined"
              color="secondary"
              size="medium"
              sx={{ transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" } }}
            />
            <Chip
              icon={
                <Tooltip title="Items per page" placement="top">
                  <ListIcon fontSize="large" />
                </Tooltip>
              }
              label={`Limit: ${meta.limit}`}
              variant="outlined"
              color="info"
              size="medium"
              sx={{ transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" } }}
            />
          </Stack>
        )}
      </Paper>

      {/* Loading / Error */}
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "40vh" }}>
          <CircularProgress size={50} />
          <Typography sx={{ mt: 2 }}>Loading Trainees...</Typography>
        </Stack>
      ) : error && trainees.length === 0 ? (
        <Alert severity="info" sx={{ my: 5 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Trainee Cards Grid */}
          <Grid container spacing={3} sx={{ p: { xs: 1, md: 3 }, alignItems: "stretch" }}>
            {trainees.map((trainee, idx) => {
              let programNameDisplay = "N/A";
              let categoryNameDisplay = "N/A";

              if (viewType === "supervisor") {
                programNameDisplay = trainee.trainingProgramName || "N/A";
                categoryNameDisplay = trainee.categoryName || "N/A";
              } else {
                if (trainee.trainingPrograms && trainee.trainingPrograms.length > 0) {
                  programNameDisplay = trainee.trainingPrograms[0].title || "N/A";
                }
                if (trainee.categories && trainee.categories.length > 0) {
                  categoryNameDisplay = trainee.categories[0].name || "N/A";
                }
              }

              const canInvite = viewType === "allPlatform";

              const imageUrl = trainee.profileImageUrl || "https://via.placeholder.com/300x190.png?text=No+Image";
              const imageAlt = trainee.fullName || "Trainee image";

              return (
                <Fade in={!loading} timeout={500 + idx * 50} key={trainee.id || idx}>
                  <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex" }}>
                    <StyledCard elevation={2}>
                      {/* Clickable CardMedia */}
                      <Tooltip title={`View ${trainee.fullName}'s Image`} placement="top">
                        <CardMedia
                          component="img"
                          height="190"
                          image={imageUrl}
                          alt={imageAlt}
                          sx={{
                            borderBottom: "1px solid #f0f0f0",
                            objectFit: "cover",
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => handleImageClick(imageUrl, imageAlt)} // Pass imageUrl and altText
                        />
                      </Tooltip>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Tooltip title={trainee.fullName || "N/A"} placement="top">
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "inline-block",
                            }}
                          >
                            {trainee.fullName || "N/A"}
                          </Typography>
                        </Tooltip>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 0.5, color: "text.secondary" }}
                          title={`ID: ${trainee.id}`}
                        >
                          <FingerprintIcon fontSize="small" />
                          <Typography variant="body2" noWrap>
                            ID: {trainee.id}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 0.5, color: "text.secondary" }}
                          title={trainee.email || "N/A"}
                        >
                          <EmailIcon fontSize="small" />
                          <MuiLink
                            href={`mailto:${trainee.email}`}
                            variant="body2"
                            noWrap
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {trainee.email || "N/A"}
                          </MuiLink>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 0.5, color: "text.secondary" }}
                          title={trainee.phoneNumber || "N/A"}
                        >
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {trainee.phoneNumber || "N/A"}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 0.5, color: "text.secondary" }}
                          title={programNameDisplay}
                        >
                          <SchoolIcon fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {programNameDisplay}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mb: 1, color: "text.secondary" }}
                          title={categoryNameDisplay}
                        >
                          <CategoryIcon fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {categoryNameDisplay}
                          </Typography>
                        </Stack>
                      </CardContent>
                      {/* Buttons Section: View CV (2/3) and Invite (1/3 if applicable) */}
                      <Box sx={{ p: 1.5, borderTop: "1px solid #f0f0f0", bgcolor: "grey.50" }}>
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ flex: canInvite ? 2 : 1 }}>
                            {trainee.cvPath ? (
                              <Tooltip title="View Trainee's CV" placement="top">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<DescriptionIcon />}
                                  href={trainee.cvPath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  fullWidth
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    transition: "transform 0.2s, background-color 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      backgroundColor: "primary.light",
                                    },
                                  }}
                                >
                                  View CV
                                </Button>
                              </Tooltip>
                            ) : (
                              <Chip
                                icon={<DescriptionIcon />}
                                label="No CV Provided"
                                variant="outlined"
                                size="small"
                                sx={{
                                  width: "100%",
                                  justifyContent: "flex-start",
                                  pl: 1,
                                  color: "text.disabled",
                                }}
                              />
                            )}
                          </Box>
                          {canInvite && (
                            <Box sx={{ flex: 1 }}>
                              <Grow in timeout={500 + idx * 50}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  fullWidth
                                  startIcon={<EmailIcon />}
                                  onClick={() => handleInvite(trainee.email, trainee.fullName)}
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                      transform: "scale(1.05) rotate(1deg)",
                                      boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                                      background: "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
                                    },
                                  }}
                                >
                                  Invite Trainee
                                </Button>
                              </Grow>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </StyledCard>
                  </Grid>
                </Fade>
              );
            })}
          </Grid>

          {/* Pagination: always rendered when totalPages > 0 */}
          {meta.totalPages > 0 && (
            <Stack alignItems="center" sx={{ mt: 4, mb: 2 }}>
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#1976d2 !important",
                    color: "#fff !important",
                  },
                }}
              />
            </Stack>
          )}
        </>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="image-preview-dialog-title"
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageModal}
            sx={{
              width: 'fit-content',
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1, // Ensure close button is above the image
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImageUrl}
            alt={selectedImageAlt}
            style={{ width: "50%", height: "auto", display: "block", margin: "auto"}}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}