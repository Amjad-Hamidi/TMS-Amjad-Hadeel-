// CompanyFeedbacks.jsx
import React, { useEffect, useState } from "react";
import EditModal from "../pages/EditModal";
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
} from "@mui/material";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

const LIMIT = 6;

export default function CompanyFeedbacks() {
  const [companyFeedbacks, setCompanyFeedbacks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFeedbacks = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/sent?page=${pageNum}&limit=${LIMIT}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        Swal.fire("Error", errorText || "Failed to fetch feedbacks.", "error");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setCompanyFeedbacks(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch feedbacks.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(page);
    // eslint-disable-next-line
  }, [page]);

  const handleEditClick = (f) => {
    setEditItem({
      ...f,
      receiverId: f.toUserAccountId,
      feedbackId: f.feedbackId,
    });
  };

  const handleDeleteClick = async (feedbackId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the feedback.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetchWithAuth(`http://amjad-hamidi-tms.runasp.net/api/Feedbacks/${feedbackId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }

        // Remove from UI
        setCompanyFeedbacks((prev) => prev.filter((f) => f.feedbackId !== feedbackId));
        Swal.fire("Deleted!", "The feedback has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete feedback.", "error");
      }
    }
  };

  const handleEditSave = async (updatedItem) => {
    try {
      setCompanyFeedbacks((prev) =>
        prev.map((f) => (f.feedbackId === updatedItem.feedbackId ? updatedItem : f))
      );
      setEditItem(null);
      Swal.fire("Success", "Feedback updated!", "success");
    } catch (error) {
      let msg = "Failed to update feedback.";
      try {
        const errObj = typeof error === 'string' ? JSON.parse(error) : error;
        if (errObj && errObj.errors) {
          msg = Object.values(errObj.errors).flat().join("\n");
        } else if (errObj && errObj.message) {
          msg = errObj.message;
        }
      } catch {}
      Swal.fire("Error", msg, "error");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)" }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: "#1e3c72", letterSpacing: 1, textAlign: "center" }}>
        Company Sent Feedback
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, justifyContent: "center" }}>
        <Chip label={`Total: ${totalCount}`} color="primary" />
        <Chip label={`Page: ${page} / ${totalPages}`} color="secondary" />
        <Chip label={`Limit: ${LIMIT}`} color="info" />
      </Stack>
      {loading ? (
        <Stack alignItems="center" sx={{ my: 6 }}>
          <CircularProgress size={44} color="primary" />
        </Stack>
      ) : companyFeedbacks.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6, fontSize: 22 }}>
          No feedback sent yet.
        </Typography>
      ) : (
        <Stack spacing={3} sx={{ mb: 4 }}>
          {companyFeedbacks.map((f, idx) => (
            <Fade in timeout={400 + idx * 80} key={f.id}>
              <Card elevation={5} sx={{ borderRadius: 4, background: "linear-gradient(120deg, #fff 80%, #e3f2fd 100%)", boxShadow: "0 8px 32px 0 #00000011" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    <Avatar src={f.toImageUrl} alt={f.toFullName} sx={{ width: 48, height: 48, border: "2px solid #1976d2" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                      To: {f.toFullName}
                    </Typography>
                    {f.rating != null && (
                      <Chip label={`⭐ ${f.rating}`} color="warning" sx={{ fontWeight: 700, fontSize: 18 }} />
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                      onClick={() => handleEditClick(f)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 2, fontWeight: 700, ml: 1 }}
                      onClick={() => handleDeleteClick(f.feedbackId)}
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
              </Card>
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
