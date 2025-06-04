// src/pages/TraineeApplications.jsx
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Link as MuiLink,
  Tooltip
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  HourglassTop as HourglassTopIcon,
  EventNote as EventNoteIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Link as LinkIcon,
  School as SchoolIcon,
  Search as SearchIcon, // For 'Browse Similar Programs'
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const statusMap = {
  0: "Pending",
  1: "Accepted",
  2: "Rejected"
};

const StyledCard = styled(Card)(({ theme, status }) => ({
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  borderLeft: `5px solid ${
    status === 'Accepted' ? theme.palette.success.main :
    status === 'Rejected' ? theme.palette.error.main :
    status === 'Pending' ? theme.palette.warning.main :
    theme.palette.grey[400]
  }`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatusBadge = styled(Box)(({ theme, status }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '0.8rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: 
    status === 'Accepted' ? theme.palette.success.main :
    status === 'Rejected' ? theme.palette.error.main :
    status === 'Pending' ? theme.palette.warning.main :
    theme.palette.grey[500],
}));

export default function TraineeApplications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/my-enrollments");
        const text = await res.text();
        const data = JSON.parse(text);

        const appsFormatted = data.items.map(app => ({
          id: app.trainingProgramId,
          program: app.title,
          description: app.description || "No description.",
          duration: app.durationInDays ? `${app.durationInDays} days` : "N/A",
          start: app.startDate?.split("T")[0] || "N/A",
          end: app.endDate?.split("T")[0] || "N/A",
          location: app.location || "TBD",
          submitted: "—", // If your API supports it later, replace here.
          status: statusMap[app.status] || "Pending",
          response: app.status === 1
            ? "You've been accepted! See you soon 🎉"
            : app.status === 2
            ? "Unfortunately, your application was rejected."
            : "Application under review.",
          supervisor: app.supervisorName || "N/A",
          category: app.categoryName || "General"
        }));

        setApps(appsFormatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const shown = filter === "All" ? apps : apps.filter(a => a.status === filter);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />;
      case 'Rejected': return <HighlightOffIcon sx={{ color: 'error.main' }} />;
      case 'Pending': return <HourglassTopIcon sx={{ color: 'warning.main' }} />;
      default: return <ErrorOutlineIcon sx={{ color: 'action.disabled' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2, backgroundColor: alpha('#ffffff', 0.9) }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          My Training Program Applications
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="Application status filter"
            color="primary"
          >
            {["All", "Pending", "Accepted", "Rejected"].map(st => (
              <ToggleButton key={st} value={st} aria-label={st.toLowerCase()} sx={{ px: 2, py: 1, fontWeight: 'medium' }}>
                {st}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mt: 2, fontSize: '1.1rem' }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {shown.length > 0 ? shown.map(app => (
            <Grid item xs={12} sm={6} md={4} key={app.id}>
              <StyledCard status={app.status}>
                <CardHeader
                  avatar={getStatusIcon(app.status)}
                  title={`#${app.id} - ${app.program}`}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'medium', noWrap: true }}
                  subheader={app.category}
                  subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: '60px', maxHeight: '120px', overflowY: 'auto' }}>
                    {app.description}
                  </Typography>
                  
                  <Stack spacing={1.5} my={2}>
                    <Chip icon={<EventNoteIcon />} label={`Duration: ${app.duration}`} size="small" variant="outlined" />
                    <Chip icon={<LocationOnIcon />} label={`Location: ${app.location}`} size="small" variant="outlined" />
                    <Chip icon={<SupervisorAccountIcon />} label={`Supervisor: ${app.supervisor}`} size="small" variant="outlined" />
                    <Chip icon={<EventNoteIcon />} label={`Start: ${app.start} | End: ${app.end}`} size="small" variant="outlined" />
                  </Stack>

                  <StatusBadge status={app.status}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </StatusBadge>
                  <Typography variant="body2" sx={{ mt: 1.5, fontStyle: 'italic', color: app.status === 'Accepted' ? 'success.dark' : app.status === 'Rejected' ? 'error.dark' : 'text.secondary' }}>
                    {app.response}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
                  {app.contentUrl && (
                    <Button 
                      size="small" 
                      startIcon={<LinkIcon />} 
                      href={app.contentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      variant="outlined"
                    >
                      Content
                    </Button>
                  )}
                  {app.classroomUrl && (
                    <Button 
                      size="small" 
                      startIcon={<SchoolIcon />} 
                      href={app.classroomUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      variant="outlined"
                    >
                      Classroom
                    </Button>
                  )}
                  {app.status === "Rejected" && (
                    <Button size="small" startIcon={<SearchIcon />} color="secondary" variant="contained">
                      Browse Similar
                    </Button>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2, textAlign: 'center', py: 3, fontSize: '1.2rem' }}>
                No applications match the current filter.
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
