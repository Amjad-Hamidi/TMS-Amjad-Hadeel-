import React, { useEffect, useState } from "react";
import "../styles/TraineesList.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { TextField, Stack, Chip, Pagination, CircularProgress } from "@mui/material";

export default function TraineesList() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchTrainees = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://amjad-hamidi-tms.runasp.net/api/Users/trainees-company?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const response = await fetchWithAuth(url);
      if (!response.ok) throw new Error("Failed to fetch trainees");
      const data = await response.json();
      setTrainees(data.items || []);
      setMeta({
        totalCount: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (error) {
      setError("❌ Error fetching trainees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page, meta.limit]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchTrainees(1, meta.limit, search);
      }, 500)
    );
    // eslint-disable-next-line
  }, [search]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleInvite = (email) => {
    alert(`📩 Invitation sent to ${email}`);
    // يمكنك لاحقًا ربط هذه الدالة بـ API حقيقي للإرسال
  };

  return (
    <div className="trainees-page">
      <h2>Available Trainees</h2>
      <TextField
        variant="outlined"
        placeholder="Search trainees…"
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
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div className="trainee-grid">
            {trainees.map(t => (
              <div key={t.id} className="trainee-card">
                <img
                  src={t.profileImageUrl || "https://i.pravatar.cc/100"}
                  alt={t.fullName}
                  className="avatar"
                />
                <h3>{t.fullName}</h3>
                <p>{t.trainingProgramName} - {t.categoryName}</p>
                <a href={t.cvPath} target="_blank" rel="noreferrer">📄 View CV</a>
                <button onClick={() => handleInvite(t.email)}>📧 Invite by Email</button>
              </div>
            ))}
          </div>
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
        </>
      )}
    </div>
  );
}
