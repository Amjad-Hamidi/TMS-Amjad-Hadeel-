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
  IconButton,
  Link as MuiLink, // Alias to avoid conflict if HTML link is used
  Tooltip,
} from "@mui/material";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description'; // For CV
import CategoryIcon from '@mui/icons-material/Category'; // For Category
import SchoolIcon from '@mui/icons-material/School'; // For Training Program
import FingerprintIcon from '@mui/icons-material/Fingerprint'; // For ID

const LIMIT = 8; // Or whatever limit is preferred

const TraineesList = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("company"); // 'company' or 'allPlatform'
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setMeta(prev => ({ ...prev, page: 1 })); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchTrainees = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url;
    if (viewType === "company") {
      // Fetches trainees specifically associated with the company's programs
      url = `http://amjad-hamidi-tms.runasp.net/api/Users/trainees-company?page=${meta.page}&limit=${meta.limit}&search=${encodeURIComponent(debouncedSearch)}`;
    } else { // 'allPlatform'
      // Fetches all trainees visible on the platform to this company
      url = `http://amjad-hamidi-tms.runasp.net/api/Users/all-trainees?page=${meta.page}&limit=${meta.limit}&search=${encodeURIComponent(debouncedSearch)}`;
    }

    try {
      const res = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Failed to fetch trainees: ${res.status} ${errorData}`);
      }
      const data = await res.json();
      setTrainees(data.items || []);
      setMeta(prevMeta => ({
        ...prevMeta,
        totalCount: data.totalCount,
        page: data.page,
        // limit: data.limit, // Limit is controlled by const LIMIT, API might return its own
        totalPages: data.totalPages,
      }));
    } catch (err) {
      console.error("Error fetching trainees:", err);
      setError(`Failed to load trainees. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, debouncedSearch, viewType]);

  useEffect(() => {
    fetchTrainees();
  }, [fetchTrainees]); // Re-fetch when fetchTrainees changes (due to its dependencies)

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
    setMeta(prev => ({ ...prev, page: 1 })); // Reset to page 1 on view type change
  };
  
  const handleInvite = (email, traineeName) => {
    const subject = encodeURIComponent(`Invitation to Connect`);
    const body = encodeURIComponent(`Dear ${traineeName},

I came across your profile on the platform and would like to connect with you.

Best regards,
[Your Name/Company Name]`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };


  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 3 }, minHeight: "90vh", backgroundColor: "grey.100" }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3, backgroundColor: "white" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
            {viewType === "company" ? "Company Program Trainees" : "All Platform Trainees"}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant={viewType === "company" ? "contained" : "outlined"}
              onClick={() => handleViewTypeChange("company")}
              sx={{ borderRadius: 2 }}
            >
              Company Program Trainees
            </Button>
            <Button
              variant={viewType === "allPlatform" ? "contained" : "outlined"}
              onClick={() => handleViewTypeChange("allPlatform")}
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
          sx={{ mb: 2, backgroundColor: "grey.50", borderRadius: 1 }}
        />
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5, flexWrap: "wrap" }}>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" variant="outlined" size="small" />
          <Chip label={`Page: ${meta.page} / ${meta.totalPages}`} color="secondary" variant="outlined" size="small" />
          <Chip label={`Limit: ${meta.limit}`} color="info" variant="outlined" size="small" />
        </Stack>
      </Paper>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "40vh" }}>
          <CircularProgress size={50} />
          <Typography sx={{mt: 2}}>Loading Trainees...</Typography>
        </Stack>
      ) : error ? (
        <Typography color="error" textAlign="center" sx={{ my: 5 }}>{error}</Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ p: 3, alignItems: 'stretch' }}>
            {trainees.length === 0 ? (
              <Grid item xs={12} sx={{textAlign: 'center', my: 5}}>
                <Typography variant="h6" color="text.secondary">No trainees found for the current criteria.</Typography>
              </Grid>
            ) : (
              trainees.map((trainee, idx) => {
                let programNameDisplay = "N/A";
                let categoryNameDisplay = "N/A";

                if (viewType === 'company') {
                  programNameDisplay = trainee.trainingProgramName || "N/A";
                  categoryNameDisplay = trainee.categoryName || "N/A";
                } else { // 'allPlatform'
                  if (trainee.trainingPrograms && trainee.trainingPrograms.length > 0) {
                    programNameDisplay = trainee.trainingPrograms[0].title || "N/A";
                  }
                  if (trainee.categories && trainee.categories.length > 0) {
                    categoryNameDisplay = trainee.categories[0].name || "N/A";
                  }
                }

                return (
                  <Fade in={!loading} timeout={500 + idx * 100} key={trainee.id}>
                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                      <Card
                        elevation={1}
                        sx={{
                          borderRadius: 3,
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px) scale(1.02)",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
                          },
                          display: "flex",
                          flexDirection: "column",
                          height: "100%", // Ensure cards in a row have same height
                          backgroundColor: "white"
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="180"
                          image={trainee.profileImageUrl || `https://source.unsplash.com/random/300x180?avatar,person,${idx}`}
                          alt={trainee.fullName}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5, color: "text.primary" }} noWrap>
                            {trainee.fullName}
                          </Typography>
                          
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, color: "text.secondary"}}>
                              <FingerprintIcon fontSize="small" />
                              <Typography variant="body2">ID: {trainee.id}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, color: "text.secondary"}}>
                              <EmailIcon fontSize="small" />
                              <MuiLink href={`mailto:${trainee.email}`} variant="body2" sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }} noWrap title={trainee.email}>
                                {trainee.email}
                              </MuiLink>
                          </Stack>
                          {trainee.phoneNumber && (
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, color: "text.secondary"}}>
                              <PhoneIcon fontSize="small" />
                              <Typography variant="body2">{trainee.phoneNumber}</Typography>
                            </Stack>
                          )}
                          {programNameDisplay !== "N/A" && (
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 0.5, color: "text.secondary"}}>
                              <SchoolIcon fontSize="small" />
                              <Typography variant="body2" title={programNameDisplay}>{programNameDisplay}</Typography>
                            </Stack>
                          )}
                          {categoryNameDisplay !== "N/A" && (
                             <Stack direction="row" alignItems="center" spacing={0.5} sx={{mb: 1, color: "text.secondary"}}>
                              <CategoryIcon fontSize="small" />
                              <Typography variant="body2">{categoryNameDisplay}</Typography>
                            </Stack>
                          )}
                        </CardContent>
                        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
                          {trainee.cvPath ? (
                            <Tooltip title="View Trainee's CV" placement="top">
                              <Button
                                href={trainee.cvPath}
                                target="_blank"
                                rel="noreferrer"
                                variant="outlined"
                                size="small"
                                startIcon={<DescriptionIcon />}
                                sx={{
                                  flexGrow: 1,
                                  borderRadius: 2,
                                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: (theme) => theme.shadows[4],
                                  }
                                }}
                              >
                                View CV
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="This trainee has not uploaded a CV yet." placement="top">
                              <Chip
                                icon={<DescriptionIcon fontSize="small" />}
                                label="No CV Provided"
                                variant="outlined"
                                size="small"
                                color="default"
                                sx={{
                                  flexGrow: 1,
                                  borderRadius: 2,
                                  cursor: 'default',
                                  height: '31px', // Match button size small approx height
                                  '.MuiChip-label': { fontSize: '0.8125rem' }, // Match button font size
                                  justifyContent: 'center',
                                  paddingLeft: '12px', // Adjust for icon
                                  paddingRight: '12px',
                                }}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title={`Send an invitation email to ${trainee.fullName}`} placement="top">
                            <Button 
                                variant="contained" 
                                size="small" 
                                onClick={() => handleInvite(trainee.email, trainee.fullName)}
                                startIcon={<EmailIcon />}
                                sx={{
                                  flexGrow: 1,
                                  borderRadius: 2,
                                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: (theme) => theme.shadows[4],
                                  }
                                }}
                              >
                                Invite
                              </Button>
                            </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  </Fade>
                );
              })
            )}

          </Grid>
          {trainees.length > 0 && (
            <Stack alignItems="center" sx={{ mt: 4, mb: 2 }}>
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default TraineesList;
