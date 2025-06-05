import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, Button, Box, Select, MenuItem, InputLabel, FormControl, Alert, Avatar, CircularProgress, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // For Supervisor
import SchoolIcon from '@mui/icons-material/School'; // For Trainee
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // For Admin
import { decodeToken } from "react-jwt";
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
  const [currentCvPath, setCurrentCvPath] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCvUpload, setLoadingCvUpload] = useState(false);
  const [loadingCvDelete, setLoadingCvDelete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cvError, setCvError] = useState('');
  const [cvSuccess, setCvSuccess] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      setError('');
      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/form-edit-profile");
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
        setCurrentUserName(data.userName || '');
      } catch (err) {
        setError(err.message || "Error loading profile data.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
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

      const res = await fetch('http://amjad-hamidi-tms.runasp.net/api/Profiles/update-profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      // --- Start of modified success/error handling logic ---
      if (!res.ok) {
        let msg = "An unexpected error occurred."; // Default error message
        try {
          const json = await res.json(); // Try parsing as JSON first for structured errors
          msg = json.message || Object.values(json.errors || {}).flat().join(' ') || msg;
        } catch {
          // If it's not JSON, or JSON parsing fails, use the raw text response
          const text = await res.text();
          msg = text || msg; // Use raw text if available, otherwise default
        }
        setError(msg);
      } else {
        let successMessage = 'Profile updated successfully.';
        try {
          const text = await res.text(); // Get raw text response
          if (text) { // Check if text is not empty before parsing
             const updatedData = JSON.parse(text); // Try parsing if content exists
             successMessage = updatedData.message || successMessage; // Use backend message if provided
             setCurrentProfileImageUrl(updatedData.profileImageUrl || currentProfileImageUrl);
          }
        } catch (jsonParseError) {
          // If JSON parsing fails for a successful response (e.g., empty response or simple string)
          // The `successMessage` will remain the default 'Profile updated successfully.'
          console.warn("Successful response but JSON parse failed:", jsonParseError);
        }
        setSuccess(successMessage);
        // Only navigate on success
        setTimeout(() => navigate(-1), 1200);
      }
      // --- End of modified success/error handling logic ---

    } catch (err) {
      // This catch block will only be hit for true network errors
      // or issues before the fetch response is received.
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

      const res = await fetch('http://amjad-hamidi-tms.runasp.net/api/Profiles/upload-cv', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // --- Similar robust handling for CV upload ---
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
            // Assuming backend might return a path or message on success
            const responseData = JSON.parse(text);
            successMessage = responseData.message || successMessage;
            // Re-fetch profile data to get the updated cvPath
            const profileResponse = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/form-edit-profile");
            const profileData = await profileResponse.json();
            setCurrentCvPath(profileData.cvPath || '');
          }
        } catch (jsonParseError) {
          console.warn("Successful CV upload response but JSON parse failed:", jsonParseError);
        }
        setCvSuccess(successMessage);
        setForm(prev => ({ ...prev, cvFile: null })); // Clear selected file
      }
      // --- End of robust handling for CV upload ---

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
      const res = await fetch('http://amjad-hamidi-tms.runasp.net/api/Profiles/delete-cv', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // --- Similar robust handling for CV delete ---
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
            // Assuming backend might return a message on success
            const responseData = JSON.parse(text);
            successMessage = responseData.message || successMessage;
          }
        } catch (jsonParseError) {
          console.warn("Successful CV delete response but JSON parse failed:", jsonParseError);
        }
        setCvSuccess(successMessage);
        setCurrentCvPath(''); // Clear CV path in state
      }
      // --- End of robust handling for CV delete ---

    } catch (err) {
      setCvError('Network error or unexpected response.');
    } finally {
      setLoadingCvDelete(false);
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
            src={currentProfileImageUrl || ''}
            sx={{ width: 120, height: 120, mb: 2, boxShadow: 2, border: '2px solid', borderColor: 'primary.main' }}
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
                      <MenuItem value="">Select Gender</MenuItem>
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
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      sx={{ textTransform: 'none', borderRadius: 2, flexGrow: 1 }}
                    >
                      Upload Profile Image
                      <input type="file" name="profileImageFile" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                    {form.profileImageFile && (
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {form.profileImageFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {(form.role === 'Trainee' || form.role === 'Supervisor') && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<DescriptionIcon />}
                          sx={{ textTransform: 'none', borderRadius: 2, flexGrow: 1 }}
                        >
                          Upload CV
                          <input type="file" name="cvFile" accept=".pdf,.doc,.docx" hidden onChange={handleFileChange} />
                        </Button>
                        {form.cvFile && (
                          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                            {form.cvFile.name}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        {currentCvPath ? (
                          <>
                            <Button
                              variant="text"
                              color="primary"
                              href={currentCvPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<DescriptionIcon />}
                              sx={{ textTransform: 'none' }}
                            >
                              Download Current CV
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={handleDeleteCV}
                              disabled={loadingCvDelete}
                            >
                              {loadingCvDelete ? <CircularProgress size={24} /> : 'Delete CV'}
                            </Button>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">No CV uploaded.</Typography>
                        )}
                        {form.cvFile && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUploadCV}
                            disabled={loadingCvUpload}
                            sx={{ ml: 'auto' }}
                          >
                            {loadingCvUpload ? <CircularProgress size={24} /> : 'Upload Selected CV'}
                          </Button>
                        )}
                      </Box>
                      {cvError && <Alert severity="error" sx={{ mt: 1 }}>{cvError}</Alert>}
                      {cvSuccess && <Alert severity="success" sx={{ mt: 1 }}>{cvSuccess}</Alert>}
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
    </Box>
  );
}