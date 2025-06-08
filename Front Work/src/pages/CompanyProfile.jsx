import React, { useEffect, useState } from "react";
import "../styles/CompanyProfile.css"; // تأكد من وجود هذا الملف لتنسيقاتك المخصصة
import { fetchWithAuth } from '../utils/fetchWithAuth'; // تأكد من مسار هذا الملف
import {
    Card,
    Typography,
    Avatar,
    Grid,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogContent,
    IconButton,
    DialogTitle,
    TextField,
    InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WcIcon from '@mui/icons-material/Wc';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'; // أيقونة الصورة
import { useNavigate } from 'react-router-dom';

// Placeholder for ChangeEmailForm and ChangePasswordForm
function ChangeEmailForm() {
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        if (newEmail !== confirmEmail) {
            setError("New email and confirm email do not match.");
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetchWithAuth("https://amjad-hamidi-tms.runasp.net/api/Account/ChangeEmail", {
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
                setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Failed to change email");
            } else {
                setSuccess(data.message || "Email changed successfully. Please log in again.");
                setNewEmail(""); setConfirmEmail("");
                setTimeout(() => {
                    localStorage.clear();
                    navigate('/login');
                }, 1500);
            }
        } catch (err) {
            setError("Network error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
                fullWidth
                label="New Email"
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                margin="normal"
                variant="outlined"
            />
            <TextField
                fullWidth
                label="Confirm New Email"
                type="email"
                value={confirmEmail}
                onChange={e => setConfirmEmail(e.target.value)}
                required
                margin="normal"
                variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2, py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Email'}
            </Button>
        </Box>
    );
}

function ChangePasswordForm() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetchWithAuth("https://amjad-hamidi-tms.runasp.net/api/Account/ChangePassword", {
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
                setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Failed to change password");
            } else {
                setSuccess(data.message || "Password changed successfully. Please log in again.");
                setOldPassword(""); setNewPassword(""); setConfirmPassword("");
                setTimeout(() => {
                    localStorage.clear();
                    navigate('/login');
                }, 1500);
            }
        } catch (err) {
            setError("Network error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
                fullWidth
                label="Old Password"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
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
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2, py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
            </Button>
        </Box>
    );
}

export default function CompanyProfile() {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth("https://amjad-hamidi-tms.runasp.net/api/Profiles/me", {
                    headers: { Accept: "*/*" },
                });
                if (!response.ok) throw new Error("Failed to load profile.");
                const data = await response.json();
                setCompany(data);
            } catch (err) {
                setError(err.message || "Error loading profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyProfile();
    }, []);

    const handleDownloadImage = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetchWithAuth('https://amjad-hamidi-tms.runasp.net/api/Profiles/download-profileImage', {
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
                    // Ignore parsing error if response is not JSON
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
        if (company && company.profileImageUrl) {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 700 }}>{error}</Alert>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 2 }}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: { xs: 2, sm: 4 }, position: 'relative' }}>
                <Grid container spacing={4} alignItems="flex-start">
                    {/* Left Column: Avatar, Role, and Image Actions */}
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            alt={company.fullName}
                            src={company.profileImageUrl || ''}
                            sx={{
                                width: 100, // Reduced size as requested
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                boxShadow: 3,
                                cursor: company.profileImageUrl ? 'pointer' : 'default',
                                border: '3px solid',
                                borderColor: 'primary.light'
                            }}
                            onClick={handleOpenImageDialog}
                        />
                        {/* Role - Moved under avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <BadgeIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                            <Typography variant="body1">
                                {company.role}
                            </Typography>
                        </Box>

                        {/* Profile Image Actions - Moved under role */}
                        {company.profileImageUrl && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                    <ImageOutlinedIcon sx={{ mr: 0.5, fontSize: 18, color: 'primary.main' }} />
                                    Profile Image:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleOpenImageDialog}
                                        startIcon={<VisibilityIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            bgcolor: '#ffc107', // Gold/Yellow for preview
                                            color: '#000', // Black text for contrast
                                            '&:hover': { bgcolor: '#ffb300' },
                                            py: 0.8, px: 2,
                                            fontSize: '0.8rem',
                                            borderRadius: 2
                                        }}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleDownloadImage}
                                        startIcon={<CloudDownloadIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            bgcolor: '#f44336', // Red color for download
                                            '&:hover': { bgcolor: '#d32f2f' },
                                            py: 0.8, px: 2,
                                            fontSize: '0.8rem',
                                            borderRadius: 2
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Grid>

                    {/* Right Column: Company Details */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" fontWeight={700}>
                                {company.fullName}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                             <a href={`mailto:${company.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="body1" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                    {company.email}
                                </Typography>
                            </a>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body1">{company.phoneNumber}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AssignmentIndIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body1">ID: {company.id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <WcIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body1">{company.gender === 0 ? 'Male' : company.gender === 1 ? 'Female' : '—'}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                    {/* Edit Profile Button - Moved to be a full-width button at the end of the main profile info */}
                    <Grid item xs={12} sx={{ mt: 2 }}> {/* Adding some top margin */}
                        <Button
                            variant="contained"
                            sx={{
                                width: '100%', // Make it full width
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600,
                                boxShadow: 2,
                                textTransform: 'none',
                                bgcolor: '#007bff', // Bootstrap primary blue or similar
                                '&:hover': { bgcolor: '#0056b3' },
                            }}
                            startIcon={<EditIcon />}
                            onClick={() => navigate('/profile/edit')}
                        >
                            EDIT PROFILE
                        </Button>
                    </Grid>
                {/* Separator and Forms */}
                <Box sx={{ mt: 6 }}>
                    <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #eee' }} />
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Change Email</Typography>
                            <ChangeEmailForm />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Change Password</Typography>
                            <ChangePasswordForm />
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
                        src={company.profileImageUrl || ''}
                        alt="Full size profile"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}