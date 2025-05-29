import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
  Stack,
  TextField,
  Chip,
  Pagination,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Fade
} from "@mui/material";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { CheckCircle, HourglassEmpty, Cancel, Apps, Category, SupervisorAccount, CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';

const LIMIT = 8;

export default function CompanyTrainingPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });
  const [tab, setTab] = useState("All");

  const fetchAllPrograms = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, rejectedRes, approvedRes] = await Promise.all([
        fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/my-pending?page=1&limit=100`),
        fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/my-rejected?page=1&limit=100`),
        fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/my-approved?page=1&limit=100`),
      ]);
      const pending = (await pendingRes.json()).items || [];
      const rejected = (await rejectedRes.json()).items || [];
      const approved = (await approvedRes.json()).items || [];
      let all = [...pending, ...rejected, ...approved];
      if (search) {
        const s = search.toLowerCase();
        all = all.filter(p =>
          p.title?.toLowerCase().includes(s) ||
          p.supervisorName?.toLowerCase().includes(s) ||
          p.categoryName?.toLowerCase().includes(s)
        );
      }
      setPrograms(all);
      setLoading(false);
    } catch (err) {
      setError("Failed to load programs.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPrograms(search);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchAllPrograms(search);
      }, 500)
    );
    // eslint-disable-next-line
  }, [search]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const filtered =
    tab === "All"
      ? programs
      : programs.filter((p) => {
          if (tab === "Approved") return p.approvalStatus === 1;
          if (tab === "Rejected") return p.approvalStatus === 2;
          if (tab === "Pending") return p.approvalStatus === 0;
          return true;
        });

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Pending", label: "Pending" },
  ];

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72", mb: 2 }}>
          My Training Programs
        </Typography>
        <List sx={{ display: 'flex', flexDirection: 'row', p: 0, m: 0, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2, maxWidth: 500, mx: 'auto' }}>
          {statusOptions.map(opt => (
            <ListItem key={opt.value} disablePadding sx={{ width: 'auto' }}>
              <ListItemButton
                selected={tab === opt.value}
                onClick={() => setTab(opt.value)}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  mx: 0.5,
                  color: tab === opt.value
                    ? (opt.value === 'Approved' ? 'success.main' : opt.value === 'Rejected' ? 'error.main' : opt.value === 'Pending' ? 'warning.main' : 'primary.main')
                    : 'text.primary',
                  backgroundColor: tab === opt.value
                    ? (opt.value === 'Approved' ? 'success.light' : opt.value === 'Rejected' ? 'error.light' : opt.value === 'Pending' ? 'warning.light' : 'primary.light')
                    : 'background.paper',
                  fontWeight: tab === opt.value ? 700 : 400,
                  fontSize: 15,
                  minWidth: 80,
                  transition: 'all 0.2s',
                }}
              >
                {opt.value === 'Approved' && <CheckCircle sx={{ mr: 1, color: 'success.main' }} />}
                {opt.value === 'Rejected' && <Cancel sx={{ mr: 1, color: 'error.main' }} />}
                {opt.value === 'Pending' && <HourglassEmpty sx={{ mr: 1, color: 'warning.main' }} />}
                {opt.value === 'All' && <Apps sx={{ mr: 1, color: 'primary.main' }} />}
                <ListItemText primary={opt.label} primaryTypographyProps={{ fontWeight: tab === opt.value ? 700 : 400, fontSize: 15 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <TextField
          variant="outlined"
          placeholder="Search programs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2, mb: 2 }}
        />
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`Total: ${filtered.length}`} color="primary" />
          <Chip label={`Page: 1 / 1`} color="secondary" />
          <Chip label={`Limit: ${LIMIT}`} color="info" />
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {filtered.length === 0 ? (
              <Grid item xs={12}><Typography>No programs found for "{tab}".</Typography></Grid>
            ) : (
              filtered.map((p, idx) => (
                <Fade in={!loading} timeout={600 + idx * 120} key={p.trainingProgramId || idx}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      elevation={4}
                      sx={{
                        borderRadius: 4,
                        background: "#f9fafb",
                        boxShadow: "0 4px 24px 0 #00000014",
                        minHeight: 340,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.03)",
                          boxShadow: "0 8px 32px 0 #00000022",
                        },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {p.imagePath && (
                        <CardMedia
                          component="img"
                          height="180"
                          image={p.imagePath}
                          alt={p.title}
                          sx={{ objectFit: "cover" }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                          {p.title}
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2" color="text.secondary"><Apps sx={{ mr: 0.5, fontSize: 18 }} /> <strong>ID:</strong> {p.trainingProgramId}</Typography>
                          {p.categoryName && <Typography variant="body2" color="text.secondary"><Category sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Category:</strong> {p.categoryName}</Typography>}
                          {p.supervisorName && <Typography variant="body2" color="text.secondary"><SupervisorAccount sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Supervisor:</strong> {p.supervisorName}</Typography>}
                          {p.durationInDays && <Typography variant="body2" color="text.secondary"><AccessTime sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Duration:</strong> {p.durationInDays}</Typography>}
                          {p.startDate && <Typography variant="body2" color="text.secondary"><CalendarToday sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Start:</strong> {new Date(p.startDate).toLocaleDateString()}</Typography>}
                          {p.endDate && <Typography variant="body2" color="text.secondary"><CalendarToday sx={{ mr: 0.5, fontSize: 18 }} /> <strong>End:</strong> {new Date(p.endDate).toLocaleDateString()}</Typography>}
                          {p.location && <Typography variant="body2" color="text.secondary"><LocationOn sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Location:</strong> {p.location}</Typography>}
                          {p.rejectionReason && <Typography variant="body2" color="text.secondary"><Cancel sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Rejection Reason:</strong> {p.rejectionReason}</Typography>}
                          {p.status && <Chip label={p.status} color={
                            p.status === "Approved" ? "success" :
                            p.status === "Rejected" ? "error" :
                            p.status === "Pending" ? "warning" : "default"
                          } sx={{ mt: 1 }} />}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Fade>
              ))
            )}
          </Grid>
        )}
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={meta.totalPages}
            page={meta.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
