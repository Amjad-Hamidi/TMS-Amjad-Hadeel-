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
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  DialogTitle, // Import DialogTitle
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon for the dialog
import ArticleIcon from '@mui/icons-material/Article'; // Import icon for CV

import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LIMIT = 3;

export default function CSupervisorProfiles() {
  const [supervisors, setSupervisors] = useState([]);
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

  // State for CV preview dialog
  const [openCvDialog, setOpenCvDialog] = useState(false);
  const [currentCvUrl, setCurrentCvUrl] = useState("");

  const fetchSupervisors = async (page = 1, limit = LIMIT, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `https://amjad-hamidi-tms.runasp.net/api/Profiles/supervisor-profiles?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      if (!response.ok) throw new Error(`Failed to fetch supervisor profiles. Status: ${response.status}`);
      const data = await response.json();
      setSupervisors(data.items || []);
      setMeta({
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        limit: data.limit || LIMIT,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Error loading supervisors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchSupervisors(1, meta.limit, value);
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

  // Function to open CV dialog
  const handleOpenCvDialog = (cvUrl) => {
    setCurrentCvUrl(cvUrl);
    setOpenCvDialog(true);
  };

  // Function to close CV dialog
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
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <Button
            component={Link}
            to="/company/CompanyProfiles"
            variant="contained"
            startIcon={<BusinessIcon />}
            sx={{
              bgcolor: location.pathname === "/company/CompanyProfiles" ? "#2a3eb1" : "#3f51b5",
              "&:hover": { bgcolor: "#6573c3" },
              color: "white",
            }}
          >
            Company Profiles
          </Button>
          <Button
            component={Link}
            to="/company/SupervisorProfiles"
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            sx={{
              bgcolor: location.pathname === "/company/SupervisorProfiles" ? "#2e7d32" : "#388e3c",
              "&:hover": { bgcolor: "#4caf50" },
              color: "white",
            }}
          >
            Supervisor Profiles
          </Button>
          <Button
            component={Link}
            to="/company/TraineeProfiles"
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{
              bgcolor: location.pathname === "/company/TraineeProfiles" ? "#f57c00" : "#fb8c00",
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
          Supervisor Profiles
        </Typography>
        <TextField
          label="Search Supervisors"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3, width: 350 }}
        />

        {/* عرض مؤشرات Total, Page, Limit بشكل أنيق */}
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
              {supervisors.length === 0 ? (
                <Typography>No supervisors found.</Typography>
              ) : (
                supervisors.map((supervisor) => (
                  <Card
                    key={supervisor.id}
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
                      {/* Avatar with onClick to open image dialog */}
                      <Avatar
                        src={supervisor.profileImageUrl || undefined}
                        alt={supervisor.fullName}
                        variant="rounded"
                        sx={{
                          width: "100%",
                          height: 160,
                          mb: 2,
                          objectFit: "cover",
                          bgcolor: supervisor.profileImageUrl ? "transparent" : "grey.300",
                          cursor: supervisor.profileImageUrl ? "pointer" : "default", // Add pointer cursor
                        }}
                        onClick={() => supervisor.profileImageUrl && handleOpenImageDialog(supervisor.profileImageUrl)}
                      >
                        {!supervisor.profileImageUrl && (
                          <PersonOutlineIcon sx={{ fontSize: 60, color: "grey.700" }} />
                        )}
                      </Avatar>
                      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                        <BadgeIcon color="action" />
                        <Typography variant="h6" fontWeight={700} textAlign="center">
                          {supervisor.fullName}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ConfirmationNumberIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          ID: {supervisor.id}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <VerifiedUserIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="secondary">
                          {supervisor.role || "Supervisor"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton component="a" href={`mailto:${supervisor.email}`} target="_blank" rel="noopener" color="primary">
                          <EmailIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.primary">
                          {supervisor.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.primary">
                          {supervisor.phoneNumber || "N/A"}
                        </Typography>
                      </Stack>

                      {/* CV Section */}
                      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                        <ArticleIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.primary">
                          CV:
                        </Typography>
                        {supervisor.cvPath ? (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenCvDialog(supervisor.cvPath)}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleDownloadCv(supervisor.id)}
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
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
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
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'primary.main', // Blue background
              width: 32, // Set a specific width
              height: 32, // Set an equal height
              borderRadius: '50%', // Make it perfectly round
              p: 0, // No extra padding, icon fills the 32x32 area
              display: 'flex', // Ensures icon is centered
              justifyContent: 'center', // Ensures icon is centered
              alignItems: 'center', // Ensures icon is centered
              '&:hover': {
                bgcolor: 'primary.dark', // Darker blue on hover
                transform: 'scale(1.1)', // Slight scale effect
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out', // Smooth transition
              },
            }}
          >
            <CloseIcon sx={{ color: 'white', fontSize: 20 }} /> {/* White icon, adjust font size if needed */}
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt="Supervisor Profile Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CV Preview Dialog */}
      <Dialog open={openCvDialog} onClose={handleCloseCvDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 1 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseCvDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              borderRadius: '50%',
              p: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
              },
            }}
          >
            <CloseIcon sx={{ color: 'white', fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
          {currentCvUrl && (
            <iframe
              src={currentCvUrl}
              style={{ width: '100%', height: 'calc(100vh - 64px)', border: 'none' }} // Adjust height as needed
              title="CV Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}