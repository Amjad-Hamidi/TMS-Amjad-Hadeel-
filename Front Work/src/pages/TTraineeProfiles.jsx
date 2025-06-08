import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Pagination,
  Avatar,
  CircularProgress,
  TextField,
  IconButton,
  Slide,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from '@mui/icons-material/Article'; // Import icon for CV

import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LIMIT = 3;

export default function TTraineeProfiles() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTimeout, setSearchTimeout] = useState(null);

  // State for image preview dialog
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // State for CV preview dialog - ADDED
  const [openCvDialog, setOpenCvDialog] = useState(false);
  const [currentCvUrl, setCurrentCvUrl] = useState("");

  const fetchTrainees = async (page = 1, limit = LIMIT, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `https://amjad-hamidi-tms.runasp.net/api/Profiles/trainee-profiles?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      if (!response.ok) throw new Error("Failed to fetch trainee profiles.");
      const data = await response.json();
      setTrainees(data.items || []);
      setMeta({
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        limit: data.limit || LIMIT,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Error loading trainees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchTrainees(1, meta.limit, value);
      }, 500)
    );
  };

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  // Function to open image dialog
  const handleOpenImageDialog = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setOpenImageDialog(true);
  };

  // Function to close image dialog
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setCurrentImageUrl("");
  };

  // Function to open CV dialog - ADDED
  const handleOpenCvDialog = (cvUrl) => {
    setCurrentCvUrl(cvUrl);
    setOpenCvDialog(true);
  };

  // Function to close CV dialog - ADDED
  const handleCloseCvDialog = () => {
    setOpenCvDialog(false);
    setCurrentCvUrl("");
  };

  // Function to download CV
  const handleDownloadCv = async (userId) => {
    try {
      const response = await fetchWithAuth(`https://amjad-hamidi-tms.runasp.net/api/Profiles/download-cv/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      console.log('Backend Response:', response); // Check the full response object
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        throw new Error(`Failed to download CV. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Content-Disposition header:', contentDisposition); // Check what the header actually contains

      let filename = 'cv.pdf';
    if (contentDisposition) {
        // Try to extract from 'filename*=' (preferred for UTF-8 and special chars)
        let filenameMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-8'')?([^";]+)/i);

        if (filenameMatch && filenameMatch[1]) {
          // Decode URI component if it's encoded (e.g., for non-ASCII characters)
          // Also remove any trailing semicolons or spaces if they get captured
          filename = decodeURIComponent(filenameMatch[1].replace(/;$/, '').trim());
        } else {
          // Fallback to 'filename=' if 'filename*=' is not found or fails
          filenameMatch = contentDisposition.match(/filename=["']?([^";]+)/i);
          if (filenameMatch && filenameMatch[1]) {
            filename = decodeURIComponent(filenameMatch[1].replace(/;$/, '').trim());
          }
        }
      }
      console.log('Final download filename:', filename); // Final name before setting

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err); // Log the full error
      alert(err.message || "Error downloading CV");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", py: 4, boxSizing: "border-box" }}>
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <Button
            component={Link}
            to="/trainee/CompanyProfiles"
            variant="contained"
            startIcon={<BusinessIcon />}
            sx={{
              bgcolor: location.pathname === "/trainee/CompanyProfiles" ? "#2a3eb1" : "#3f51b5",
              "&:hover": { bgcolor: "#6573c3" },
              color: "white",
            }}
          >
            Company Profiles
          </Button>
          <Button
            component={Link}
            to="/trainee/SupervisorProfiles"
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            sx={{
              bgcolor: location.pathname === "/trainee/SupervisorProfiles" ? "#2e7d32" : "#388e3c",
              "&:hover": { bgcolor: "#4caf50" },
              color: "white",
            }}
          >
            Supervisor Profiles
          </Button>
          <Button
            component={Link}
            to="/trainee/TraineeProfiles"
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{
              bgcolor: location.pathname === "/trainee/TraineeProfiles" ? "#f57c00" : "#fb8c00",
              "&:hover": { bgcolor: "#ffb74d" },
              color: "white",
            }}
          >
            Trainee Profiles
          </Button>
        </Box>
      </Slide>
      <Box sx={{ ml: "70px" }}>
        <Typography variant="h4" mb={2} fontWeight={700} color="primary">
          Trainee Profiles
        </Typography>
        <TextField
          label="Search Trainees"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3, width: 350 }}
        />
        <Stack direction="row" spacing={1} mb={3}>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" />
          <Chip label={`Page: ${meta.page} / ${meta.totalPages}`} color="secondary" />
          <Chip label={`Limit: ${meta.limit}`} color="primary" />
        </Stack>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Stack direction="row" flexWrap="wrap" gap={3}>
              {trainees.length === 0 ? (
                <Typography>No trainees found.</Typography>
              ) : (
                trainees.map((trainee) => (
                  <Card
                    key={trainee.id}
                    sx={{
                      width: 270,
                      p: 2,
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Stack alignItems="center" spacing={1}>
                      <Avatar
                        src={trainee.profileImageUrl || undefined}
                        alt={trainee.fullName}
                        variant="rounded"
                        sx={{
                          width: "100%",
                          height: 160,
                          mb: 2,
                          objectFit: "cover",
                          bgcolor: trainee.profileImageUrl ? "transparent" : "grey.300",
                          cursor: trainee.profileImageUrl ? "pointer" : "default",
                        }}
                        onClick={() => trainee.profileImageUrl && handleOpenImageDialog(trainee.profileImageUrl)}
                      >
                        {!trainee.profileImageUrl && (
                          <PersonOutlineIcon sx={{ fontSize: 60, color: "grey.700" }} />
                        )}
                      </Avatar>
                      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                        <BadgeIcon color="action" />
                        <Typography variant="h6" fontWeight={700} textAlign="center">
                          {trainee.fullName}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ConfirmationNumberIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          ID: {trainee.id}
                        </Typography>
                      </Stack>
                      {/* Display Gender */}
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {trainee.gender === 0 ? ( // Assuming 0 for Male, 1 for Female
                          <MaleIcon fontSize="small" color="action" />
                        ) : (
                          <FemaleIcon fontSize="small" color="action" />
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {trainee.gender === 0 ? "Male" : "Female"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {trainee.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {trainee.phoneNumber}
                        </Typography>
                      </Stack>

                      {/* CV Section - ADDED */}
                      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                        <ArticleIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.primary">
                          CV:
                        </Typography>
                        {trainee.cvPath ? (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenCvDialog(trainee.cvPath)}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleDownloadCv(trainee.id)}
                            >
                              Download
                            </Button>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </Stack>

                      {trainee.isVerified && (
                        <Stack direction="row" alignItems="center" spacing={0.5} color="success.main">
                          <VerifiedUserIcon fontSize="small" />
                          <Typography variant="body2">Verified</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
            {meta.totalPages > 1 && (
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 4, display: "flex", justifyContent: "center" }}
              />
            )}
          </>
        )}
      </Box>

      {/* Image Preview Dialog */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 1 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              borderRadius: "50%",
              p: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
              },
            }}
          >
            <CloseIcon sx={{ color: "white", fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 0 }}>
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt="Trainee Profile Preview"
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CV Preview Dialog - ADDED */}
      <Dialog open={openCvDialog} onClose={handleCloseCvDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 1 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseCvDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              borderRadius: "50%",
              p: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
              },
            }}
          >
            <CloseIcon sx={{ color: "white", fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 0 }}>
          {currentCvUrl && (
            <iframe
              src={currentCvUrl}
              style={{ width: "100%", height: "calc(100vh - 64px)", border: "none" }}
              title="CV Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}