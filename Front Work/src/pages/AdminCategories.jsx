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
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SearchIcon from '@mui/icons-material/Search'; // أيقونة البحث

import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = "https://amjad-hamidi-tms.runasp.net/api";

const AdminCategories = () => {
  const navigate = useNavigate();

  // حالات البيانات والتحميل
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالات الـ Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); //  <<<--- حالة البحث الجديدة

  // حالات الـ Snackbar لإشعارات النجاح/الخطأ
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // حالات الـ Modal للتعديل
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    categoryImage: null,
    generalSkills: [],
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  // دالة لجلب الفئات (Categories) من الـ API
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE_URL}/Categories`);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);
      if (searchQuery) { // <<<--- إضافة نص البحث إلى الـ URL
        url.searchParams.append("search", searchQuery);
      }

      const response = await fetchWithAuth(url.toString());
      const data = await response.json();

      if (response.ok) {
        setCategories(data.items);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        // تأكد أن رقم الصفحة الحالية ضمن النطاق بعد الجلب
        if (page > data.totalPages && data.totalPages > 0) {
            setPage(data.totalPages);
        } else if (data.totalPages === 0) {
            setPage(1);
        }
      } else {
        setError(data.message || "Failed to fetch categories.");
        setSnackbarMessage(data.message || "Failed to fetch categories.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Network error or server unavailable.");
      setSnackbarMessage("Network error or server unavailable.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]); // <<<--- إضافة searchQuery كـ dependency

  // جلب البيانات عند تحميل المكون أو تغير Pagination أو البحث
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  // <<<--- دالة جديدة لمعالجة تغيير نص البحث
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // إعادة تعيين الصفحة إلى 1 عند تغيير نص البحث
  };

  // دالة لحذف فئة واحدة
  const handleDeleteCategory = async (id, name) => {
    Swal.fire({
      title: `Are you sure you want to delete ${name}?`,
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
          const response = await fetchWithAuth(`${API_BASE_URL}/Categories/${id}`, {
            method: "DELETE",
          });

          if (response.status === 204) {
            Swal.fire(
              "Deleted!",
              `Category "${name}" has been deleted.`,
              "success"
            );
            fetchCategories(); // إعادة جلب البيانات لتحديث الجدول
            setSnackbarMessage(`Category "${name}" deleted successfully!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || `Failed to delete category "${name}".`;
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
          console.error("Delete category error:", err);
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

  // دالة لحذف جميع الفئات
  const handleDeleteAllCategories = async () => {
    Swal.fire({
      title: "Are you absolutely sure?",
      html: "This action will delete <strong>ALL</strong> categories and cannot be undone!",
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
          const response = await fetchWithAuth(`${API_BASE_URL}/Categories/delete-all`, {
            method: "DELETE",
          });

          if (response.status === 204) {
            Swal.fire(
              "All Deleted!",
              "All categories have been successfully deleted.",
              "success"
            );
            setPage(1);
            fetchCategories();
            setSnackbarMessage("All categories deleted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Failed to delete all categories.";
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
          console.error("Delete all categories error:", err);
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
        imageAlt: "Category Image Preview",
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
  const handleEditClick = (category) => {
    setCurrentCategoryToEdit(category);
    setEditForm({
      name: category.name,
      description: category.description,
      categoryImage: category.categoryImage,
      generalSkills: category.generalSkills ? [...category.generalSkills] : [],
    });
    setNewImageFile(null);
    setNewImagePreview(null);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentCategoryToEdit(null);
    setNewImageFile(null);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
      setNewImagePreview(null);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
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
    setEditForm((prev) => ({ ...prev, categoryImage: null }));
  };

  const handleAddSkill = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      const skillInput = event.target.value || editForm.newSkillInput;
      const skill = skillInput.trim();
      if (skill && !editForm.generalSkills.includes(skill)) {
        setEditForm((prev) => ({
          ...prev,
          generalSkills: [...prev.generalSkills, skill],
          newSkillInput: ""
        }));
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      generalSkills: prev.generalSkills.filter((skill) => skill !== skillToRemove),
    }));
  };

 const handleUpdateCategory = async () => {
  if (!currentCategoryToEdit) return;

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("id", currentCategoryToEdit.id);
    formData.append("name", editForm.name);
    formData.append("description", editForm.description);

    if (newImageFile) {
      formData.append("categoryImageFile", newImageFile);
    } else if (editForm.categoryImage && currentCategoryToEdit.categoryImage) {
      // حسب احتياج API، هنا ممكن تضيف URL الصورة القديمة إذا مطلوب
    }

    editForm.generalSkills.forEach((skill, index) => {
      formData.append(`generalSkills[${index}]`, skill);
    });

    const response = await fetchWithAuth(
      `${API_BASE_URL}/Categories/${currentCategoryToEdit.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Category "${editForm.name}" updated successfully!`,
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
        fetchCategories();
        handleEditModalClose();
        setSnackbarMessage(`Category "${editForm.name}" updated successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      });
    } else {
      const errorData = await response.json();

      let errorMessage = "Failed to update category.";

      if (errorData.errors) {
        // في رسالة واحدة Validation دمج كل أخطاء الـ
        errorMessage = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
      } else if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

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
    console.error("Update category error:", err);
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
          Loading Categories...
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
          Error Loading Categories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, background: "linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)" }}
          onClick={fetchCategories}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
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
            Manage Categories
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
              onClick={() => navigate("/admin/add-category")}
            >
              Add New Category
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
              onClick={handleDeleteAllCategories}
              disabled={categories.length === 0 && totalCount === 0}
            >
              Delete All Categories
            </Button>
          </Stack>
        </Stack>

        {/* Search Bar <<<--- تمت إضافته هنا */}
        <Box mb={3}>
          <TextField
            fullWidth
            label="Search Categories (Name, Description)"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
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

        {categories.length === 0 && !loading && !error ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No categories found. Start by adding a new one!
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)" }}>
            <Table sx={{ minWidth: 650 }} aria-label="categories table">
              <TableHead sx={{ bgcolor: "#e0e7ee" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1e3c72" }}>Skills</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#1e3c72" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category.id}
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
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      <Tooltip title="Click to view image" arrow>
                        <Avatar
                          src={category.categoryImage || undefined}
                          alt={category.name}
                          sx={{
                            width: 50,
                            height: 50,
                            cursor: category.categoryImage ? "pointer" : "default",
                            border: "1px solid #ddd",
                            bgcolor: category.categoryImage ? "transparent" : "grey.300",
                          }}
                          onClick={() => handleImageClick(category.categoryImage)}
                        >
                          {!category.categoryImage && <ImageSearchIcon />}
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{category.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={category.description} arrow>
                        <span>{category.description}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" spacing={0.5}>
                        {category.generalSkills && category.generalSkills.length > 0 ? (
                          category.generalSkills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{
                                borderColor: "#2a5298",
                                color: "#2a5298",
                                fontWeight: "normal",
                                ".MuiChip-label": {
                                  fontSize: '0.75rem',
                                },
                                transition: 'background-color 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                }
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No skills
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Category" arrow>
                        <IconButton
                          color="primary"
                          sx={{
                            "&:hover": {
                              color: "#1e3c72",
                              transform: "scale(1.1)",
                            },
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onClick={() => handleEditClick(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category" arrow>
                        <IconButton
                          color="error"
                          sx={{
                            "&:hover": {
                              color: "#d32f2f",
                              transform: "scale(1.1)",
                            },
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onClick={() => handleDeleteCategory(category.id, category.name)}
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
              Total Categories: <span style={{ fontWeight: 'bold' }}>{totalCount}</span>
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

      {/* Edit Category Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditModalClose}
        fullWidth
        maxWidth="sm"
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Edit Category</Typography>
          <IconButton onClick={handleEditModalClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Category Name */}
            <TextField
              label="Category Name"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <CategoryIcon sx={{ color: 'action.active', mr: 1 }} />
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

            {/* Image Upload and Preview */}
            <Box sx={{ border: '1px dashed #a5b4c4', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.7)' }}>
                <FormLabel component="legend" sx={{ color: '#1e3c72', fontWeight: 'bold', mb: 1 }}>Category Image</FormLabel>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="category-image-upload"
                    type="file"
                    onChange={handleImageFileChange}
                />
                <label htmlFor="category-image-upload">
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
                {(newImagePreview || editForm.categoryImage) && (
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
                        onClick={() => handleImageClick(newImagePreview || editForm.categoryImage)}
                    >
                        <img
                            src={newImagePreview || editForm.categoryImage}
                            alt="Category Preview"
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

            {/* General Skills */}
            <Box>
              <FormLabel component="legend" sx={{ color: '#1e3c72', fontWeight: 'bold', mb: 1 }}>General Skills</FormLabel>
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                {editForm.generalSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="secondary"
                    variant="outlined"
                    deleteIcon={<RemoveCircleOutlineIcon />}
                    sx={{
                        borderColor: "#7b1fa2",
                        color: "#7b1fa2",
                        transition: 'background-color 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#f3e5f5',
                        },
                        mb: { xs: 1, sm: 0 }
                    }}
                  />
                ))}
              </Stack>
              <TextField
                label="Add new skill"
                name="newSkillInput"
                value={editForm.newSkillInput || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, newSkillInput: e.target.value }))}
                onKeyPress={handleAddSkill}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                    endAdornment: (
                        <IconButton
                            onClick={handleAddSkill}
                            disabled={!editForm.newSkillInput || editForm.generalSkills.includes(editForm.newSkillInput?.trim())}
                            color="primary"
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    ),
                }}
                sx={formFieldStyles}
              />
            </Box>
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
            onClick={handleUpdateCategory}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Category"}
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

const formFieldStyles = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255,255,255,0.8)',
        '& fieldset': { borderColor: '#a5b4c4' },
        '&:hover fieldset': { borderColor: '#1e3c72' },
        '&.Mui-focused fieldset': { borderColor: '#2a5298' },
    },
};

export default AdminCategories;