import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Link,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WcIcon from '@mui/icons-material/Wc';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const TraineeProfile = () => {
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainee = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/me");
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to fetch trainee profile. Status: ${response.status}`);
        }
        const data = JSON.parse(text);
        setTrainee({
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
    fetchTrainee();
  }, []);

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

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, position: 'relative', p: 2 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, position: 'relative' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={trainee.fullName}
              src={trainee.profileImageUrl || ''}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, boxShadow: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
              <BadgeIcon sx={{ mr: 1, fontSize: 18, color: 'primary.main' }} />
              {trainee.role}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {trainee.fullName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{trainee.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{trainee.phoneNumber}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentIndIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">ID: {trainee.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WcIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{trainee.gender === 0 ? 'Male' : trainee.gender === 1 ? 'Female' : '—'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>CV:</strong>{' '}
                {trainee.cvPath ? (
                  <Link href={trainee.cvPath} target="_blank" rel="noopener" underline="hover">
                    Download CV
                  </Link>
                ) : (
                  'No CV uploaded'
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3, textAlign: { xs: 'center', sm: 'left' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, minWidth: 180 }}
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </Button>
        </Grid>

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
    </Box>
  );
};

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
      const res = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/ChangeEmail", {
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
      <TextField label="New Email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Confirm Email" type="email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/ChangePassword", {
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
      <TextField label="Old Password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
      <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
        Change Password
      </Button>
    </Box>
  );
}

export default TraineeProfile;
