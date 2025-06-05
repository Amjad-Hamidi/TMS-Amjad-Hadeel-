import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  PeopleOutline as SeatsIcon,
  StarBorder as RatingIcon,
  Link as LinkIcon,
  Category as CategoryIcon,
  Business as CompanyIcon,
  SupervisorAccount as SupervisorIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  RocketLaunch as RocketLaunchIcon,
} from "@mui/icons-material";
import { fetchWithAuth } from "../utils/fetchWithAuth";

// Helper for date formatting if needed, though type="date" handles it mostly
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (e) {
    return ""; // Or handle error appropriately
  }
};

function AddTrainingProgram() {
  const initialFormData = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    seatsAvailable: "",
    rating: "",
    contentUrl: "",
    classroomUrl: "",
    categoryId: "",
    companyId: "", // Assuming current user's company or selectable
    supervisorId: "", // Potentially selectable
    imageFile: null,
    status: true,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cleanup for imagePreview URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview); // Revoke previous URL if any
        }
        setImagePreview(URL.createObjectURL(file));
      } else {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null); // Clear preview if file is removed
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccessMessage("");
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "imageFile" && formData[key]) {
        data.append("ImageFile", formData.imageFile, formData.imageFile.name);
      } else if (formData[key] !== null && formData[key] !== "") {
        // Convert boolean to string for FormData if backend expects string
        if (typeof formData[key] === "boolean") {
          data.append(key.charAt(0).toUpperCase() + key.slice(1), formData[key].toString());
        } else {
          data.append(key.charAt(0).toUpperCase() + key.slice(1), formData[key]);
        }
      }
    });

    try {
      const res = await fetchWithAuth(
        "http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms",
        {
          method: "POST",
          body: data, // FormData handles multipart/form-data header automatically
        }
      );

      const contentType = res.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = await res.text(); // Fallback for non-JSON responses
      }

      if (!res.ok) {
        // Assuming result.errors is an object like { FieldName: ["Error message"] }
        // Or result might be a simple string error from text()
        let formattedErrors = {};
        if (typeof result === "string") {
          formattedErrors.general = result;
        } else if (result && result.errors) {
          for (const key in result.errors) {
            formattedErrors[key.toLowerCase()] = result.errors[key].join(", ");
          }
        } else if (result && result.title && result.status) {
          // ProblemDetails format
          formattedErrors.general = `${result.title} (Status: ${result.status})`;
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              formattedErrors[field.toLowerCase()] = messages.join(", ");
            });
          }
        } else {
          formattedErrors.general = "An unknown error occurred.";
        }
        setErrors(formattedErrors);
        setSuccessMessage("");
      } else {
        setSuccessMessage(result.message || "Program submitted successfully!");
        setFormData(initialFormData);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview); // Also revoke on successful submit
        }
        setImagePreview(null);
        setErrors(null);
        // Clear form or redirect
      }
    } catch (error) {
      console.error("Request Failed:", error);
      setErrors({ general: error.message || "Failed to submit program due to a network or server issue." });
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: "transparent" }}>
      <Paper
        elevation={5}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: "2.5rem", mr: 1, color: "secondary.main" }} />
          Add New Training Program
        </Typography>

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setSuccessMessage("")}
          >
            <AlertTitle>Success</AlertTitle>
            {successMessage}
          </Alert>
        )}

        {errors && errors.general && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setErrors((prev) => ({ ...prev, general: null }))}
          >
            <AlertTitle>Error</AlertTitle>
            {errors.general}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Program Title */}
          <Box mb={3}>
            <TextField
              name="title"
              label="Program Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter program title (2-30 characters)"
              error={!!errors?.title}
              helperText={errors?.title || "Min 2, Max 30 characters"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Description */}
          <Box mb={3}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Detailed description (20-250 characters)"
              error={!!errors?.description}
              helperText={errors?.description || "Min 20, Max 250 characters"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Start Date & End Date (same row) */}
          <Box mb={3} display="flex" gap={2}>
            <TextField
              sx={{ flex: 1 }}
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors?.startdate}
              helperText={errors?.startdate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ flex: 1 }}
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors?.enddate}
              helperText={errors?.enddate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: formData.startDate },
              }}
            />
          </Box>

          {/* Location */}
          <Box mb={3}>
            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="e.g., Online, New York Office (3-50 characters)"
              error={!!errors?.location}
              helperText={errors?.location || "Min 3, Max 50 characters"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Seats */}
          <Box mb={3}>
            <TextField
              name="seatsAvailable"
              label="Seats"
              type="number"
              value={formData.seatsAvailable}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="1-50"
              error={!!errors?.seatsavailable}
              helperText={errors?.seatsavailable || "Range: 1-50"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SeatsIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: 1, max: 50 },
              }}
            />
          </Box>

          {/* Rating */}
          <Box mb={3}>
            <TextField
              name="rating"
              label="Rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="1-5"
              error={!!errors?.rating}
              helperText={errors?.rating || "Range: 1-5, step 0.1"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RatingIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: 1, max: 5, step: "0.1" },
              }}
            />
          </Box>

          {/* Content URL & Classroom URL (same row) */}
          <Box mb={3} display="flex" gap={2}>
            <TextField
              sx={{ flex: 1 }}
              name="contentUrl"
              label="Content URL"
              type="url"
              value={formData.contentUrl}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://example.com/course-materials"
              error={!!errors?.contenturl}
              helperText={errors?.contenturl || "Must be a valid URL"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ flex: 1 }}
              name="classroomUrl"
              label="Classroom URL"
              type="url"
              value={formData.classroomUrl}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://zoom.us/j/meeting_id"
              error={!!errors?.classroomurl}
              helperText={errors?.classroomurl || "Must be a valid URL"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Category ID */}
          <Box mb={3}>
            <TextField
              name="categoryId"
              label="Category ID"
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter Category ID"
              error={!!errors?.categoryid}
              helperText={errors?.categoryid}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Company ID (Optional) */}
          <Box mb={3}>
            <TextField
              name="companyId"
              label="Company ID (Optional)"
              type="number"
              value={formData.companyId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="Enter Company ID if applicable"
              error={!!errors?.companyid}
              helperText={errors?.companyid}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CompanyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Supervisor ID (Optional) */}
          <Box mb={3}>
            <TextField
              name="supervisorId"
              label="Supervisor ID (Optional)"
              type="number"
              value={formData.supervisorId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="Enter Supervisor ID if applicable"
              error={!!errors?.supervisorid}
              helperText={errors?.supervisorid}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SupervisorIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Upload Program Image */}
          <Box mb={3}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 1.5,
                color: errors?.imagefile ? "error.main" : "primary.main",
                borderColor: errors?.imagefile ? "error.main" : "primary.main",
                "&:hover": {
                  backgroundColor: errors?.imagefile
                    ? "rgba(211, 47, 47, 0.04)"
                    : "rgba(25, 118, 210, 0.04)",
                  borderColor: errors?.imagefile ? "error.dark" : "primary.dark",
                },
              }}
            >
              Upload Program Image
              <input
                type="file"
                name="imageFile"
                hidden
                onChange={handleChange}
                accept="image/*"
              />
            </Button>
            {imagePreview && (
              <Box mt={2} textAlign="center">
                <Typography variant="subtitle2">Image Preview:</Typography>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: "150px",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    marginTop: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </Box>
            )}
            {errors?.imagefile && (
              <Typography
                color="error"
                variant="caption"
                display="block"
                sx={{ mt: 1, ml: 1.5 }}
              >
                {errors.imagefile}
              </Typography>
            )}
          </Box>

          {/* Program Active */}
          <Box mb={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.status}
                  onChange={handleChange}
                  name="status"
                  color="primary"
                />
              }
              label="Program Active"
            />
          </Box>

          {/* Submit Button */}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />
              }
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px 0 rgba(0,110,255,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px 0 rgba(0,110,255,0.4)",
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {isLoading ? "Submitting..." : "Submit Program"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddTrainingProgram;
