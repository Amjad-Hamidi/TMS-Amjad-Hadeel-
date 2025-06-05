import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE = "http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms";
const LIMIT = 6;

const tabList = [
  { label: "All", value: "all", color: "primary" },
  { label: "Pending", value: "pending", color: "warning" },
  { label: "Approved", value: "approved", color: "success" },
  { label: "Rejected", value: "rejected", color: "error" },
];

export default function PendingTrainingPro() {
  const [tab, setTab] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [page, setPage] = useState({
    all: 1,
    pending: 1,
    approved: 1,
    rejected: 1,
  });
  const [totalPages, setTotalPages] = useState({
    all: 1,
    pending: 1,
    approved: 1,
    rejected: 1,
  });

  // Fetch programs based on tab and page
  useEffect(() => {
    setLoading(true);
    setError(null);
    setActionError(null);
    setActionSuccess(null);

    const fetchTab = async (type, pageNum) => {
      let url = "";
      if (type === "pending") url = `${API_BASE}/all-pending?page=${pageNum}&limit=${LIMIT}`;
      else if (type === "approved") url = `${API_BASE}/all-approved?page=${pageNum}&limit=${LIMIT}`;
      else if (type === "rejected") url = `${API_BASE}/all-rejected?page=${pageNum}&limit=${LIMIT}`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      return res.json();
    };

    if (tab === "all") {
      Promise.all([
        fetchTab("pending", page.pending),
        fetchTab("approved", page.approved),
        fetchTab("rejected", page.rejected),
      ])
        .then(([pending, approved, rejected]) => {
          // Add status to each
          const pendingList = (pending.items || []).map((p) => ({ ...p, status: "Pending" }));
          const approvedList = (approved.items || []).map((p) => ({ ...p, status: "Approved" }));
          const rejectedList = (rejected.items || []).map((p) => ({ ...p, status: "Rejected" }));
          setPrograms([...pendingList, ...approvedList, ...rejectedList]);
          setTotalPages({
            all: Math.max(pending.totalCount, approved.totalCount, rejected.totalCount) / LIMIT,
            pending: Math.ceil(pending.totalCount / LIMIT),
            approved: Math.ceil(approved.totalCount / LIMIT),
            rejected: Math.ceil(rejected.totalCount / LIMIT),
          });
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load programs.");
          setLoading(false);
        });
    } else {
      fetchTab(tab, page[tab])
        .then((data) => {
          const list = (data.items || []).map((p) => ({ ...p, status: tab.charAt(0).toUpperCase() + tab.slice(1) }));
          setPrograms(list);
          setTotalPages((prev) => ({ ...prev, [tab]: Math.ceil((data.totalCount || 1) / LIMIT) }));
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load programs.");
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [tab, page.all, page.pending, page.approved, page.rejected]);

  // Approve program
  const handleApprove = async (id) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/approve/${id}`, {
        method: "PATCH"
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setActionSuccess(text);
      setPrograms((prev) => prev.filter((p) => p.trainingProgramId !== id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject program
  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/reject/${id}?reason=${encodeURIComponent(reason)}`, {
        method: "PATCH"
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setActionSuccess(text);
      setPrograms((prev) => prev.filter((p) => p.trainingProgramId !== id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setExpanded(null);
  };

  const handlePageChange = (event, value) => {
    setPage((prev) => ({ ...prev, [tab]: value }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        All Programs
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 4,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 2px 12px 0 #00000011",
          minHeight: 56,
          '& .MuiTab-root': {
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 3,
            mx: 1,
            minHeight: 56,
            transition: 'all 0.2s',
          },
          '& .Mui-selected': {
            color: '#fff !important',
          },
        }}
        TabIndicatorProps={{
          style: {
            height: 0,
          },
        }}
      >
        {tabList.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t.value === 'pending' && <HourglassEmptyIcon fontSize="small" />}
                {t.value === 'approved' && <CheckCircleIcon fontSize="small" />}
                {t.value === 'rejected' && <CancelIcon fontSize="small" />}
                {t.label}
              </Box>
            }
            sx={{
              background: tab === t.value ? (t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935') : '#fff',
              color: tab === t.value ? '#fff' : (t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935'),
              boxShadow: tab === t.value ? `0 4px 16px 0 ${(t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935')}55` : 'none',
              border: `2px solid ${(t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935')}`,
              borderRadius: 3,
              mx: 1,
              minHeight: 56,
              fontWeight: 700,
              fontSize: 18,
              transition: 'all 0.2s',
              '&:hover': {
                background: (t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935'),
                color: '#fff',
                boxShadow: `0 4px 16px 0 ${(t.color === 'primary' ? '#1976d2' : t.color === 'warning' ? '#ff9800' : t.color === 'success' ? '#43a047' : '#e53935')}99`,
              },
            }}
          />
        ))}
      </Tabs>
      {loading && (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {actionSuccess && <Alert severity="success">{actionSuccess}</Alert>}
      <Stack direction="row" flexWrap="wrap" gap={4} justifyContent="flex-start">
        {!loading && programs.length === 0 && <Typography>No programs found.</Typography>}
        {!loading &&
          programs.map((p) => (
            <Card
              key={p.trainingProgramId}
              sx={{
                width: 340,
                minHeight: 370,
                borderRadius: 4,
                boxShadow: "0 4px 24px 0 #00000014",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                '&:hover': {
                  transform: "translateY(-6px) scale(1.03)",
                  boxShadow: "0 8px 32px 0 #00000022",
                },
                background: "#fff",
              }}
            >
              {p.imagePath && (
                <CardMedia
                  component="img"
                  height="170"
                  image={p.imagePath.startsWith("http") ? p.imagePath : `http://amjad-hamidi-tms.runasp.net${p.imagePath}`}
                  alt={p.title}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottom: "2px solid #f0f0f0",
                  }}
                />
              )}
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {p.title}
                  </Typography>
                  <Chip
                    label={p.status?.toUpperCase()}
                    icon={
                      p.status === "Pending" ? <HourglassEmptyIcon fontSize="small" /> :
                      p.status === "Approved" ? <CheckCircleIcon fontSize="small" /> :
                      p.status === "Rejected" ? <CancelIcon fontSize="small" /> : null
                    }
                    color={
                      p.status === "Pending"
                        ? "warning"
                        : p.status === "Approved"
                        ? "success"
                        : p.status === "Rejected"
                        ? "error"
                        : "default"
                    }
                    size="medium"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 15,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      letterSpacing: 1,
                      boxShadow: `0 2px 8px 0 #00000011`,
                    }}
                  />
                </Stack>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {p.companyName || "No Company Name"}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Typography variant="body2"><b>ID:</b> {p.trainingProgramId}</Typography>
                  {p.categoryName && <Typography variant="body2"><b>Category:</b> {p.categoryName}</Typography>}
                  {p.supervisorName && <Typography variant="body2"><b>Supervisor:</b> {p.supervisorName}</Typography>}
                  {p.durationInDays && <Typography variant="body2"><b>Duration (days):</b> {p.durationInDays}</Typography>}
                  {p.duration && <Typography variant="body2"><b>Duration:</b> {p.duration}</Typography>}
                  {p.startDate && <Typography variant="body2"><b>Start:</b> {new Date(p.startDate).toLocaleDateString()}</Typography>}
                  {p.endDate && <Typography variant="body2"><b>End:</b> {new Date(p.endDate).toLocaleDateString()}</Typography>}
                  {p.rejectionReason && <Typography variant="body2"><b>Rejection Reason:</b> {p.rejectionReason}</Typography>}
                  {p.rejectionDate && <Typography variant="body2"><b>Rejection Date:</b> {new Date(p.rejectionDate).toLocaleDateString()}</Typography>}
                  {p.location && <Typography variant="body2"><b>Location:</b> {p.location}</Typography>}
                  {p.seatsAvailable !== undefined && <Typography variant="body2"><b>Seats Available:</b> {p.seatsAvailable}</Typography>}
                  {p.rating !== undefined && <Typography variant="body2"><b>Rating:</b> {p.rating}</Typography>}
                </Stack>
                {p.status === "Pending" && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={actionLoading}
                      onClick={() => handleApprove(p.trainingProgramId)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled={actionLoading}
                      onClick={() => handleReject(p.trainingProgramId)}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
                  onClick={() => setExpanded(expanded === p.trainingProgramId ? null : p.trainingProgramId)}
                >
                  {expanded === p.trainingProgramId ? "Hide" : "Show"}
                </Button>
                {expanded === p.trainingProgramId && (
                  <Box sx={{ mt: 1 }}>
                    {p.description && <Typography variant="body2"><b>Description:</b> {p.description}</Typography>}
                    {p.contentUrl && (
                      <Typography variant="body2"><a href={p.contentUrl} target="_blank" rel="noreferrer"> View Content</a></Typography>
                    )}
                    {p.classroomUrl && (
                      <Typography variant="body2"><a href={p.classroomUrl} target="_blank" rel="noreferrer">View Classroom</a></Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
      </Stack>
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages[tab] || 1}
          page={page[tab]}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Stack>
    </Box>
  );
}
