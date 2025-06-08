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
  Modal, // Import Modal for image preview
  IconButton, // Import IconButton for the close button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import { fetchWithAuth } from "../utils/fetchWithAuth";

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

const LIMIT = 6;

// Style for the image preview modal (same as before)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "900px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 4,
  outline: "none",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

// Component for Image Preview Modal (same as before)
function ImagePreviewModal({ imageUrl, onClose }) {
  return (
    <Modal
      open={Boolean(imageUrl)}
      onClose={onClose}
      aria-labelledby="image-preview-title"
      aria-describedby="image-preview-description"
      closeAfterTransition
    >
      <Fade in={Boolean(imageUrl)}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={onClose}
            sx={{
              width: 'fit-content',
              position: "absolute",
              top: 8,
              right: 8,
              color: "#1976d2",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.2)",
                transform: "scale(1.1)",
                transition: "transform 0.2s ease-in-out",
              },
              transition:
                "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
              zIndex: 1,
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <img
            src={imageUrl}
            alt="Feedback Attachment"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              borderRadius: 8,
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </Fade>
    </Modal>
  );
}

export default function CompanyFeedbacks() {
  const [companyFeedbacks, setCompanyFeedbacks] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // State for image preview

  const fetchFeedbacks = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `https://amjad-hamidi-tms.runasp.net/api/Feedbacks/sent?page=${pageNum}&limit=${LIMIT}`
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
        const response = await fetchWithAuth(
          `https://amjad-hamidi-tms.runasp.net/api/Feedbacks/${feedbackId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }

        setCompanyFeedbacks((prev) =>
          prev.filter((f) => f.feedbackId !== feedbackId)
        );
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
        const errObj = typeof error === "string" ? JSON.parse(error) : error;
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

  // Function to open image preview
  const handleImagePreview = (url) => {
    setImagePreviewUrl(url);
  };

  // Function to close image preview
  const handleCloseImagePreview = () => {
    setImagePreviewUrl(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 1, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#1e3c72",
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        Company Sent Feedback
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, justifyContent: "center" }}
      >
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
            <Fade in timeout={400 + idx * 80} key={f.feedbackId}>
              <Card
                elevation={5}
                sx={{
                  borderRadius: 4,
                  background:
                    "linear-gradient(120deg, #fff 80%, #e3f2fd 100%)",
                  boxShadow: "0 8px 32px 0 #00000011",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 1 }}
                  >
                    {/* Make the Avatar clickable for preview */}
                    <Avatar
                      src={f.toImageUrl}
                      alt={f.toFullName}
                      sx={{
                        width: 48,
                        height: 48,
                        border: "2px solid #1976d2",
                        cursor: f.toImageUrl ? "pointer" : "default", // Show pointer cursor if image exists
                        "&:hover": {
                          opacity: f.toImageUrl ? 0.8 : 1, // Slight opacity change on hover
                          transform: f.toImageUrl ? "scale(1.05)" : "none", // Slight scale on hover
                          transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
                        },
                      }}
                      onClick={() => f.toImageUrl && handleImagePreview(f.toImageUrl)} // Call preview on click
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                      To: {f.toFullName}
                    </Typography>

                    {f.rating != null && (
                      <Chip
                        label={`⭐ ${f.rating}`}
                        color="warning"
                        sx={{ fontWeight: 700, fontSize: 18 }}
                      />
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
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                      onClick={() => handleDeleteClick(f.feedbackId)}
                    >
                      Delete
                    </Button>
                  </Stack>

                  <Typography
                    variant="body1"
                    sx={{ fontSize: 18, mb: 1, color: "#333" }}
                  >
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

                  {/* If you also want to click the attachment URL to preview,
                      you can add this back and make it clickable too: */}
                  {f.attachmentUrl && (
                    <Button
                      // Changed href to onClick
                      onClick={() => handleImagePreview(f.attachmentUrl)}
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

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={imagePreviewUrl}
        onClose={handleCloseImagePreview}
      />
    </Box>
  );
}