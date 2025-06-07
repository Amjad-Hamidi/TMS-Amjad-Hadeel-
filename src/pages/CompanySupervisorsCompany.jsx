import React, { useEffect, useState } from "react";
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
  Paper,
  Chip,
  Pagination,
  Fade,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const LIMIT = 8;

const CompanySupervisorsCompany = () => {
  const [supervisors, setSupervisors] = useState([]);
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
  const navigate = useNavigate();

  const fetchSupervisors = async (page = 1, limit = LIMIT, search = "") => {
    setLoading(true);
    setError(null);
    let url = `https://amjad-hamidi-tms.runasp.net/api/Users/supervisors-company?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    try {
      const res = await fetchWithAuth(url, {
        headers: { Accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch company supervisors");
      const data = await res.json();
      setSupervisors(Array.isArray(data) ? data : data.items || []);
      setMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError("Failed to load company supervisors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page, meta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchSupervisors(1, meta.limit, search);
      }, 500)
    );
    // eslint-disable-next-line
  }, [search]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72" }}>
            Company Supervisors
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleBack}>
            Back
          </Button>
        </Stack>
        <TextField
          variant="outlined"
          placeholder="Search company supervisors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2, mb: 2 }}
        />
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" />
          <Chip label={`Page: ${meta.page} / ${meta.totalPages}`} color="secondary" />
          <Chip label={`Limit: ${meta.limit}`} color="info" />
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {supervisors.length === 0 ? (
              <Grid item xs={12}><Typography>No company supervisors found.</Typography></Grid>
            ) : (
              supervisors.map((sup, idx) => (
                <Fade in={!loading} timeout={600 + idx * 120} key={sup.supervisorId}>
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
                      <CardMedia
                        component="img"
                        height="180"
                        image={sup.profileImageUrl || "https://via.placeholder.com/150?text=No+Image"}
                        alt={sup.fullName}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                          {sup.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>ID:</strong> {sup.supervisorId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong> {sup.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Phone:</strong> {sup.phoneNumber}
                        </Typography>
                        {sup.cvPath ? (
                          <Button
                            href={sup.cvPath}
                            target="_blank"
                            rel="noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            📄 View Resume
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            No resume available
                          </Typography>
                        )}
                        {sup.programs && sup.programs.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Programs:
                            </Typography>
                            {sup.programs.map((prog) => (
                              <Box key={prog.programId} sx={{ mb: 1, pl: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>{prog.title}</strong> ({new Date(prog.startDate).toLocaleDateString()} - {new Date(prog.endDate).toLocaleDateString()})
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {prog.description}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
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
};

export default CompanySupervisorsCompany; 