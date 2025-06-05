// TMyFeedbacks.jsx
import React, { useEffect, useState, useCallback } from "react";
import EditModal from "./EditModal";
import Swal from "sweetalert2";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Avatar,
  Fade,
  TextField,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

const LIMIT = 6;

const StyledCard = styled(Card)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
  display: 'flex',
  flexDirection: 'column',
  height: '100%', 
  // background: "linear-gradient(120deg, #fff 80%, #e3f2fd 100%)", // Retain or remove based on consistency decision
  // boxShadow: "0 8px 32px 0 #00000011" // Retain or remove
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  border: `2px solid ${theme.palette.grey[300]}`,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.12)',
    boxShadow: theme.shadows[6],
  },
  '& .MuiAvatar-img': {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    borderRadius: '50%'
  }
}));

export default function TMyFeedbacks() {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchMyFeedbacks = useCallback(async (pageNum = 1, currentSearchTerm = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: LIMIT,
      });
      if (currentSearchTerm) {
        params.append('search', currentSearchTerm);
      }
      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/sent?${params.toString()}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        Swal.fire("Error", errorText || "Failed to fetch feedbacks.", "error");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setMyFeedbacks(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch feedbacks.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((newSearchTerm) => {
      setDebouncedSearchTerm(newSearchTerm);
      setPage(1); // Reset to first page on new search
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, debouncedFetch]);

  useEffect(() => {
    fetchMyFeedbacks(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, fetchMyFeedbacks]);

  const handleEditClick = (f) => {
    setEditItem({
      ...f,
      receiverId: f.toUserAccountId,
      feedbackId: f.feedbackId,
    });
  };

  const handleEditSave = (updatedItem) => {
    setMyFeedbacks((prev) =>
      prev.map((f) => (f.feedbackId === updatedItem.feedbackId ? updatedItem : f))
    );
    setEditItem(null);
    Swal.fire("Success", "Feedback updated!", "success");
  };

  const handleDelete = async (feedbackId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetchWithAuth(
          `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/${feedbackId}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          const errorText = await response.text();
          Swal.fire("Error", errorText || "Failed to delete feedback.", "error");
          return;
        }
        setMyFeedbacks((prev) => prev.filter((f) => f.feedbackId !== feedbackId));
        Swal.fire("Deleted!", "Your feedback has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete feedback.", "error");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: "#1e3c72", letterSpacing: 1, textAlign: "center" }}>
        My Sent Feedback
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Search My Feedbacks"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            ),
          }}
          sx={{ width: '100%', maxWidth: '500px'}}
        />
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, justifyContent: "center" }}>
        <Chip label={`Total: ${totalCount}`} color="primary" />
        <Chip label={`Page: ${page} / ${totalPages}`} color="secondary" />
        <Chip label={`Limit: ${LIMIT}`} color="info" />
      </Stack>
      {loading ? (
        <Stack alignItems="center" sx={{ my: 6 }}>
          <CircularProgress size={60} color="primary" />
        </Stack>
      ) : myFeedbacks.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6, fontSize: 22 }}>
          {debouncedSearchTerm ? `No feedbacks found for "${debouncedSearchTerm}".` : "You haven't sent any feedback yet."}
        </Typography>
      ) : (
        <Stack spacing={3} sx={{ mb: 4 }}>
          {myFeedbacks.map((f, idx) => (
            <Fade in timeout={400 + idx * 80} key={f.feedbackId}>
              <StyledCard elevation={5} sx={{ borderRadius: 4 /* Consider if this conflicts with StyledCard's own styling */ }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <StyledAvatar src={f.toImageUrl || undefined} alt={f.toFullName || 'Recipient Avatar'}>
                      {f.toFullName ? f.toFullName.charAt(0).toUpperCase() : 'R'}
                    </StyledAvatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                      To: {f.toFullName}
                    </Typography>
                    {f.rating != null && (
                      <Chip label={`⭐ ${f.rating}`} color="warning" sx={{ fontWeight: 700, fontSize: 18 }} />
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 2, fontWeight: 700, ml: 2 }}
                      onClick={() => handleEditClick(f)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                      onClick={() => handleDelete(f.feedbackId)}
                    >
                      Delete
                    </Button>
                  </Stack>
                  <Typography variant="body1" sx={{ fontSize: 18, mb: 1, color: "#333" }}>
                    {f.message}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={feedbackTypeLabels[f.type] || "Unknown"} color="info" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(f.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Program:</strong> {f.programName}
                  </Typography>
                  {f.attachmentUrl && (
                    <Button
                      href={f.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="text"
                      color="secondary"
                      sx={{ mt: 1 }}
                    >
                      📎 View Attachment
                    </Button>
                  )}
                </CardContent>
              </StyledCard>
            </Fade>
          ))}
        </Stack>
      )}
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
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
      {editItem && (
        <EditModal
          feedback={editItem}
          onSave={handleEditSave}
          onClose={() => setEditItem(null)}
        />
      )}
    </Box>
  );
}
