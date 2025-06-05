import React, { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Pagination,
  TextField,
  Button,
  Avatar,
  Stack,
  Rating,
  Tooltip,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  Send as SendIcon,
  AddComment as AddCommentIcon,
  Cancel as CancelIcon,
  Attachment as AttachmentIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import debounce from "lodash/debounce";

// Feedback types
const feedbackTypeLabels = {
  1: "General",
  2: "Suggestion",
  3: "Complaint",
  4: "Praise",
};

// Number of items per page
const ITEMS_PER_PAGE = 6;

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
  width: '100%',
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

export default function TraineeFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [programId, setProgramId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackType, setFeedbackType] = useState(1);
  const [fileAttachment, setFileAttachment] = useState(null);

  const authToken = localStorage.getItem("accessToken");

  const fetchFeedbacks = useCallback(async (pageNum = 1, currentSearchTerm = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: ITEMS_PER_PAGE,
      });
      if (currentSearchTerm) {
        params.append('search', currentSearchTerm);
      }
      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/received?${params.toString()}`
      );
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch feedbacks.");
      }
      const data = await response.json();
      setFeedbacks(data.items || []);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.totalCount || 0);
      if ((data.items || []).length === 0 && currentSearchTerm) {
        setErrorMessage(`No feedback found matching "${currentSearchTerm}".`);
      } else if ((data.items || []).length === 0) {
        setErrorMessage("No feedbacks received yet.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load feedbacks.");
      setFeedbacks([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFeedbackSubmission = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!authToken) {
      setErrorMessage("User is not authenticated. Please log in.");
      setIsSubmitting(false);
      return;
    }
    if (!recipientId) {
      setErrorMessage("Please enter the recipient's User ID.");
      setIsSubmitting(false);
      return;
    }
    if (!programId) {
      setErrorMessage("Please enter the Training Program ID.");
      setIsSubmitting(false);
      return;
    }
    if (feedbackMessage.length < 5) {
      setErrorMessage("Message must be at least 5 characters.");
      setIsSubmitting(false);
      return;
    }
    if (!feedbackTypeLabels[feedbackType]) {
      setErrorMessage("Invalid feedback type selected.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ToUserAccountId", recipientId);
      formData.append("TrainingProgramId", programId);
      formData.append("Message", feedbackMessage);
      formData.append("Type", feedbackType);

      if (feedbackRating !== "") {
        formData.append("Rating", feedbackRating);
      }
      if (fileAttachment) {
        formData.append("Attachment", fileAttachment);
      }

      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/send`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Failed to send feedback.");
      }

      setSuccessMessage(responseText || "✅ Feedback sent successfully.");
      resetForm();
      fetchFeedbacks(page, debouncedSearchTerm);
    } catch (error) {
      setErrorMessage(error.message || "❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackMessage("");
    setFeedbackRating("");
    setFeedbackType(1);
    setRecipientId("");
    setProgramId("");
    setFileAttachment(null);
    setIsFormVisible(false);
  };

  const debouncedFetchFeedbacks = useCallback(
    debounce((newSearchTerm) => {
      setDebouncedSearchTerm(newSearchTerm);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchFeedbacks(searchTerm);
    return () => {
      debouncedFetchFeedbacks.cancel();
    };
  }, [searchTerm, debouncedFetchFeedbacks]);

  useEffect(() => {
    fetchFeedbacks(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, fetchFeedbacks]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getFeedbackTypeDisplay = (typeValue) => {
    return feedbackTypeLabels[typeValue] || "Unknown";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        margin: 'auto',
        backgroundColor: 'transparent',
        maxWidth: "1200px",
        width: "fit-content"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap'
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Received Feedback
        </Typography>
        <Tooltip title="Send New Feedback">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCommentIcon />}
            onClick={() => setIsFormVisible(!isFormVisible)}
            sx={{ borderRadius: '20px', boxShadow: 3, '&:hover': { boxShadow: 6 } }}
          >
            {isFormVisible ? 'Cancel' : 'Send Feedback'}
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Received Feedback"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ maxWidth: '700px', backgroundColor: 'background.paper', borderRadius: 1 }}
        />
      </Box>

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && !isLoading && feedbacks.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}
      {errorMessage && feedbacks.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}

      {isFormVisible && (
        <Box
          component="form"
          onSubmit={handleFeedbackSubmission}
          sx={{
            backgroundColor: 'background.paper',
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: 3,
            mb: 4
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: 'medium', color: 'secondary.main' }}
          >
            Send New Feedback
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient User ID"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Training Program ID"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message (min. 5 characters)"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
                multiline
                rows={4}
                variant="outlined"
                inputProps={{ minLength: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(Number(e.target.value))}
                  label="Feedback Type"
                >
                  {Object.entries(feedbackTypeLabels).map(([key, label]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend" sx={{ mb: 0.5, color: 'text.secondary' }}>
                Rating (Optional)
              </Typography>
              <Rating
                name="feedback-rating"
                value={Number(feedbackRating) || 0}
                onChange={(event, newValue) => {
                  setFeedbackRating(newValue === null ? "" : String(newValue));
                }}
                size="large"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUploadIcon />}
                fullWidth
              >
                {fileAttachment ? fileAttachment.name : 'Upload Attachment (Optional)'}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => setFileAttachment(e.target.files[0])}
                />
              </Button>
              {fileAttachment && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  Selected: {fileAttachment.name}
                </Typography>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}
            >
              <Button
                type="button"
                onClick={resetForm}
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {isSubmitting ? "Sending..." : "Submit Feedback"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px'
          }}
        >
          <CircularProgress size={60} />
        </Box>
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
                label={`Page: ${page} / ${totalPages}`}
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

          {/* No feedbacks received yet */}
          {!isLoading && feedbacks.length === 0 && !errorMessage && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No feedbacks received yet.
            </Alert>
          )}

          {/* Feedback Cards */}
          {feedbacks.length > 0 && (
            <Box>
              <Grid
                container
                spacing={3}
                direction="column"
              >
                {feedbacks.map((feedback) => (
                  <Grid
                    item
                    xs={12}
                    key={feedback.feedbackId || feedback.id}
                    sx={{ display: 'flex' }}
                  >
                    <StyledCard>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          mb={2}
                        >
                          <StyledAvatar
                            src={feedback.fromImageUrl || undefined}
                            alt={feedback.fromFullName || 'Sender'}
                          >
                            {feedback.fromFullName
                              ? feedback.fromFullName.charAt(0).toUpperCase()
                              : 'S'}
                          </StyledAvatar>
                          <Box flexGrow={1}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ fontWeight: 'medium' }}
                            >
                              {feedback.fromFullName || 'Anonymous Sender'}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Program: {feedback.programName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Role: [Sender's Role] {/* Placeholder for actual role */}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          variant="body1"
                          sx={{ mb: 1, flexGrow: 1 }}
                        >
                          {feedback.message}
                        </Typography>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                          mt={1}
                          mb={1.5}
                          flexWrap="wrap"
                        >
                          <Chip
                            label={getFeedbackTypeDisplay(feedback.type)}
                            size="small"
                            color={
                              feedback.type === 2
                                ? "error"
                                : feedback.type === 3
                                ? "warning"
                                : feedback.type === 4
                                ? "success"
                                : "info"
                            }
                          />
                          {feedback.rating && (
                            <Rating
                              value={feedback.rating}
                              readOnly
                              size="small"
                            />
                          )}
                        </Stack>

                        {feedback.attachmentUrl && (
                          <Button
                            href={feedback.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<AttachmentIcon />}
                            size="small"
                            sx={{
                              alignSelf: 'flex-start',
                              mb: 1,
                              textTransform: 'none'
                            }}
                          >
                            View Attachment
                          </Button>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: 'right',
                            width: '100%'
                          }}
                        >
                          {new Date(feedback.createdAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Stack
                alignItems="center"
                sx={{ mt: 4, mb: 2 }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                  showFirstButton
                  showLastButton
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
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
