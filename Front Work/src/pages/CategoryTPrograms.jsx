import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchWithAuth } from "../utils/fetchWithAuth"; // Adjust path if necessary
import TraineeLayout from "../layouts/TraineeLayout";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  Chip,
  Stack,
  Tooltip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Event as EventIcon,
  PeopleOutline as PeopleOutlineIcon,
  Business as BusinessIcon,
  SupervisorAccount as SupervisorAccountIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  HourglassEmpty as HourglassEmptyIcon,
  FileUpload as FileUploadIcon,
  Cancel as CancelIcon,
  InfoOutlined as InfoOutlinedIcon,
  ArrowBack as ArrowBackIcon,
  Fingerprint as FingerprintIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

const BASE_URL = "http://amjad-hamidi-tms.runasp.net";

// ───────── STYLED COMPONENTS ──────────────────
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  overflow: "hidden", // Ensures content respects border radius
}));

const ImageContainer = styled(Box)({
  height: "180px", // Fixed height for consistency
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5", // Light background for images
  cursor: 'default',
});

const HoverableAttribute = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
  cursor: "default",
}));

const IconText = ({ icon, text, label }) => (
  <Tooltip title={label || text || "N/A"} arrow placement="top-start">
    <HoverableAttribute>
      {React.cloneElement(icon, { sx: { mr: 1, color: "text.secondary", fontSize: "1.1rem" } })}
      <Typography variant="body2" color="text.primary" sx={{ fontSize: "0.8rem" }}>
        {text || "N/A"}
      </Typography>
    </HoverableAttribute>
  </Tooltip>
);

// Formats ISO date string as “MMM DD, YYYY”
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getApprovalProps = (status) => {
  switch (status) {
    case 0: // Pending
      return { icon: <HourglassEmptyIcon fontSize="small" />, label: "Pending", color: "warning" };
    case 1: // Approved
      return { icon: <CheckCircleOutlineIcon fontSize="small" />, label: "Approved", color: "success" };
    case 2: // Rejected
      return { icon: <HighlightOffIcon fontSize="small" />, label: "Rejected", color: "error" };
    default:
      return { icon: <InfoOutlinedIcon fontSize="small" />, label: "Unknown", color: "default" };
  }
};

// ───────── APPLY DIALOG ──────────────────
function ApplyDialog({ open, onClose, programId, onSuccess }) {
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0] || null);
  };

  const handleSubmitApplication = async () => {
    if (!cvFile) {
      Swal.fire({ icon: "error", title: "Error", text: "Please upload your CV first." });
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("TrainingProgramId", programId.toString());
      formData.append("CV", cvFile);

      const response = await fetchWithAuth(
        `${BASE_URL}/api/ProgramEnrollments/enroll`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Application submission failed with status: ${response.status}`);
      }

      Swal.fire({ icon: "success", title: "Success!", text: responseText });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Application submission failed:", err);
      Swal.fire({ icon: "error", title: "Application Failed", text: err.message || "Could not submit application." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Apply for Program
        <IconButton onClick={onClose} size="small" sx={{ width: "fit-content", position: "absolute", right: 40 }}>
          <CancelIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          You are applying for Training Program ID: <strong>{programId}</strong>.
        </Typography>
        <Typography gutterBottom variant="body2">
          Please upload your CV to proceed.
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<FileUploadIcon />}
          sx={{ mt: 2, mb: 1 }}
        >
          {cvFile ? cvFile.name : "Upload CV (PDF, DOC, DOCX)"}
          <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        </Button>
        {cvFile && (
          <Typography variant="caption" display="block" sx={{ textAlign: "center" }}>
            Selected: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmitApplication}
          variant="contained"
          color="primary"
          disabled={!cvFile || submitting}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ───────── MAIN COMPONENT ───────────────────
export default function CategoryTPrograms() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Or make this configurable
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openApplyDialogFor, setOpenApplyDialogFor] = useState(null);

  const fetchData = useCallback(async () => {
    console.log("Fetching programs from:", `${BASE_URL}/api/TrainingPrograms/by-category/${categoryId}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/TrainingPrograms/by-category/${categoryId}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        let errorText = `Failed to fetch programs. Status: ${response.status}`;
        try {
          // Attempt to get a more specific error message from the response body
          const errorData = await response.json(); // Or response.text() if errors aren't JSON
          errorText = errorData.message || errorData.title || JSON.stringify(errorData) || errorText;
        } catch (e) {
          // If parsing the error response fails, use the status text or a generic message
          try {
            errorText = (await response.text()) || response.statusText || errorText;
          } catch (e2) {
            errorText = response.statusText || errorText;
          }
        }
        throw new Error(errorText);
      }

      const data = await response.json(); // This is the primary parsing
      console.log("API response data:", data);

      if (typeof data !== 'object' || data === null) {
        throw new Error("Received invalid data format from server.");
      }
      
      setPrograms(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error("Failed to fetch programs:", err);
      setError(err.message || "An unexpected error occurred while fetching programs.");
      setPrograms([]); // Clear programs on error
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, limit, searchTerm, fetchWithAuth]); // Ensure fetchWithAuth is stable or memoized

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch when fetchData changes (e.g. page, searchTerm)

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApplySuccess = () => {
    // Optionally, re-fetch data if application affects program details (e.g., seats available)
    // fetchData(); 
  };

  return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", pb: 4 }}>
          {/* ─── Sticky Back Text Button ─── */}
          <Tooltip title="Go Back" placement="bottom">
            <div
              onClick={() => navigate(-1)}
              style={{
                position: "fixed",
                top: "10px",
                right: "70px",
                zIndex: 9999,
                backgroundColor: "#1976d2",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "50px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
            >
              Back
            </div>
          </Tooltip>

          {/* ─── Title & Search Bar ─── */}
          <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.darker", mb: 2 }}>
              Training Programs
            </Typography>

            <TextField
              fullWidth
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page on new search
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <InfoOutlinedIcon color="action" />
                  </Box>
                ),
              }}
              sx={{
                mb: 3,
                bgcolor: "background.paper",
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.light" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
              }}
            />

            {totalCount > 0 && !loading && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ mb: 3 }}
                justifyContent="flex-start"
                flexWrap="wrap"
              >
                <Chip
                  icon={<InfoOutlinedIcon fontSize="small" sx={{ color: "primary.main" }} />}
                  label={`Total: ${totalCount}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    borderColor: "primary.main",
                    color: "primary.darker",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                <Chip
                  icon={<EventIcon fontSize="small" sx={{ color: "secondary.main" }} />}
                  label={`Page: ${page} / ${totalPages}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    borderColor: "secondary.main",
                    color: "secondary.darker",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                <Chip
                  icon={<PeopleOutlineIcon fontSize="small" sx={{ color: "info.main" }} />}
                  label={`Limit: ${limit}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    borderColor: "info.main",
                    color: "info.darker",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              </Stack>
            )}
          </Box>

          {/* ─── Loading / Error / Grid of Cards ─── */}
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "40vh" }}>
              <CircularProgress size={50} />
              <Typography sx={{ mt: 2 }}>Loading programs...</Typography>
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, my: 4 }}>
              {error}
            </Alert>
          ) : programs.length === 0 ? (
            <Alert severity="info" sx={{ mx: { xs: 2, md: 3 }, my: 4 }}>
              No training programs found for this category or matching your search.
            </Alert>
          ) : (
            <Box sx={{ px: { xs: 2, md: 3 } }}>
              <Grid container spacing={3} justifyContent="center">
                {programs.map((prog, idx) => {
                  const approvalProps = getApprovalProps(prog.approvalStatus);
                  return (
                    <Grid item xs={12} sm={8} md={5} lg={4} key={prog.trainingProgramId}>
                      <StyledCard elevation={2}>
                        <Tooltip title="Program Image" arrow>
                          <ImageContainer>
                            <CardMedia
                              component="img"
                              image={prog.imagePath || "https://via.placeholder.com/400x200.png?text=No+Image"}
                              alt={prog.title}
                              sx={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "auto",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </ImageContainer>
                        </Tooltip>

                        <CardContent sx={{ py: 2, px: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                            <FingerprintIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ fontWeight: "medium", color: "text.primary" }}>
                              ID: {prog.trainingProgramId}
                            </Typography>
                          </Stack>

                          <Tooltip title="Program Title" arrow>
                            <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500, mt: 0.3, cursor: 'default' }}>
                              {prog.title}
                            </Typography>
                          </Tooltip>

                          <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
                            <Chip
                              icon={<CategoryIcon fontSize="small" />}
                              label={prog.categoryName || "N/A"}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.75rem",
                                borderColor: "info.main",
                                color: "info.dark",
                              }}
                            />
                            <Chip
                              icon={approvalProps.icon}
                              label={approvalProps.label}
                              size="small"
                              variant="outlined"
                              color={approvalProps.color}
                              sx={{ fontSize: "0.75rem" }}
                            />
                            <Chip
                              label={prog.status ? "Open" : "Closed"}
                              size="small"
                              variant="outlined"
                              color={prog.status ? "success" : "default"}
                              sx={{ fontSize: "0.75rem" }}
                            />
                          </Stack>

                          <Tooltip title={`Average Rating: ${prog.rating?.toFixed(1) || 'N/A'} out of 5`} arrow>
                            <span style={{ display: 'inline-block', cursor: 'default' }}>
                              <Rating
                                value={prog.rating}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{ mb: 1, color: "warning.main" }}
                              />
                            </span>
                          </Tooltip>

                          <Tooltip title={prog.description || "No description provided."} arrow>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                cursor: 'default',
                              }}
                            >
                              {prog.description || "No description provided."}
                            </Typography>
                          </Tooltip>

                          <Stack spacing={0.5}>
                            <IconText
                              icon={<AccessTimeIcon />}
                              text={`${prog.durationInDays}`}
                              label="Duration (days)"
                            />
                            <IconText
                              icon={<LocationOnIcon />}
                              text={prog.location || "N/A"}
                              label="Location"
                            />
                            <IconText
                              icon={<EventIcon />}
                              text={formatDate(prog.startDate)}
                              label="Start Date"
                            />
                            <IconText
                              icon={<EventIcon />}
                              text={formatDate(prog.endDate)}
                              label="End Date"
                            />
                            <IconText
                              icon={<PeopleOutlineIcon />}
                              text={`${prog.seatsAvailable} seats`}
                              label="Seats Available"
                            />
                            <IconText
                              icon={<BusinessIcon />}
                              text={prog.companyName || "N/A"}
                              label="Company"
                            />
                            <IconText
                              icon={<SupervisorAccountIcon />}
                              text={prog.supervisorName || "N/A"}
                              label="Supervisor"
                            />
                            <IconText
                              icon={<CalendarTodayIcon />}
                              text={formatDate(prog.createdAt)}
                              label="Created At"
                            />
                          </Stack>
                        </CardContent>

                        <Box sx={{ borderTop: "1px solid #eee", p: 1.5, bgcolor: "grey.50" }}>
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={() => setOpenApplyDialogFor(prog.trainingProgramId)}
                            disabled={!prog.status || prog.seatsAvailable === 0}
                            sx={{
                              textTransform: "none",
                              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                              fontWeight: 500,
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                                background: "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
                              },
                            }}
                          >
                            Apply
                          </Button>
                        </Box>
                      </StyledCard>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: "bold",
                    },
                    "& .Mui-selected": {
                      backgroundColor: theme.palette.secondary.main,
                      color: "#fff"
                    }
                  }}
                />
              </Box>
            </Box>
          )}

          {openApplyDialogFor !== null && (
            <ApplyDialog
              open={true}
              onClose={() => setOpenApplyDialogFor(null)}
              programId={openApplyDialogFor}
              onSuccess={handleApplySuccess}
            />
          )}
        </Box>
  );
}