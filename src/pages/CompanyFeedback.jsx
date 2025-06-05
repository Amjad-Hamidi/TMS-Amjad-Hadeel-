// CompanyFeedback.jsx

import React, { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Link,
  Rating,
  TextField,
  Typography,
  Alert,
  Chip,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Pagination
} from "@mui/material";
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

const ITEMS_PER_PAGE = 6;

const feedbackTypes = {
  1: "General",
  2: "Suggestion",
  3: "Complaint",
  4: "Praise",
};

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
    borderRadius: '50%',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CompanyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [toUserId, setToUserId] = useState("");
  const [trainingProgramId, setTrainingProgramId] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [type, setType] = useState("General");
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const allowedTypes = ["General", "Suggestion", "Complaint", "Praise"];
  const token = localStorage.getItem("accessToken");

  const fetchFeedbacksCallback = useCallback(
    async (pageToFetch, currentSearch) => {
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }
      setLoadingFeedbacks(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: pageToFetch,
          limit: ITEMS_PER_PAGE,
        });
        if (currentSearch) {
          params.append('search', currentSearch);
        }

        const res = await fetchWithAuth(
          `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/received?${params.toString()}`
        );

        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData || "Failed to fetch feedbacks.");
        }

        const data = await res.json();
        setFeedbacks(data.items || []);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 0);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        setError(err.message || "Failed to load feedbacks.");
        setFeedbacks([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        setLoadingFeedbacks(false);
      }
    },
    [token]
  );

  const debouncedFetch = useCallback(
    debounce((newSearchTerm) => {
      setDebouncedSearchTerm(newSearchTerm);
      setCurrentPage(1);
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
    fetchFeedbacksCallback(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, fetchFeedbacksCallback]);

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachment(file);
      setAttachmentName(file.name);
    } else {
      setAttachment(null);
      setAttachmentName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSend(true);
    setError("");
    setSuccessMsg("");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoadingSend(false);
      return;
    }
    if (!toUserId.trim()) {
      setError("Receiver's User ID is required.");
      setLoadingSend(false);
      return;
    }
    if (!trainingProgramId.trim()) {
      setError("Training Program ID is required.");
      setLoadingSend(false);
      return;
    }
    if (message.trim().length < 5) {
      setError("Message must be at least 5 characters long.");
      setLoadingSend(false);
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      setLoadingSend(false);
      return;
    }
    if (!allowedTypes.includes(type)) {
      setError("Invalid feedback type selected.");
      setLoadingSend(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ToUserAccountId", toUserId);
      formData.append("TrainingProgramId", trainingProgramId);
      formData.append("Message", message);
      formData.append("Rating", rating.toString());
      formData.append("Type", type);
      if (attachment) {
        formData.append("Attachment", attachment);
      }

      const res = await fetchWithAuth(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/send",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Failed to send feedback. Please check the details and try again.");
      }

      setSuccessMsg(text || "✅ Feedback sent successfully!");
      setToUserId("");
      setTrainingProgramId("");
      setMessage("");
      setRating(1);
      setType("General");
      setAttachment(null);
      setAttachmentName("");
      setShowForm(false);

      fetchFeedbacksCallback(1, "");
      setSearchTerm("");
    } catch (err) {
      setError(err.message || "An unexpected error occurred while sending feedback.");
    } finally {
      setLoadingSend(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', padding: { xs: 2, md: 3 }, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', mb: 3, color: 'primary.main', fontWeight: 'bold' }}
      >
        Received Feedbacks
      </Typography>

      {(!showForm && error) && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      {!showForm && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <TextField
            label="Search Feedbacks"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
            sx={{ flexGrow: 1, minWidth: '200px', maxWidth: '400px' }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCommentIcon />}
            onClick={() => {
              setShowForm(true);
              setSuccessMsg('');
              setError('');
            }}
            size="large"
            sx={{
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
          >
            COMPOSE NEW FEEDBACK
          </Button>
        </Box>
      )}

      {showForm && (
        <StyledCard elevation={4} sx={{ p: { xs: 2, md: 3 }, mb: 4, backgroundColor: 'white' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, textAlign: 'center', color: 'secondary.main' }}>
            Send New Feedback
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="To User ID"
                  variant="outlined"
                  value={toUserId}
                  onChange={(e) => setToUserId(e.target.value)}
                  required
                  error={!!(error && error.toLowerCase().includes("receiver's user id"))}
                  helperText={error && error.toLowerCase().includes("receiver's user id")
                    ? error
                    : "Enter the ID of the user receiving this feedback."}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Training Program ID"
                  variant="outlined"
                  value={trainingProgramId}
                  onChange={(e) => setTrainingProgramId(e.target.value)}
                  required
                  error={!!(error && error.toLowerCase().includes("program id"))}
                  helperText={error && error.toLowerCase().includes("program id")
                    ? error
                    : "Enter the ID of the relevant training program."}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  inputProps={{ minLength: 5 }}
                  error={!!(error && error.toLowerCase().includes("message"))}
                  helperText={error && error.toLowerCase().includes("message")
                    ? error
                    : 'Minimum 5 characters for the feedback message.'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!(error && error.toLowerCase().includes("type"))}>
                  <InputLabel id="type-select-label">Feedback Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Feedback Type"
                  >
                    {allowedTypes.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                  {error && error.toLowerCase().includes("type") && (
                    <FormHelperText>{error}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography component="legend" sx={{ mb: 0.5 }}>Your Rating</Typography>
                <Rating
                  name="feedback-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue === null ? 0 : newValue);
                  }}
                  precision={1}
                  size="large"
                />
                {error && error.toLowerCase().includes("rating") && (
                  <FormHelperText error sx={{ textAlign: 'center' }}>{error}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Upload Attachment (Optional)
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleAttachmentChange}
                  />
                </Button>
                {attachmentName && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    {attachmentName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                  startIcon={<CancelIcon />}
                  disabled={loadingSend}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loadingSend}
                  startIcon={loadingSend ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{
                    textTransform: 'none',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                >
                  {loadingSend ? "Sending..." : "Send Feedback"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </StyledCard>
      )}

      {!showForm && (
        <>
          {loadingFeedbacks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress size={60} />
            </Box>
          ) : feedbacks.length === 0 ? (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', mt: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {debouncedSearchTerm
                  ? `No feedbacks found for "${debouncedSearchTerm}".`
                  : "You haven't received any feedback yet."}
              </Typography>
            </Paper>
          ) : (
            <>
              {feedbacks.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip
                    label={`Total: ${totalCount}`}
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={`Page: ${currentPage} / ${totalPages}`}
                    color="secondary"
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={`Limit: ${ITEMS_PER_PAGE}`}
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              )}

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {feedbacks.map((fb) => (
                  <Grid
                    item
                    xs={12} sm={12} md={12} lg={12} xl={12} // כל כרטיס תופס שורה מלאה
                    key={fb.id || `${fb.fromUserAccountId}-${fb.createdAt}-${fb.message?.substring(0, 10)}`}
                    sx={{ display: 'flex' }}
                  >
                    <StyledCard elevation={2}>
                      <CardHeader
                        avatar={
                          <Tooltip title={fb.fromFullName || 'Anonymous User'} placement="top">
                            <StyledAvatar src={fb.fromImageUrl || undefined} alt={fb.fromFullName || 'User Avatar'}>
                              {fb.fromFullName ? fb.fromFullName.charAt(0).toUpperCase() : 'A'}
                            </StyledAvatar>
                          </Tooltip>
                        }
                        title={
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: 'primary.dark' }}>
                            {fb.fromFullName || 'Anonymous User'}
                          </Typography>
                        }
                        subheader={
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(fb.createdAt)}
                          </Typography>
                        }
                        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                          Program: <Typography component="span" color="text.secondary" sx={{ fontWeight: 'normal' }}>{fb.programName || 'N/A'}</Typography>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" component="span" sx={{ mr: 0.5, fontWeight: 'medium' }}>Type:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feedbackTypes[fb.type] || fb.type || "Unknown"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="subtitle1" component="span" sx={{ mr: 0.5, fontWeight: 'medium' }}>Rating:</Typography>
                          <Rating
                            name={`rating-${fb.id}`}
                            value={parseFloat(fb.rating) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            backgroundColor: (theme) => theme.palette.grey[50],
                            borderRadius: 1,
                            mb: 1.5,
                            maxHeight: '100px',
                            overflowY: 'auto'
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              fontStyle: 'italic',
                              color: 'text.primary',
                              whiteSpace: 'pre-wrap',
                              margin: 0,
                              wordBreak: 'break-word'
                            }}
                          >
                            {fb.message}
                          </Typography>
                        </Paper>
                        {fb.attachmentUrl && (
                          <Typography variant="body2">
                            <Link
                              href={fb.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}
                            >
                              <AttachmentIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> View Attachment
                            </Link>
                          </Typography>
                        )}
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default CompanyFeedback;
