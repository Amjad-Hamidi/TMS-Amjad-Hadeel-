import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  TextField, // Import TextField
  InputAdornment, // Import InputAdornment for icons in TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WcIcon from '@mui/icons-material/Wc';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // Import VisibilityOffIcon
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/fetchWithAuth';

function ChangeEmailForm({ onSuccess }) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("https://amjad-hamidi-tms.runasp.net/api/Account/ChangeEmail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail, confirmEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Unknown error");
      } else {
        setSuccess(data.message || "Email changed successfully");
        setTimeout(() => { setSuccess(""); onSuccess && onSuccess(); }, 1200);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
      <TextField
        type="email"
        label="New Email"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
      />
      <TextField
        type="email"
        label="Confirm Email"
        value={confirmEmail}
        onChange={e => setConfirmEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2 }}>
        Change Email
      </Button>
    </Box>
  );
}

function ChangePasswordForm({ onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("https://amjad-hamidi-tms.runasp.net/api/Account/ChangePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Unknown error");
      } else {
        setSuccess(data.message || "Password changed successfully");
        setTimeout(() => { setSuccess(""); onSuccess && onSuccess(); }, 1200);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
      <TextField
        type={showOldPassword ? 'text' : 'password'}
        label="Old Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowOldPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        type={showNewPassword ? 'text' : 'password'}
        label="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowNewPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2 }}>
        Change Password
      </Button>
    </Box>
  );
}

const SupervisorProfile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisor = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchWithAuth("https://amjad-hamidi-tms.runasp.net/api/Profiles/me");
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to fetch supervisor profile. Status: ${response.status}`);
        }
        const data = JSON.parse(text);
        setSupervisor({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileImageUrl: data.profileImageUrl,
          role: data.role,
          gender: data.gender,
          birthDate: data.birthDate,
          cvPath: data.cvPath,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisor();
  }, []);

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
      console.error("CV Download Error:", error);
      setError("❌ Failed to download CV.");
    }
  };

  const handlePreviewCV = () => {
    if (supervisor && supervisor.cvPath) {
      window.open(supervisor.cvPath, '_blank');
    } else {
      setError("No CV available for preview.");
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

      if (!res.ok) {
        let errorMessage = "Failed to download profile image.";
        try {
          const errorText = await res.text();
          errorMessage = errorText || errorMessage;
        } catch (e) {
          // Ignore
        }
        throw new Error(errorMessage);
      }

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
      setError(`❌ ${error.message || "Failed to download profile image."}`);
    }
  };

  const handleOpenImageDialog = () => {
    if (supervisor && supervisor.profileImageUrl) {
      setOpenImageDialog(true);
    } else {
      setError("No profile image available for preview.");
    }
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
    );
  }

  // Common button styles for preview/download
  const commonButtonSx = {
    textTransform: 'none',
    px: 1.5, // horizontal padding
    py: 0.5, // vertical padding
    fontSize: '0.75rem', // font size
    minWidth: '75px', // Minimum width to unify
  };

  const commonIconSx = {
    fontSize: 16 // icon size
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, position: 'relative', p: 2 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, position: 'relative' }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={supervisor.fullName}
              src={supervisor.profileImageUrl || ''}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 1, boxShadow: 2, cursor: supervisor.profileImageUrl ? 'pointer' : 'default' }}
              onClick={handleOpenImageDialog}
            />
            {supervisor.profileImageUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenImageDialog}
                  startIcon={<VisibilityIcon sx={commonIconSx} />}
                  sx={commonButtonSx}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDownloadImage}
                  startIcon={<CloudDownloadIcon sx={commonIconSx} />}
                  sx={commonButtonSx}
                >
                  Download
                </Button>
              </Box>
            )}
            <Box sx={{ mb: 2 }}> {/* Box for Supervisor role */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                <BadgeIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                {supervisor.role}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {supervisor.fullName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <a href={`mailto:${supervisor.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body1" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  {supervisor.email}
                </Typography>
              </a>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <a href={`tel:${supervisor.phoneNumber}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body1" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  {supervisor.phoneNumber}
                </Typography>
              </a>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentIndIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">ID: {supervisor.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WcIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{supervisor.gender === 0 ? 'Male' : supervisor.gender === 1 ? 'Female' : '—'}</Typography>
            </Box>

            {/* CV Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                <strong>CV:</strong>
              </Typography>
              {supervisor.cvPath ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePreviewCV}
                    startIcon={<VisibilityIcon sx={commonIconSx} />}
                    sx={commonButtonSx}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDownloadCV}
                    startIcon={<CloudDownloadIcon sx={commonIconSx} />}
                    sx={commonButtonSx}
                  >
                    Download
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1" component="span">
                  No CV uploaded
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Edit Profile Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, minWidth: 180 }}
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </Button>
        </Box>


        {/* Change Email/Password Section */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Change Email</Typography>
              <ChangeEmailForm onSuccess={() => {
                localStorage.clear();
                navigate('/login');
              }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Change Password</Typography>
              <ChangePasswordForm onSuccess={() => {
                localStorage.clear();
                navigate('/login');
              }} />
            </Grid>
          </Grid>
        </Box>
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
            src={supervisor.profileImageUrl || ''}
            alt="Full size profile"
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SupervisorProfile;