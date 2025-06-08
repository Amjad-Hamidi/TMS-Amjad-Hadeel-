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
  Tooltip,
  TextField,
  Pagination,
  Avatar,
  Dialog, // Import Dialog for the image preview
  DialogContent, // Import DialogContent for the image preview
  IconButton // Import IconButton for the close button
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  HourglassTop as HourglassTopIcon,
  EventNote as EventNoteIcon,
  LocationOn as LocationOnIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Link as LinkIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  ErrorOutline as ErrorOutlineIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  Close as CloseIcon // Import CloseIcon for the close button
} from '@mui/icons-material';
import { styled, alpha, useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // New state for image preview

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetchWithAuth(`https://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/my-enrollments?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();

        const appsFormatted = data.items.map(app => ({
          id: app.trainingProgramId,
          program: app.title,
          description: app.description || "No description.",
          duration: app.durationInDays ? `${app.durationInDays} days` : "N/A",
          start: app.startDate?.split("T")[0] || "N/A",
          end: app.endDate?.split("T")[0] || "N/A",
          location: app.location || "TBD",
          supervisor: app.supervisorName || "N/A",
          category: app.categoryName || "General",
          contentUrl: app.contentUrl,
          classroomUrl: app.classroomUrl,
          status: statusMap[app.status] || "Pending",
          imagePath: app.imagePath,
          response: app.status === 1
            ? "You've been accepted! See you soon 🎉"
            : app.status === 2
            ? "Unfortunately, your application was rejected."
            : "Application under review."
        }));

        setApps(appsFormatted);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);

      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [searchTerm, page]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleCloseImageDialog = () => setSelectedImage(null); // Function to close image dialog

  const shown = filter === "All" ? apps : apps.filter(a => a.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircleOutlineIcon sx={{ color: 'white' }} />;
      case 'Rejected': return <HighlightOffIcon sx={{ color: 'white' }} />;
      case 'Pending': return <HourglassTopIcon sx={{ color: 'white' }} />;
      default: return <ErrorOutlineIcon sx={{ color: 'action.disabled' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2, backgroundColor: alpha('#ffffff', 0.9) }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          My Training Program Applications
        </Typography>

        <TextField
          fullWidth
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, bgcolor: "background.paper", borderRadius: 1 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="Application status filter"
            color="primary"
          >
            {[
              { label: "All" },
              { label: "Pending", color: "warning.main" },
              { label: "Accepted", color: "success.main" },
              { label: "Rejected" }
            ].map(st => (
              <ToggleButton
                key={st.label}
                value={st.label}
                aria-label={st.label.toLowerCase()}
                sx={{ px: 2, py: 1, fontWeight: 'medium', color: st.color ? theme.palette[st.color.split('.')[0]].main : undefined }}
              >
                {st.label}
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
                  avatar={
                    <Avatar
                      src={app.imagePath}
                      variant="rounded"
                      sx={{ width: 56, height: 56, cursor: 'pointer' }} // Added cursor pointer
                      onClick={() => setSelectedImage(app.imagePath)} // Added onClick to open image dialog
                    >
                      {!app.imagePath && <ImageIcon />} {/* Fallback icon if no image */}
                    </Avatar>
                  }
                  title={<Tooltip title="Program Title" arrow placement="right"><span>{`#${app.id} - ${app.program}`}</span></Tooltip>}
                  subheader={
                    <Tooltip title="Category" arrow placement="right">
                      <Chip icon={<CategoryIcon />} label={app.category} size="small" variant="outlined" />
                    </Tooltip>
                  }
                  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Tooltip title="Description" arrow placement="right">
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: '0', maxHeight: '120px', overflowY: 'auto' }}>
                      {app.description}
                    </Typography>
                  </Tooltip>

                  <Stack spacing={1.5} my={2}>
                    <Tooltip title="Duration" arrow placement="right"><Chip icon={<EventNoteIcon />} label={app.duration} size="small" variant="outlined" /></Tooltip>
                    <Tooltip title="Location" arrow placement="right"><Chip icon={<LocationOnIcon />} label={app.location} size="small" variant="outlined" /></Tooltip>
                    <Tooltip title="Supervisor" arrow placement="right"><Chip icon={<SupervisorAccountIcon />} label={app.supervisor} size="small" variant="outlined" /></Tooltip>
                    <Tooltip title="Start & End Date" arrow placement="right"><Chip icon={<EventNoteIcon />} label={`Start: ${app.start} | End: ${app.end}`} size="small" variant="outlined" /></Tooltip>
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
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

      {/* ─── نافذة معاينة الصورة فقط ────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          dividers // يمكنك إزالة هذا إذا كان هو مصدر الخط الفاصل بين المحتوى والزر
          sx={{ position: 'relative', p: 0 }} // p: 0 لإزالة الـ padding الافتراضي، ثم سنضيف padding يدوي للصورة
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: 'fit-content',
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1, // لضمان ظهور الزر فوق الصورة
              backgroundColor: 'rgba(0, 16, 88, 0.7)', // خلفية خفيفة لمساعدة الرؤية على الصورة
              '&:hover': {
                backgroundColor: 'rgba(71, 196, 245, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Program Image Preview"
              sx={{
                width: '50%',
                height: 'auto',
                maxHeight: '80vh', // حد أقصى للارتفاع لكي لا تكون الصورة كبيرة جدًا
                display: 'block',
                mx: 'auto',
                objectFit: 'contain',
                p: 2, // إضافة padding للصورة نفسها بدلاً من DialogTitle
                margin: 'auto'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}