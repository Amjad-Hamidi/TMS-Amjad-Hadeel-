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
  Button,
  Paper,
  Chip,
  Pagination,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });

  const fetchCategories = async (page = 1, limit = 8, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://amjad-hamidi-tms.runasp.net/api/Categories?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await fetchWithAuth(url, {
        headers: { Accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.items || []);
      setMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(meta.page, meta.limit, query);
  }, [meta.page, meta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      fetchCategories(1, meta.limit, query);
    }, 500));
  }, [query]);

  const handlePageChange = (e, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleViewProgramClick = (id) => {
    navigate(`/CategoryTProgramsW/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72" }}>
            Explore Categories
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2 }}
          />
        </Stack>

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
            {categories.length === 0 ? (
              <Grid item xs={12}><Typography>No categories found.</Typography></Grid>
            ) : (
              categories.map((c, idx) => (
                <Fade in={!loading} timeout={600 + idx * 120} key={c.id}>
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
                      {c.categoryImage && (
                        <CardMedia
                          component="img"
                          height="170"
                          image={c.categoryImage.startsWith("http") ? c.categoryImage : `http://amjad-hamidi-tms.runasp.net${c.categoryImage}`}
                          alt={c.name}
                          sx={{
                            objectFit: "cover",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            borderBottom: "2px solid #f0f0f0",
                          }}
                        />
                      )}
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {c.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {c.description}
                        </Typography>
                        {c.generalSkills && c.generalSkills.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                            {c.generalSkills.map((skill, idx) => (
                              <Chip key={idx} label={skill} color="info" size="small" sx={{ fontWeight: 600 }} />
                            ))}
                          </Stack>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                            boxShadow: "0 2px 8px 0 #1e3c7233",
                            letterSpacing: 1,
                            background: "linear-gradient(90deg, #1e3c72 60%, #f5a623 100%)",
                          }}
                          onClick={() => handleViewProgramClick(c.id)}
                        >
                          View Training Programs
                        </Button>
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
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 700,
                fontSize: 18,
                borderRadius: 2,
                mx: 0.5,
                transition: "all 0.2s",
              },
              "& .Mui-selected": {
                color: "#fff !important",
                background: "#1e3c72 !important",
              },
            }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default SupervisorDashboard;
