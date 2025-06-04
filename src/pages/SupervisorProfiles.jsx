import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Pagination,
  Avatar,
  CircularProgress,
  TextField,
  IconButton
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';
import { Slide } from '@mui/material';

const LIMIT = 8;

export default function SupervisorProfiles() {
  console.log("SupervisorProfiles component rendering"); // Log 1: Component render
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

  const fetchSupervisors = async (page = 1, limit = LIMIT, searchTerm = "") => {
    console.log("fetchSupervisors called with:", { page, limit, searchTerm }); // Log 2: Fetch function called
    setLoading(true);
    setError("");
    try {
      let url = `http://amjad-hamidi-tms.runasp.net/api/Profiles/supervisor-profiles?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      console.log("Fetching URL:", url); // Log 3: URL
      const response = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      console.log("API Response object:", response); // Log 4: Raw response
      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText); // Log 5: Error status
        throw new Error(`Failed to fetch supervisor profiles. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Data received:", data); // Log 6: Parsed data
      setSupervisors(data.items || []);
      setMeta({
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        limit: data.limit || LIMIT,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      console.error("Error in fetchSupervisors:", err); // Log 7: Catch block
      setError(err.message || "Error loading supervisors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered for SupervisorProfiles", { page: meta.page, search }); // Log 8: useEffect
    fetchSupervisors(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      fetchSupervisors(1, meta.limit, value);
    }, 500));
  };

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: "auto", py: 4, boxSizing: 'border-box' }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <Button
            component={Link}
            to="/company/CompanyProfiles"
            variant="contained"
            startIcon={<BusinessIcon />}
            sx={{
              bgcolor: location.pathname === '/company/CompanyProfiles' ? '#2a3eb1' : '#3f51b5',
              '&:hover': { bgcolor: '#6573c3' },
              color: 'white',
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
              bgcolor: location.pathname === '/company/SupervisorProfiles' ? '#2e7d32' : '#388e3c',
              '&:hover': { bgcolor: '#4caf50' },
              color: 'white',
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
              bgcolor: location.pathname === '/company/TraineeProfiles' ? '#f57c00' : '#fb8c00',
              '&:hover': { bgcolor: '#ffb74d' },
              color: 'white',
            }}
          >
            Trainee Profiles
          </Button>
        </Box>
      </Slide>
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
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <Avatar
                      src={supervisor.profileImageUrl || undefined}
                      alt={supervisor.fullName}
                      variant="rounded"
                      sx={{
                        width: '100%',
                        height: 160, // Adjust height as needed
                        mb: 2,
                        objectFit: 'cover', // Ensures the image covers the area
                        bgcolor: supervisor.profileImageUrl ? 'transparent' : 'grey.300' // Placeholder background
                      }}
                    >
                      {!supervisor.profileImageUrl && <PersonOutlineIcon sx={{ fontSize: 60, color: 'grey.700' }} />}
                    </Avatar>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                      <BadgeIcon color="action" />
                      <Typography variant="h6" fontWeight={700} textAlign="center">{supervisor.fullName}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ConfirmationNumberIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2" color="text.secondary">ID: {supervisor.id}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <VerifiedUserIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2" color="secondary">{supervisor.role || "Supervisor"}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton component="a" href={`mailto:${supervisor.email}`} target="_blank" rel="noopener" color="primary">
                        <EmailIcon />
                      </IconButton>
                      <Typography variant="body2" color="text.primary">{supervisor.email}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.primary">{supervisor.phoneNumber || "N/A"}</Typography>
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
  );
}
