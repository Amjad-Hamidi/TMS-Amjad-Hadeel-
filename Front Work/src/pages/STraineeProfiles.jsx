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
  Chip
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
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LIMIT = 3;

export default function STraineeProfiles() {
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

  const fetchTrainees = async (page = 1, limit = LIMIT, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `http://amjad-hamidi-tms.runasp.net/api/Profiles/trainee-profiles?page=${page}&limit=${limit}`;
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

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", py: 4, boxSizing: "border-box" }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <Button
            component={Link}
            to="/supervisor/CompanyProfiles"
            variant="contained"
            startIcon={<BusinessIcon />}
            sx={{
              bgcolor: location.pathname === "/supervisor/CompanyProfiles" ? "#2a3eb1" : "#3f51b5",
              "&:hover": { bgcolor: "#6573c3" },
              color: "white",
            }}
          >
            Company Profiles
          </Button>
          <Button
            component={Link}
            to="/supervisor/SupervisorProfiles"
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            sx={{
              bgcolor: location.pathname === "/supervisor/SupervisorProfiles" ? "#2e7d32" : "#388e3c",
              "&:hover": { bgcolor: "#4caf50" },
              color: "white",
            }}
          >
            Supervisor Profiles
          </Button>
          <Button
            component={Link}
            to="/supervisor/TraineeProfiles"
            variant="contained"
            startIcon={<SchoolIcon />}
            sx={{
              bgcolor: location.pathname === "/supervisor/TraineeProfiles" ? "#f57c00" : "#fb8c00",
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
                        }}
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
                        <ConfirmationNumberIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="text.secondary">
                          ID: {trainee.id}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <VerifiedUserIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                        <Typography variant="body2" color="secondary">
                          {trainee.role || "Trainee"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton component="a" href={`mailto:${trainee.email}`} target="_blank" rel="noopener" color="primary">
                          <EmailIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.primary">
                          {trainee.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.primary">
                          {trainee.phoneNumber || "N/A"}
                        </Typography>
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
    </Box>
  );
}
