import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, Button, Box, Select, MenuItem, InputLabel, FormControl, Alert, Avatar, CircularProgress, InputAdornment, Dialog, DialogContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import for Preview Icon
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // For Supervisor
import SchoolIcon from '@mui/icons-material/School'; // For Trainee
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // For Admin
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import IconButton from '@mui/material/IconButton'; // Import IconButton
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import TMSLogo from '../images/TMS Logo.png'; // Assuming your logo is here

const GENDER_OPTIONS = [
  { value: 0, label: 'Male' },
  { value: 1, label: 'Female' },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    phoneNumber: '',
    gender: '',
    birthDate: '',
    profileImageFile: null,
    cvFile: null,
    role: '',
  });
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState('');
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState(''); // New state for image preview
  const [currentCvPath, setCurrentCvPath] = useState('');
  const [cvFilePreviewName, setCvFilePreviewName] = useState(''); // New state for CV preview name
  const [cvFilePreviewUrl, setCvFilePreviewUrl] = useState(''); // New state for CV file preview URL
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCvUpload, setLoadingCvUpload] = useState(false);
  const [loadingCvDelete, setLoadingCvDelete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cvError, setCvError] = useState('');
  const [cvSuccess, setCvSuccess] = useState('');
  const [openImageDialog, setOpenImageDialog] = useState(false); // New state for image dialog
  const [imageError, setImageError] = useState('');
  const [imageSuccess, setImageSuccess] = useState('');
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const [loadingImageDelete, setLoadingImageDelete] = useState(false);


  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    setError('');
    try {
      const response = await fetchWithAuth("https://amjad-hamidi-tms.runasp.net/api/Profiles/form-edit-profile");
      if (!response.ok) {
        throw new Error("Failed to load profile data.");
      }
      const data = await response.json();
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        userName: data.userName || '',
        phoneNumber: data.phoneNumber || '',
        gender: data.gender !== null ? data.gender : '',
        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
        profileImageFile: null,
        cvFile: null,
        role: data.role || '',
      });
      setCurrentProfileImageUrl(data.profileImageUrl || '');
      setCurrentCvPath(data.cvPath || '');
      // Clear any pending previews from previous selections
      setProfileImagePreviewUrl('');
      setCvFilePreviewName('');
      setCvFilePreviewUrl('');
    } catch (err) {
      setError(err.message || "Error loading profile data.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === 'profileImageFile') {
      setForm((prev) => ({ ...prev, profileImageFile: file }));
      setProfileImagePreviewUrl(file ? URL.createObjectURL(file) : '');
      setImageError(''); // Clear image errors when a new file is selected
      setImageSuccess(''); // Clear image success when a new file is selected
    } else if (e.target.name === 'cvFile') {
      setForm((prev) => ({ ...prev, cvFile: file }));
      setCvFilePreviewName(file ? file.name : '');
      setCvFilePreviewUrl(file ? URL.createObjectURL(file) : ''); // Set CV preview URL
      setCvError(''); // Clear CV errors when a new file is selected
      setCvSuccess(''); // Clear CV success when a new file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); // Clear previous messages
    setLoadingUpdate(true);
    try {
      const token = localStorage.getItem('accessToken');
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '' && key !== 'profileImageFile' && key !== 'cvFile' && key !== 'role') {
          data.append(key.charAt(0).toUpperCase() + key.slice(1), value);
        }
      });

      if (form.profileImageFile) {
        data.append('ProfileImageFile', form.profileImageFile);
      }

      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/update-profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        let msg = "An unexpected error occurred.";
        try {
          const json = await res.json();
          msg = json.message || Object.values(json.errors || {}).flat().join(' ') || msg;
        } catch {
          const text = await res.text();
          msg = text || msg;
        }
        setError(msg);
      } else {
        let successMessage = 'Profile updated successfully.';
        try {
          const text = await res.text();
          if (text) {
            const updatedData = JSON.parse(text);
            successMessage = updatedData.message || successMessage;
          }
        } catch (jsonParseError) {
          console.warn("Successful response but JSON parse failed:", jsonParseError);
        }
        setSuccess(successMessage);
        // Refresh profile data to reflect changes immediately after a short delay
        setTimeout(async () => {
          await fetchUserProfile();
          setSuccess(''); // Clear success message after refresh
        }, 1500); // 1.5 seconds delay
      }
    } catch (err) {
      setError(err.message || 'Network error or unexpected response.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleUploadCV = async () => {
    setCvError(''); setCvSuccess(''); setLoadingCvUpload(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      if (form.cvFile) {
        formData.append('CVFile', form.cvFile);
      } else {
        throw new Error("Please select a CV file to upload.");
      }

      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/upload-cv', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let msg = "An unexpected error occurred during CV upload.";
        try {
          const json = await res.json();
          msg = json.message || Object.values(json.errors || {}).flat().join(' ') || msg;
        } catch {
          const text = await res.text();
          msg = text || msg;
        }
        setCvError(msg);
      } else {
        let successMessage = 'CV uploaded successfully.';
        try {
          const text = await res.text();
          if (text) {
            const responseData = JSON.parse(text);
            successMessage = responseData.message || successMessage;
          }
        } catch (jsonParseError) {
          console.warn("Successful CV upload response but JSON parse failed:", jsonParseError);
        }
        setCvSuccess(successMessage);
        setForm(prev => ({ ...prev, cvFile: null })); // Clear selected file
        setCvFilePreviewName(''); // Clear CV preview name
        setCvFilePreviewUrl(''); // Clear CV preview URL
        // Refresh profile data to get the new CV path after a short delay
        setTimeout(async () => {
          await fetchUserProfile();
          setCvSuccess(''); // Clear success message after refresh
        }, 1500); // 1.5 seconds delay
      }
    } catch (err) {
      setCvError(err.message || 'Network error or unexpected response.');
    } finally {
      setLoadingCvUpload(false);
    }
  };

  const handleDeleteCV = async () => {
    setCvError(''); setCvSuccess(''); setLoadingCvDelete(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/delete-cv', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        let msg = "An unexpected error occurred during CV deletion.";
        try {
          const json = await res.json();
          msg = json.message || Object.values(json.errors || {}).flat().join(' ') || msg;
        } catch {
          const text = await res.text();
          msg = text || msg;
        }
        setCvError(msg);
      } else {
        let successMessage = 'CV deleted successfully.';
        try {
          const text = await res.text();
          if (text) {
            const responseData = JSON.parse(text);
            successMessage = responseData.message || successMessage;
          }
        } catch (jsonParseError) {
          console.warn("Successful CV delete response but JSON parse failed:", jsonParseError);
        }
        setCvSuccess(successMessage);
        // Refresh profile data to update the CV path after a short delay
        setTimeout(async () => {
          await fetchUserProfile();
          setCvSuccess(''); // Clear success message after refresh
        }, 1500); // 1.5 seconds delay
      }
    } catch (err) {
      setCvError('Network error or unexpected response.');
    } finally {
      setLoadingCvDelete(false);
    }
  };

  const handlePreviewCV = () => {
    if (cvFilePreviewUrl) {
      window.open(cvFilePreviewUrl, '_blank');
    } else if (currentCvPath) {
      window.open(currentCvPath, '_blank');
    }
  };


  const handleDownloadCV = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/download-cv', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to download CV.');
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "cv.pdf";

      // استخراج اسم الملف من Content-Disposition
      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition.split("filename=")[1].replace(/"/g, '');
      }

      // تحميل الملف
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("CV Download Error:", error);
      alert("❌ Failed to download CV.");
    }
  };

  const handleDownloadImage = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/download-profileImage', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("❌ Failed to download profile image.");

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "profile-image.png";

      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition.split("filename=")[1].replace(/"/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image Download Error:", error);
      alert("❌ Failed to download profile image.");
    }
  };

  const handleDeleteImage = async () => {
    setImageError('');
    setImageSuccess('');
    setLoadingImageDelete(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://amjad-hamidi-tms.runasp.net/api/Profiles/delete-profieImage', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "❌ Failed to delete profile image.");
      }

      setImageSuccess("🗑️ Profile image deleted successfully.");
      // Refresh profile data to update the image URL after a short delay
      setTimeout(async () => {
        await fetchUserProfile();
        setImageSuccess(''); // Clear success message after refresh
      }, 1500); // 1.5 seconds delay
    } catch (err) {
      setImageError(err.message);
    } finally {
      setLoadingImageDelete(false);
    }
  };



  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminPanelSettingsIcon />;
      case 'Supervisor':
        return <SupervisorAccountIcon />;
      case 'Trainee':
        return <SchoolIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const handleOpenImageDialog = () => {
    if (currentProfileImageUrl || profileImagePreviewUrl) {
      setOpenImageDialog(true);
    }
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      background: 'linear-gradient(to right bottom, #ece9e6, #ffffff)',
    }}>
      <Card sx={{
        maxWidth: 900,
        width: '100%',
        borderRadius: 4,
        boxShadow: 6,
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 4,
      }}>
        <Grid item xs={12} sm={4} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}>
          <Box
            component="img"
            src={TMSLogo}
            alt="TMS Logo"
            sx={{
              width: '80%',
              height: 'auto',
              maxWidth: 250,
              mb: 3,
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.1))',
            }}
          />
          <Avatar
            alt="Profile Image"
            src={profileImagePreviewUrl || currentProfileImageUrl || ''}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              boxShadow: 2,
              border: '2px solid',
              borderColor: 'primary.main',
              cursor: (currentProfileImageUrl || profileImagePreviewUrl) ? 'pointer' : 'default',
            }}
            onClick={handleOpenImageDialog}
          />
          <Typography variant="h6" align="center" color="text.secondary">
            Your Profile
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8} sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>Edit Profile</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    name="role"
                    value={form.role}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">{getRoleIcon(form.role)}</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiInputBase-input.Mui-readOnly': {
                        color: 'text.secondary',
                      },
                      '& .MuiInputBase-root': {
                        backgroundColor: '#f5f5f5',
                        pointerEvents: 'none',
                        opacity: 0.8,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'text.secondary',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="User Name"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={form.gender}
                      label="Gender"
                      onChange={handleChange}
                      startAdornment={<InputAdornment position="start"><WcIcon /></InputAdornment>}
                    >
                      {GENDER_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Birth Date"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} width={'40%'}>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, fontSize: '0.95rem', width: '100%' }}
                    >
                      Upload Profile Image
                      <input type="file" name="profileImageFile" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                    {(form.profileImageFile || profileImagePreviewUrl) && (
                      <Typography variant="body2" color="text.secondary">
                        Selected: {form.profileImageFile ? form.profileImageFile.name : "New image selected"}
                      </Typography>
                    )}

                    {/* Image Action Buttons */}
                    {(currentProfileImageUrl || profileImagePreviewUrl) && (
                      <Button
                        variant="contained"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={handleOpenImageDialog}
                        fullWidth
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Preview Image
                      </Button>
                    )}

                    {currentProfileImageUrl && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ImageIcon />}
                        onClick={handleDownloadImage}
                        fullWidth
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Download Current Image
                      </Button>
                    )}

                    {currentProfileImageUrl && (
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteImage}
                        disabled={loadingImageDelete}
                        fullWidth
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        {loadingImageDelete ? <CircularProgress size={24} /> : 'Delete Image'}
                      </Button>
                    )}

                    {/* Image Action Messages */}
                    {imageError && <Alert severity="error">{imageError}</Alert>}
                    {imageSuccess && <Alert severity="success">{imageSuccess}</Alert>}
                    {(!currentProfileImageUrl && !profileImagePreviewUrl && !imageSuccess && !imageError) && (
                      <Typography variant="body2" color="text.secondary">No profile image uploaded.</Typography>
                    )}
                  </Box>
                </Grid>

                {(form.role === 'Trainee' || form.role === 'Supervisor') && (
                  <Grid item xs={12} width={'40%'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

                      {/* زر اختيار ملف */}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<DescriptionIcon />}
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, fontSize: '0.95rem', width: '100%' }}
                      >
                        Upload CV
                        <input
                          type="file"
                          name="cvFile"
                          accept=".pdf,.doc,.docx"
                          hidden
                          onChange={handleFileChange}
                        />
                      </Button>

                      {/* اسم الملف المحدد إن وجد */}
                      {cvFilePreviewName && (
                        <Typography variant="body2" color="text.secondary">
                          Selected: {cvFilePreviewName}
                        </Typography>
                      )}

                      {/* أزرار العمليات */}
                      {(currentCvPath || cvFilePreviewUrl) && (
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<VisibilityIcon />}
                          onClick={handlePreviewCV}
                          fullWidth
                          sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                          Preview CV
                        </Button>
                      )}

                      {currentCvPath && (
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DescriptionIcon />}
                          onClick={handleDownloadCV}
                          fullWidth
                          sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                          Download Current CV
                        </Button>
                      )}

                      {currentCvPath && (
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<DeleteIcon />}
                          onClick={handleDeleteCV}
                          disabled={loadingCvDelete}
                          fullWidth
                          sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                          {loadingCvDelete ? <CircularProgress size={24} /> : 'DELETE CV'}
                        </Button>
                      )}

                      {/* زر رفع الملف المحدد */}
                      {form.cvFile && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUploadCV}
                          disabled={loadingCvUpload}
                          fullWidth
                          sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                          {loadingCvUpload ? <CircularProgress size={24} /> : 'Upload Selected CV'}
                        </Button>
                      )}

                      {/* رسائل */}
                      {cvError && <Alert severity="error">{cvError}</Alert>}
                      {cvSuccess && <Alert severity="success">{cvSuccess}</Alert>}
                      {(!currentCvPath && !cvFilePreviewName && !cvSuccess && !cvError) && (
                        <Typography variant="body2" color="text.secondary">No CV uploaded.</Typography>
                      )}
                    </Box>
                  </Grid>
                )}


                <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loadingUpdate}
                    sx={{ flex: 1, height: 50, fontSize: '1.1rem', fontWeight: 700, borderRadius: 3 }}
                  >
                    {loadingUpdate ? <CircularProgress size={24} color="inherit" /> : 'Update Info'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    sx={{ flex: 1, height: 50, fontSize: '1.1rem', fontWeight: 700, borderRadius: 3 }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Grid>
      </Card>

      {/* Image Full-Screen Dialog */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Profile Image
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
              width: 'fit-content',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
          <img
            src={profileImagePreviewUrl || currentProfileImageUrl || ''}
            alt="Full size profile"
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}