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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Paper,
  Chip // Added Chip for feedback type display
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  Send as SendIcon,
  AddComment as AddCommentIcon,
  Cancel as CancelIcon,
  Attachment as AttachmentIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import debounce from 'lodash/debounce';

// Consistent naming with other components
const feedbackTypeLabels = {
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
  width: '100%', // Ensure card takes full width of its grid item
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

const TraineeFeedback = () => {
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
  const ITEMS_PER_PAGE = 6;

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [programId, setProgramId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackType, setFeedbackType] = useState(1); // Default to 1 for 'General'
  const [fileAttachment, setFileAttachment] = useState(null);

  const feedbackTypeLabels = {
    1: "General",
    2: "Complaint",
    3: "Suggestion",
    4: "Praise",
  };
  const authToken = localStorage.getItem("accessToken");

  const fetchFeedbacks = useCallback(async (pageNum = 1, currentSearchTerm = "") => {
    // authToken is already checked in fetchWithAuth, but good for early exit if needed.
    // if (!authToken) {
    //   setErrorMessage("User is not authenticated. Please log in.");
    //   return;
    // }
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
      setFeedbacks([]); // Clear feedbacks on error
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [ITEMS_PER_PAGE]); // Added ITEMS_PER_PAGE to dependency array

  // This initial fetch is now handled by the debounced search useEffect
  // useEffect(() => {
  //   fetchFeedbacks(); // Initial fetch
  // }, [fetchFeedbacks]); // fetchFeedbacks is now a dependency

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

    if (!feedbackTypeLabels[feedbackType]) { // Validate against numeric keys
      setErrorMessage("Invalid feedback type selected.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ToUserAccountId", recipientId);
      formData.append("TrainingProgramId", programId);
      formData.append("Message", feedbackMessage);
      // API likely expects the string label or a specific numeric mapping.
      // If API expects string: formData.append("Type", feedbackTypeLabels[feedbackType]);
      // If API expects number as sent by form: formData.append("Type", feedbackType);
      // Based on SupervisorFeedback, API expects the numeric type directly if it's an enum integer.
      // For now, assuming API expects the numeric key directly as it's simpler and often the case for enums.
      // If it expects the string, this needs to be feedbackTypeLabels[feedbackType]
      formData.append("Type", feedbackType); // Sending the numeric key

      if (feedbackRating !== "") {
        formData.append("Rating", feedbackRating);
      }

      if (fileAttachment) {
        formData.append("Attachment", fileAttachment);
      }

      console.log("📤 Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetchWithAuth(
        "http://amjad-hamidi-tms.runasp.net/api/Feedbacks/send",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("📥 Server response:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Failed to send feedback.");
      }

      setSuccessMessage(responseText || "✅ Feedback sent successfully.");
      resetForm();
      fetchFeedbacks();
    } catch (error) {
      console.error("❌ Submission error:", error);
      setErrorMessage(error.message || "❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackMessage("");
    setFeedbackRating("");
    setFeedbackType(1); // Reset to 'General' (key 1)
    setRecipientId("");
    setProgramId("");
    setFileAttachment(null);
    setIsFormVisible(false);
  };

  // Debounce search term
  const debouncedFetchFeedbacks = useCallback(
    debounce((newSearchTerm) => {
      setDebouncedSearchTerm(newSearchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchFeedbacks(searchTerm);
    return () => debouncedFetchFeedbacks.cancel();
  }, [searchTerm, debouncedFetchFeedbacks]);

  // Fetch feedbacks when page or debouncedSearchTerm changes
  useEffect(() => {
    fetchFeedbacks(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, fetchFeedbacks]); // Assuming fetchFeedbacks will be wrapped in useCallback

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Helper to get feedback type label, ensuring numeric keys are handled
  const getFeedbackTypeDisplay = (typeValue) => {
    // Assuming feedbackTypeLabels uses numeric keys as defined
    // If API returns string types like "General", then direct use is fine or map them.
    if (typeof typeValue === 'number' && feedbackTypeLabels[typeValue]) {
      return feedbackTypeLabels[typeValue];
    }
    // This case might be less relevant now if API consistently returns numbers
    // and form state is also numeric. Keeping for robustness if strings appear.
    // if (typeof typeValue === 'string' && Object.values(feedbackTypeLabels).includes(typeValue)) {
    //   return typeValue;
    // }
    // Removing this block as allowedFeedbackTypes is removed and typeValue should be numeric from API
    
    return "Unknown";
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 2, md: 3 }, margin: 'auto', backgroundColor: 'transparent' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
      {errorMessage && !isLoading && feedbacks.length === 0 && <Alert severity="info" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {errorMessage && feedbacks.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      {isFormVisible && (
        <Box component="form" onSubmit={handleFeedbackSubmission} sx={{ backgroundColor: 'background.paper', p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'medium', color: 'secondary.main' }}>
            Send New Feedback
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recipient User ID"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  value={feedbackType} // feedbackType is now numeric
                  onChange={(e) => setFeedbackType(Number(e.target.value))} // Ensure value is stored as number
                  label="Feedback Type"
                >
                  {Object.entries(feedbackTypeLabels).map(([key, label]) => (
                    <MenuItem key={key} value={Number(key)}> {/* Ensure MenuItem value is number */}
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography component="legend" sx={{ mb: 0.5, color: 'text.secondary' }}>Rating (Optional)</Typography>
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
                <VisuallyHiddenInput type="file" onChange={(e) => setFileAttachment(e.target.files[0])} />
              </Button>
              {fileAttachment && (
                <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                  Selected: {fileAttachment.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress size={60} />
        </Box>
      ) : !isLoading && feedbacks.length === 0 && !errorMessage ? (
         <Alert severity="info" sx={{ mt: 2 }}>No feedbacks received yet.</Alert>
      ) : feedbacks.length > 0 ? (
        <Box>
          <Grid container spacing={3}>
            {feedbacks.map((feedback) => (
              <Grid item xs={12} sm={6} md={4} key={feedback.feedbackId || feedback.id /* Ensure unique key */}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <StyledAvatar src={feedback.fromImageUrl || undefined} alt={feedback.fromFullName || 'Sender'}>
                        {feedback.fromFullName ? feedback.fromFullName.charAt(0).toUpperCase() : 'S'}
                      </StyledAvatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                          {feedback.fromFullName || 'Anonymous Sender'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Program: {feedback.programName || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Typography variant="body1" sx={{ mb: 1, flexGrow: 1 }}>
                      {feedback.message}
                    </Typography>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} mt={1} mb={1.5} flexWrap="wrap">
                        <Chip 
                            label={getFeedbackTypeDisplay(feedback.type)} 
                            size="small" 
                            color={feedback.type === 2 ? "error" : feedback.type === 3 ? "warning" : feedback.type === 4 ? "success" : "info"} 
                        />
                        {feedback.rating && (
                            <Rating value={feedback.rating} readOnly size="small" />
                        )}
                    </Stack>
                    
                    {feedback.attachmentUrl && (
                      <Button 
                        href={feedback.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        startIcon={<AttachmentIcon />} 
                        size="small"
                        sx={{ alignSelf: 'flex-start', mb:1, textTransform: 'none' }}
                      >
                        View Attachment
                      </Button>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', width: '100%' }}>
                      {new Date(feedback.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                size="large"
              />
            </Stack>
          )}
        </Box>
      ) : null}
    </Paper>
  );
};

export default TraineeFeedback;
