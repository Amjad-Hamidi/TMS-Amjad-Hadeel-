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
  DialogTitle, // Import DialogTitle for the button placement
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

import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LIMIT = 3;

export default function TCompanyProfiles() {
  const [companies, setCompanies] = useState([]);
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

  const fetchCompanies = async (page = 1, limit = LIMIT, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `https://amjad-hamidi-tms.runasp.net/api/Profiles/company-profiles?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const response = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      if (!response.ok) throw new Error("Failed to fetch company profiles.");
      const data = await response.json();
      setCompanies(data.items || []);
      setMeta({
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        limit: data.limit || LIMIT,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Error loading companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(meta.page, meta.limit, search);
  }, [meta.page, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchCompanies(1, meta.limit, value);
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
          Company Profiles
        </Typography>
        <TextField
          label="Search Companies"
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
              {companies.length === 0 ? (
                <Typography>No companies found.</Typography>
              ) : (
                companies.map((company) => (
                  <Card
                    key={company.id}
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
                        src={company.profileImageUrl || undefined}
                        alt={company.fullName}
                        variant="rounded"
                        sx={{
                          width: "100%",
                          height: 160,
                          mb: 2,
                          objectFit: "cover",
                          bgcolor: company.profileImageUrl ? "transparent" : "grey.300",
                          cursor: company.profileImageUrl ? "pointer" : "default", // Add pointer cursor
                        }}
                        // Add onClick handler to open the image dialog
                        onClick={() => company.profileImageUrl && handleOpenImageDialog(company.profileImageUrl)}
                      >
                        {!company.profileImageUrl && (
                          <PersonOutlineIcon sx={{ fontSize: 60, color: "grey.700" }} />
                        )}
                      </Avatar>
                      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                        <BadgeIcon color="action" />
                        <Typography variant="h6" fontWeight={700} textAlign="center">
                          {company.fullName}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ConfirmationNumberIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          ID: {company.id}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {company.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {company.phoneNumber}
                        </Typography>
                      </Stack>
                      {company.isVerified && (
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
              position: 'absolute',
              right: 8,
              top: 8,
              // color: (theme) => theme.palette.grey[500], // This was making the icon grey
              bgcolor: 'primary.main', // Blue background
              width: 'fit-content',
              borderRadius: '50%', // Make it perfectly round
              p: 0.5, // Small padding
              '&:hover': {
                bgcolor: 'primary.dark', // Darker blue on hover
                transform: 'scale(1.1)', // Slight scale effect
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out', // Smooth transition
              },
            }}
          >
            <CloseIcon sx={{ color: 'white' }} /> {/* White icon for contrast */}
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt="Company Profile Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}