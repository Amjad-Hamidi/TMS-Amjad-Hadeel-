import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';
import TitleIcon from '@mui/icons-material/Title'; // For program title
import DescriptionIcon from '@mui/icons-material/Description'; // For description
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // For duration
import LocationOnIcon from '@mui/icons-material/LocationOn'; // For location
import EventIcon from '@mui/icons-material/Event'; // For start/end date
import CategoryIcon from '@mui/icons-material/Category'; // For category name
import BusinessIcon from '@mui/icons-material/Business'; // For company name
import PersonIcon from '@mui/icons-material/Person'; // For supervisor name
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For approval status

import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = "https://amjad-hamidi-tms.runasp.net/api";

const AdminPrograms = () => {
  const navigate = useNavigate();

  // حالات البيانات والتحميل
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالات الـ Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // لحالة البحث

  // حالات الـ Snackbar لإشعارات النجاح/الخطأ
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // حالات الـ Modal للتعديل
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProgramToEdit, setCurrentProgramToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    durationInDays: "",
    startDate: "",
    endDate: "",
    location: "",
    seatsAvailable: 0,
    contentUrl: "",
    classroomUrl: "",
    imagePath: null, // This will store the original URL
  });
  const [newImageFile, setNewImageFile] = useState(null); // To store the new file object
  const [newImagePreview, setNewImagePreview] = useState(null); // To store URL for preview

  // دالة لجلب برامج التدريب (Training Programs) من الـ API
  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE_URL}/TrainingPrograms`);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);
      if (searchQuery) {
        url.searchParams.append("search", searchQuery);
      }

      const response = await fetchWithAuth(url.toString());
      const data = await response.json();

      if (response.ok) {
        setPrograms(data.items);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        if (page > data.totalPages && data.totalPages > 0) {
            setPage(data.totalPages);
        } else if (data.totalPages === 0) {
            setPage(1);
        }
      } else {
        setError(data.message || "Failed to fetch training programs.");
        setSnackbarMessage(data.message || "Failed to fetch training programs.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Fetch programs error:", err);
      setError("Network error or server unavailable.");
      setSnackbarMessage("Network error or server unavailable.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]); // إضافة searchQuery كـ dependency

  // جلب البيانات عند تحميل المكون أو تغير Pagination أو البحث
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Cleanup for image preview URL
  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

  // معالجة تغيير الصفحة (لأزرار السابق/التالي)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // معالجة تغيير عدد الصفوف لكل صفحة (Limit)
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Reset page to 1 when limit changes
  };

  // معالجة تغيير نص البحث
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset page to 1 when search query changes
  };

  // دالة لحذف برنامج واحد
  const handleDeleteProgram = async (id, title) => {
    Swal.fire({
      title: `Are you sure you want to delete "${title}"?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        header: 'swal-header',
        title: 'swal-title',
        content: 'swal-content',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetchWithAuth(`${API_BASE_URL}/TrainingPrograms/${id}`, {
            method: "DELETE",
          });

          if (response.status === 204) {
            Swal.fire(
              "Deleted!",
              `Program "${title}" has been deleted.`,
              "success"
            );
            fetchPrograms(); // إعادة جلب البيانات لتحديث الجدول
            setSnackbarMessage(`Program "${title}" deleted successfully!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || `Failed to delete program "${title}".`;
            Swal.fire(
              "Error!",
              errorMessage,
              "error"
            );
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (err) {
          console.error("Delete program error:", err);
          Swal.fire(
            "Error!",
            `Network error: ${err.message}`,
            "error"
          );
          setSnackbarMessage(`Network error: ${err.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    });
  };

  // دالة لحذف جميع برامج التدريب (تفترض وجود endpoint في الـ API)
  const handleDeleteAllPrograms = async () => {
    Swal.fire({
      title: "Are you absolutely sure?",
      html: "This action will delete <strong>ALL</strong> training programs and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
      customClass: {
        container: 'swal-container',
        popup: 'swal-popup',
        header: 'swal-header',
        title: 'swal-title',
        content: 'swal-content',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // تأكد من أن الـ API الخاص بك يدعم هذا الـ endpoint
          const response = await fetchWithAuth(`${API_BASE_URL}/TrainingPrograms/delete-all`, {
            method: "DELETE",
          });

          if (response.status === 204) {
            Swal.fire(
              "All Deleted!",
              "All training programs have been successfully deleted.",
              "success"
            );
            setPage(1);
            fetchPrograms();
            setSnackbarMessage("All programs deleted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Failed to delete all training programs.";
            Swal.fire(
              "Error!",
              errorMessage,
              "error"
            );
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        } catch (err) {
          console.error("Delete all programs error:", err);
          Swal.fire(
            "Error!",
            `Network error: ${err.message}`,
            "error"
          );
          setSnackbarMessage(`Network error: ${err.message}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    });
  };

  // دالة لعرض الصورة بحجم كبير عند النقر عليها (باستخدام SweetAlert2)
  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: "Program Image Preview",
        showConfirmButton: false,
        showCloseButton: true,
        width: "auto",
        padding: "0",
        background: "transparent",
        backdrop: `
          rgba(0,0,0,0.8)
          left top
          no-repeat
        `,
        customClass: {
          popup: 'swal2-no-border-radius',
          image: 'swal2-image-custom'
        },
        didOpen: () => {
            const swalImage = Swal.getPopup().querySelector('.swal2-image-custom');
            if (swalImage) {
                swalImage.style.maxWidth = '90vw';
                swalImage.style.maxHeight = '90vh';
                swalImage.style.objectFit = 'contain';
            }
        }
      });
    }
  };

  // دالة لإغلاق الـ Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Functions for Edit Modal
  const handleEditClick = (program) => {
    setCurrentProgramToEdit(program);
    setEditForm({
      title: program.title,
      description: program.description,
      durationInDays: program.durationInDays,
      startDate: program.startDate.split('T')[0], // لتنسيق التاريخ لـ input type="date"
      endDate: program.endDate.split('T')[0],   // لتنسيق التاريخ لـ input type="date"
      location: program.location,
      seatsAvailable: program.seatsAvailable,
      contentUrl: program.contentUrl,
      classroomUrl: program.classroomUrl,
      imagePath: program.imagePath, // Original image URL
    });
    setNewImageFile(null);
    setNewImagePreview(null);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentProgramToEdit(null);
    setNewImageFile(null);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
      setNewImagePreview(null);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
      setNewImagePreview(URL.createObjectURL(file));
    } else {
      setNewImageFile(null);
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
      setNewImagePreview(null);
    }
  };

  const handleClearImage = () => {
    setNewImageFile(null);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setNewImagePreview(null);
    setEditForm((prev) => ({ ...prev, imagePath: null })); // Clear image URL if user wants to remove existing one
  };

  const handleUpdateProgram = async () => {
    if (!currentProgramToEdit) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", currentProgramToEdit.trainingProgramId); // تأكد من استخدام ID الصحيح
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("durationInDays", editForm.durationInDays);
      formData.append("startDate", editForm.startDate);
      formData.append("endDate", editForm.endDate);
      formData.append("location", editForm.location);
      formData.append("seatsAvailable", editForm.seatsAvailable);
      formData.append("contentUrl", editForm.contentUrl);
      formData.append("classroomUrl", editForm.classroomUrl);

      // إذا كان هناك ملف صورة جديد، قم بإضافته
      if (newImageFile) {
        formData.append("imageFile", newImageFile);
      } else if (editForm.imagePath && currentProgramToEdit.imagePath) {
        // إذا لم يكن هناك ملف جديد ولكن كانت هناك صورة سابقة ولم يتم مسحها،
        // يجب أن يحدد API الخاص بك كيفية التعامل مع هذا.
        // في معظم الحالات، إذا لم ترسل ملف صورة جديد، سيحتفظ الـ API بالصورة الموجودة.
        // إذا كان الـ API يتوقع قيمة معينة للإشارة إلى الاحتفاظ بالصورة، أضفها هنا.
      }


      const response = await fetchWithAuth(
        `${API_BASE_URL}/TrainingPrograms/${currentProgramToEdit.trainingProgramId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Program "${editForm.title}" updated successfully!`,
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            header: 'swal-header',
            title: 'swal-title',
            content: 'swal-content'
          }
        }).then(() => {
          fetchPrograms();
          handleEditModalClose();
          setSnackbarMessage(`Program "${editForm.title}" updated successfully!`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to update program.";
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            header: 'swal-header',
            title: 'swal-title',
            content: 'swal-content'
          }
        });
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Update program error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error!',
        text: `Could not connect to server: ${err.message}`,
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup',
          header: 'swal-header',
          title: 'swal-title',
          content: 'swal-content'
        }
      });
      setSnackbarMessage(`Network error: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2, color: "#1e3c72" }}>
          Loading Training Programs...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Training Programs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, background: "linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)" }}
          onClick={fetchPrograms}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // دالة مساعدة لتحويل حالة الموافقة إلى نص ولون مناسب
  const getApprovalStatusChip = (status) => {
    switch (status) {
      case 0: // Pending
        return <Chip label="Pending" size="small" color="warning" sx={{ bgcolor: '#ffc10720', color: '#ffc107', fontWeight: 'bold' }} />;
      case 1: // Approved
        return <Chip label="Approved" size="small" color="success" sx={{ bgcolor: '#4caf5020', color: '#4caf50', fontWeight: 'bold' }} />;
      case 2: // Rejected
        return <Chip label="Rejected" size="small" color="error" sx={{ bgcolor: '#f4433620', color: '#f44336', fontWeight: 'bold' }} />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1400, // زيادة العرض قليلاً
        mx: "auto",
        p: { xs: 2, md: 4 },
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: "#fff" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1e3c72",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              textAlign: { xs: "center", sm: "left" }
            }}
          >
            Manage Training Programs
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #66BB6A 30%, #4CAF50 90%)",
                  transform: "scale(1.02)",
                },
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => navigate("/admin/add-program")}
            >
              Add New Program
            </Button>
            <Button
              variant="contained"
              startIcon={<AllInclusiveIcon />}
              sx={{
                background: "linear-gradient(45deg, #f44336 30%, #ef5350 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #ef5350 30%, #f44336 90%)",
                  transform: "scale(1.02)",
                },
                transition: "transform 0.3s ease-in-out",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onClick={handleDeleteAllPrograms}
              disabled={programs.length === 0 && totalCount === 0}
            >
              Delete All Programs
            </Button>
          </Stack>
        </Stack>

        {/* Search Bar */}
        <Box mb={3}>
          <TextField
            fullWidth
            label="Search Programs (Title, Description, Location)"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.8)',
                '& fieldset': { borderColor: '#a5b4c4' },
                '&:hover fieldset': { borderColor: '#1e3c72' },
                '&.Mui-focused fieldset': { borderColor: '#2a5298' },
              },
            }}
          />
        </Box>


        {programs.length === 0 && !loading && !error ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No training programs found. Start by adding a new one!
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)" }}>
            <Table sx={{ minWidth: 1000 }} aria-label="training programs table">
              <TableHead sx={{ bgcolor: "#e0e7ee" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Seats</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Supervisor</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#1e3c72" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.map((program) => (
                  <TableRow
                    key={program.trainingProgramId}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9fbfd" },
                      "&:hover": {
                        backgroundColor: "#e8f0fe",
                        transform: "scale(1.005)",
                        transition: "transform 0.2s ease-in-out",
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    <TableCell>{program.trainingProgramId}</TableCell>
                    <TableCell>
                      <Tooltip title="Click to view image" arrow>
                        <Avatar
                          src={program.imagePath || undefined}
                          alt={program.title}
                          sx={{
                            width: 50,
                            height: 50,
                            cursor: program.imagePath ? "pointer" : "default",
                            border: "1px solid #ddd",
                            bgcolor: program.imagePath ? "transparent" : "grey.300",
                          }}
                          onClick={() => handleImageClick(program.imagePath)}
                        >
                          {!program.imagePath && <ImageSearchIcon />}
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{program.title}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={program.description} arrow>
                        <span>{program.description}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{program.durationInDays}</TableCell>
                    <TableCell>{program.location}</TableCell>
                    <TableCell>{program.seatsAvailable}</TableCell>
                    <TableCell>{program.categoryName}</TableCell>
                    <TableCell>{program.companyName}</TableCell>
                    <TableCell>{program.supervisorName}</TableCell>
                    <TableCell>{getApprovalStatusChip(program.approvalStatus)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Program" arrow>
                        <IconButton
                          color="primary"
                          sx={{
                            "&:hover": {
                              color: "#1e3c72",
                              transform: "scale(1.1)",
                            },
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onClick={() => handleEditClick(program)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Program" arrow>
                        <IconButton
                          color="error"
                          sx={{
                            "&:hover": {
                              color: "#d32f2f",
                              transform: "scale(1.1)",
                            },
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onClick={() => handleDeleteProgram(program.trainingProgramId, program.title)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Custom Pagination Section */}
        {totalCount > 0 && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "#f0f4f8",
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Pagination Info */}
            <Typography variant="body1" sx={{ color: "#1e3c72", fontWeight: "medium" }}>
              Total Programs: <span style={{ fontWeight: 'bold' }}>{totalCount}</span>
              <br />
              Page <span style={{ fontWeight: 'bold' }}>{page}</span> of <span style={{ fontWeight: 'bold' }}>{totalPages}</span>
            </Typography>

            {/* Items per page (Limit) Selector */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Items per page</InputLabel>
              <Select
                labelId="rows-per-page-label"
                id="rows-per-page-select"
                value={limit}
                label="Items per page"
                onChange={handleLimitChange}
                sx={{
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#a5b4c4' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1e3c72' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2a5298' },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            {/* Navigation Buttons (Previous/Next only) */}
            <Stack direction="row" spacing={1}>
              {/* Previous Page Button */}
              <Button
                variant="outlined"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                startIcon={<ArrowBackIosNewIcon />}
                sx={{
                    color: '#2a5298',
                    borderColor: '#a5b4c4',
                    '&:hover': {
                        borderColor: '#1e3c72',
                        backgroundColor: '#e3f2fd',
                    },
                    '&.Mui-disabled': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                    }
                }}
              >
                Previous
              </Button>

              {/* Next Page Button */}
              <Button
                variant="outlined"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                endIcon={<ArrowForwardIosIcon />}
                sx={{
                    color: '#2a5298',
                    borderColor: '#a5b4c4',
                    '&:hover': {
                        borderColor: '#1e3c72',
                        backgroundColor: '#e3f2fd',
                    },
                    '&.Mui-disabled': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                    }
                }}
              >
                Next
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Edit Program Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditModalClose}
        fullWidth
        maxWidth="md" // زيادة عرض المودال ليناسب الحقول الإضافية
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
            background: 'linear-gradient(135deg, #e0e7ee, #f0f4f8)',
          },
        }}
        TransitionProps={{
          timeout: {
            enter: 400,
            exit: 300,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: "#1e3c72", color: "white", px: 3, py: 2, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Training Program</Typography>
          <IconButton onClick={handleEditModalClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              label="Program Title"
              name="title"
              value={editForm.title}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              sx={formFieldStyles}
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={editForm.description}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <DescriptionIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', pt: 1 }} />
                ),
              }}
              sx={formFieldStyles}
            />

            {/* Duration & Seats */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Duration (e.g., 60 days)"
                name="durationInDays"
                value={editForm.durationInDays}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <AccessTimeIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={formFieldStyles}
              />
              <TextField
                label="Seats Available"
                name="seatsAvailable"
                type="number"
                value={editForm.seatsAvailable}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <EventIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={formFieldStyles}
              />
            </Stack>

            {/* Start Date & End Date */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={editForm.startDate}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={formFieldStyles}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={editForm.endDate}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={formFieldStyles}
              />
            </Stack>

            {/* Location */}
            <TextField
              label="Location"
              name="location"
              value={editForm.location}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              sx={formFieldStyles}
            />

            {/* Content URL & Classroom URL */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Content URL"
                name="contentUrl"
                value={editForm.contentUrl}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={formFieldStyles}
              />
              <TextField
                label="Classroom URL"
                name="classroomUrl"
                value={editForm.classroomUrl}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={formFieldStyles}
              />
            </Stack>

            {/* Image Upload and Preview */}
            <Box sx={{ border: '1px dashed #a5b4c4', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.7)' }}>
                <FormLabel component="legend" sx={{ color: '#1e3c72', fontWeight: 'bold', mb: 1 }}>Program Image</FormLabel>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="program-image-upload"
                    type="file"
                    onChange={handleImageFileChange}
                />
                <label htmlFor="program-image-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<AddPhotoAlternateIcon />}
                        sx={{
                            color: '#2a5298',
                            borderColor: '#a5b4c4',
                            '&:hover': {
                                borderColor: '#1e3c72',
                                backgroundColor: '#e3f2fd',
                            },
                        }}
                    >
                        Upload Image
                    </Button>
                </label>
                {(newImagePreview || editForm.imagePath) && (
                    <Box
                        sx={{
                            position: 'relative',
                            width: 100,
                            height: 100,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleImageClick(newImagePreview || editForm.imagePath)}
                    >
                        <img
                            src={newImagePreview || editForm.imagePath}
                            alt="Program Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearImage();
                            }}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(255, 0, 0, 0.7)',
                                color: 'white',
                                '&:hover': { bgcolor: 'red' },
                            }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {/* Displaying Read-Only Fields (Category, Company, Supervisor, ApprovalStatus) */}
            <Typography variant="subtitle1" sx={{ color: '#1e3c72', fontWeight: 'bold', mt: 2 }}>Program Details (Read-Only)</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip icon={<CategoryIcon />} label={`Category: ${currentProgramToEdit?.categoryName || 'N/A'}`} variant="outlined" sx={readOnlyChipStyles} />
                <Chip icon={<BusinessIcon />} label={`Company: ${currentProgramToEdit?.companyName || 'N/A'}`} variant="outlined" sx={readOnlyChipStyles} />
                <Chip icon={<PersonIcon />} label={`Supervisor: ${currentProgramToEdit?.supervisorName || 'N/A'}`} variant="outlined" sx={readOnlyChipStyles} />
                <Chip icon={<CheckCircleOutlineIcon />} label={`Approval Status: ${currentProgramToEdit?.approvalStatus === 0 ? 'Pending' : currentProgramToEdit?.approvalStatus === 1 ? 'Approved' : currentProgramToEdit?.approvalStatus === 2 ? 'Rejected' : 'N/A'}`} variant="outlined" sx={readOnlyChipStyles} />
            </Stack>

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "#e0e7ee", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <Button
            onClick={handleEditModalClose}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#f44336',
              borderColor: '#f44336',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProgram}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: "linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #2a5298 30%, #1e3c72 90%)",
                transform: "scale(1.02)",
              },
              transition: "transform 0.2s ease-in-out",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Program"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// أنماط مشتركة لحقول النموذج لتقليل التكرار
const formFieldStyles = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255,255,255,0.8)',
        '& fieldset': { borderColor: '#a5b4c4' },
        '&:hover fieldset': { borderColor: '#1e3c72' },
        '&.Mui-focused fieldset': { borderColor: '#2a5298' },
    },
};

// أنماط مشتركة لشرائح القراءة فقط
const readOnlyChipStyles = {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#1e3c72',
    borderColor: '#a5b4c4',
    backgroundColor: '#e0e7ee',
    p: 1,
    height: 'auto', // لتناسب المحتوى إذا كان طويلاً
    '& .MuiChip-icon': {
        color: '#2a5298',
    }
};

export default AdminPrograms;