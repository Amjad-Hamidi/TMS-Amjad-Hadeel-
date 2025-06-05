import React, { useState, useEffect } from 'react';
import '../styles/CompanyApplications.css';
import { fetchWithAuth } from '../utils/fetchWithAuth';
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
  Paper,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fade,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material";
import { CheckCircle, HourglassEmpty, Cancel, Person, Email, Assignment, CalendarToday } from '@mui/icons-material';

const statusMap = {
  0: "pending",
  1: "accepted",
  2: "rejected",
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: 0, label: "Pending" },
  { value: 1, label: "Accepted" },
  { value: 2, label: "Rejected" },
];

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [status, setStatus] = useState("all");
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [programIdSearchMode, setProgramIdSearchMode] = useState(false);
  const [programId, setProgramId] = useState("");

  const token = localStorage.getItem("accessToken");

  const fetchApplications = async (page = 1, limit = 10, search = "", status = "all") => {
    if (!token) {
      setError("Access token not found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    let url = `http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/all-applicants?page=${page}&limit=${limit}`;
    if (status !== "all") url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    try {
      const response = await fetchWithAuth(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const mappedApps = (data.items || []).map(app => ({
        ...app,
        status: statusMap[app.status] || "unknown",
      }));
      setApplications(mappedApps);
      setMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // If the value is a number, treat as programId search
    if (/^\d+$/.test(value.trim())) {
      setProgramIdSearchMode(true);
      setProgramId(value.trim());
    } else {
      setProgramIdSearchMode(false);
      setProgramId("");
    }
  };

  useEffect(() => {
    if (programIdSearchMode && programId) {
      const fetchByProgramId = async () => {
        setLoading(true);
        setError("");
        try {
          let url = `http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/applicants/${programId}?page=1&limit=10`;
          if (status !== "all") url += `&status=${status}`;
          const response = await fetchWithAuth(url);
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setApplications(data.items || []);
          setMeta({
            totalCount: data.totalCount,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
          });
        } catch (err) {
          setError("❌ Failed to load applications.");
        } finally {
          setLoading(false);
        }
      };
      fetchByProgramId();
    } else {
      fetchApplications(meta.page, meta.limit, search, status);
    }
    // eslint-disable-next-line
  }, [search, status, meta.page, meta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchApplications(1, meta.limit, search, status);
      }, 500)
    );
    // eslint-disable-next-line
  }, [search]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleAction = async (traineeId, programId, accept) => {
    setActionMessage("Processing...");
    try {
      const res = await fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/review/trainee/${traineeId}/program/${programId}?accept=${accept}`, {
        method: "PATCH"
      });
      const message = await res.text();
      if (!res.ok) throw new Error(message);
      setApplications(prev =>
        prev.map(app =>
          app.traineeId === traineeId && app.trainingProgramId === programId
            ? { ...app, status: accept ? "accepted" : "rejected" }
            : app
        )
      );
      setActionMessage(message);
    } catch (err) {
      setActionMessage(err.message || "❌ Something went wrong.");
    }
  };

  const filteredApps = applications.filter(app => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      app.programTitle?.toLowerCase().includes(s) ||
      app.fullName?.toLowerCase().includes(s)
    );
  });

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72", mb: 2 }}>
          Training Applications
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search by program title, trainee name, or program ID..."
            value={search}
            onChange={handleSearchChange}
            sx={{ minWidth: 200, maxWidth: 320, background: "#f5f7fa", borderRadius: 2, fontSize: 15 }}
            size="small"
            InputProps={{ style: { fontSize: 15 } }}
          />
          <List sx={{ display: 'flex', flexDirection: 'row', p: 0, m: 0, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            {statusOptions.map(opt => (
              <ListItem key={opt.value} disablePadding sx={{ width: 'auto' }}>
                <ListItemButton
                  selected={status === opt.value}
                  onClick={() => setStatus(opt.value)}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 3,
                    mx: 0.5,
                    color: status === opt.value
                      ? (opt.value === 1 ? 'success.main' : opt.value === 2 ? 'error.main' : opt.value === 0 ? 'warning.main' : 'primary.main')
                      : 'text.primary',
                    backgroundColor: status === opt.value
                      ? (opt.value === 1 ? 'success.light' : opt.value === 2 ? 'error.light' : opt.value === 0 ? 'warning.light' : 'primary.light')
                      : 'background.paper',
                    fontWeight: status === opt.value ? 700 : 400,
                    fontSize: 15,
                    minWidth: 80,
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.value === 1 && <CheckCircle sx={{ mr: 1, color: 'success.main' }} />}
                  {opt.value === 2 && <Cancel sx={{ mr: 1, color: 'error.main' }} />}
                  {opt.value === 0 && <HourglassEmpty sx={{ mr: 1, color: 'warning.main' }} />}
                  {opt.value === 'all' && <Assignment sx={{ mr: 1, color: 'primary.main' }} />}
                  <ListItemText primary={opt.label} primaryTypographyProps={{ fontWeight: status === opt.value ? 700 : 400, fontSize: 15 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" />
          <Chip label={`Page: ${meta.page} / ${meta.totalPages}`} color="secondary" />
          <Chip label={`Limit: ${meta.limit}`} color="info" />
        </Stack>
        {actionMessage && <Typography sx={{ mt: 1, color: "green" }}>{actionMessage}</Typography>}
        {loading ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack spacing={3}>
            {filteredApps.length === 0 ? (
              <Typography align="center" sx={{ mt: 4 }}>No applications match the criteria.</Typography>
            ) :
              filteredApps.map((app, idx) => (
                <Fade in={!loading} timeout={600 + idx * 100} key={`${app.traineeId}-${app.trainingProgramId}`}>
                  <Card elevation={4} sx={{ borderRadius: 4, background: "#f9fafb", boxShadow: "0 4px 24px 0 #00000014", minHeight: 180, display: "flex", flexDirection: "row", alignItems: "center", p: 2 }}>
                    <CardMedia
                      component="img"
                      image={app.profileImageUrl || "https://i.pravatar.cc/100"}
                      alt={app.fullName}
                      sx={{ width: 80, height: 80, borderRadius: 2, objectFit: "cover", mr: 3 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}><Person sx={{ mr: 1, fontSize: 20 }} />{app.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary"><Assignment sx={{ mr: 0.5, fontSize: 18 }} /> <strong>ID:</strong> {app.traineeId}</Typography>
                      <Typography variant="body2" color="text.secondary"><Email sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Email:</strong> <a href={`mailto:${app.email}`} style={{ color: '#1976d2', textDecoration: 'underline' }}>{app.email}</a></Typography>
                      <Typography variant="body2" color="text.secondary"><CalendarToday sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Enrolled At:</strong> {new Date(app.enrolledAt).toLocaleDateString()}</Typography>
                      <Typography variant="body2" color="text.secondary"><Assignment sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Program:</strong> {app.programTitle}</Typography>
                      <Typography variant="body2" color="text.secondary"><Assignment sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Program ID:</strong> {app.trainingProgramId}</Typography>
                      <Typography variant="body2" color="text.secondary"><Assignment sx={{ mr: 0.5, fontSize: 18 }} /> <strong>Resume:</strong> <a href={app.cvPath} target="_blank" rel="noopener noreferrer">📄 View</a></Typography>
                    </Box>
                    <Fade in={true} timeout={600 + idx * 100}>
                      <Chip
                        label={
                          app.status === "pending" ? "Pending" :
                          app.status === "accepted" ? "Accepted" :
                          app.status === "rejected" ? "Rejected" : app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Unknown"
                        }
                        icon={
                          app.status === "accepted" ? <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} /> :
                          app.status === "rejected" ? <Cancel sx={{ fontSize: 20, color: 'error.main' }} /> :
                          app.status === "pending" ? <HourglassEmpty sx={{ fontSize: 20, color: 'warning.main' }} /> : null
                        }
                        color={
                          app.status === "accepted" ? "success" :
                          app.status === "rejected" ? "error" :
                          app.status === "pending" ? "warning" : "default"
                        }
                        sx={{ fontSize: 18, height: 40, minWidth: 120, fontWeight: 700, letterSpacing: 1, ml: 2, transition: 'all 0.3s' }}
                      />
                    </Fade>
                    {app.status === 0 && (
                      <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                        <Button variant="contained" color="success" onClick={() => handleAction(app.traineeId, app.trainingProgramId, true)}>
                          ✅ Accept
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleAction(app.traineeId, app.trainingProgramId, false)}>
                          ❌ Reject
                        </Button>
                      </Stack>
                    )}
                  </Card>
                </Fade>
              ))
            }
          </Stack>
        )}
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={meta.totalPages === 0 ? 1 : meta.totalPages}
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
};

export default CompanyApplications;
