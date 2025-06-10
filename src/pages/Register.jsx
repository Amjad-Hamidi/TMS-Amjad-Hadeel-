import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useTheme,
    useMediaQuery,
    Alert,
    Snackbar,
    CssBaseline,
    AppBar,
    Toolbar,
    CardMedia,
    Modal,
} from '@mui/material';
import {
    Visibility, VisibilityOff, Google,
    Brightness7 as Brightness7Icon,
    Brightness2 as Brightness2Icon,
    PersonAdd as PersonAddIcon,
    Login as LoginIcon,
    Email as EmailIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Close as CloseIcon, // هذا الـ X
    Description as DescriptionIcon,
} from '@mui/icons-material';
// Navigation Icons (from GuestPage for consistency)
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArticleIcon from "@mui/icons-material/Article";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import logo from '../images/TMS Logo.png'; // هذا هو شعار TMS
import qrImage from "../images/QR Code-TMS.png";

const RegisterForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [darkMode, setDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthDate: '',
        profileImageFile: null,
        role: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isQRModalOpen, setQRModalOpen] = useState(false);
    // حالة جديدة للـ Modal الخاص بشعار TMS
    const [isLogoModalOpen, setLogoModalOpen] = useState(false);

    const navItems = [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Features", icon: <ExtensionIcon />, path: "/#features" },
        { label: "Blog", icon: <ArticleIcon />, path: "/#blog" },
        { label: "Contact", icon: <ContactMailIcon />, path: "/#contact" }
    ];

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "#121212" : "#fafafa";
        document.body.style.color = darkMode ? "#eee" : "#212121";
    }, [darkMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profileImageFile: e.target.files && e.target.files.length > 0 ? e.target.files.item(0) : null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                data.append(key.charAt(0).toUpperCase() + key.slice(1), value);
            }
        });

        if (formData.profileImageFile) {
            data.append('ProfileImageFile', formData.profileImageFile);
        }

        try {
            const response = await fetch('https://amjad-hamidi-tms.runasp.net/api/Account/Register', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage('Registered Successfully, please confirm your email on Gmail');
                setShowSnackbar(true);
                setErrors({});
                setTimeout(() => navigate('/login'), 3000);
            } else {
                if (result.errors) {
                    const fieldErrors = {};
                    for (const key in result.errors) {
                        fieldErrors[(key || '').toLowerCase()] = result.errors[(key || '')].join(', ');
                    }
                    setErrors(fieldErrors);
                } else {
                    setErrors({ general: result.message || 'Registration failed.' });
                }
            }
        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        }
    };

    const handleGoogleLogin = () => {
        alert('Google login not implemented.');
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: darkMode ? "#121212" : "#fafafa",
            color: darkMode ? "#eee" : "#212121",
            transition: 'background-color 0.3s, color 0.3s',
        }}>
            <CssBaseline />
            {/* ===== Navbar ===== */}
            <AppBar position="sticky" sx={{
                bgcolor: darkMode ? "#1a1a1a" : "#fff",
                color: darkMode ? "#eee" : "#000",
                boxShadow: darkMode ? "0 2px 4px rgba(255,255,255,0.05)" : "0 2px 4px rgba(0,0,0,0.1)",
                transition: "0.3s",
                marginBottom: 0,
            }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box>
                        {navItems.map(({ label, icon, path }) => (
                            <Button
                                key={label}
                                href={path}
                                startIcon={icon}
                                sx={{
                                    mx: 0.5,
                                    color: darkMode ? "#e0e0e0" : "#212121",
                                    "&:hover": {
                                        bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0",
                                        color: darkMode ? "#90caf9" : "#1976d2"
                                    },
                                    transition: "0.3s"
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                      <Button
                        startIcon={<DescriptionIcon />}
                        href="https://tugesucj.manus.space/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          mx: 0.5,
                          color: darkMode ? "#80cbc4" : "#00838f",
                          "&:hover": {
                            bgcolor: darkMode ? "#2e2e2e" : "#e0f2f7",
                            color: darkMode ? "#a7ffeb" : "#00bfa5",
                          },
                          transition: "0.3s",
                        }}
                      >
                        Build CV
                      </Button>                     

                        <Button startIcon={<PersonAddIcon />} href="/register" sx={{
                            mx: 0.5,
                            color: darkMode ? "#a5d6a7" : "#388e3c",
                            "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#e8f5e9" }
                        }}>Register</Button>
                        <Button startIcon={<LoginIcon />} href="/login" sx={{
                            mx: 0.5,
                            color: darkMode ? "#ffab91" : "#d84315",
                            "&:hover": { bgcolor: darkMode ? "#2e2e2e" : "#ffebee" }
                        }}>Login</Button>
                        <IconButton onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Brightness7Icon sx={{ color: "#ffd54f" }} /> : <Brightness2Icon sx={{ color: "#1976d2" }} />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content Grid for Registration Form */}
            <Grid container sx={{ flexGrow: 1 }}>
                {/* Illustration/Logo Side */}
                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 60%, ${theme.palette.secondary.light} 100%)`,
                    borderRadius: isMobile ? 0 : '0 40px 40px 0',
                    p: 4,
                    ...(darkMode && {
                        background: `linear-gradient(135deg, #333 60%, #555 100%)`,
                    })
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        {/* جعل الصورة قابلة للنقر لفتح الـ Modal */}
                        <img
                            src={logo}
                            alt="TMS Logo"
                            style={{
                                width: isMobile ? 120 : 200,
                                borderRadius: '30%',
                                marginBottom: 24,
                                boxShadow: theme.shadows[4],
                                cursor: 'pointer', // لإظهار مؤشر اليد عند المرور فوق الصورة
                                transition: 'transform 0.3s ease-in-out',
                            }}
                            onClick={() => setLogoModalOpen(true)} // فتح الـ Modal الجديد
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight={700} color={darkMode ? "white" : "primary"} sx={{ mb: 2 }}>
                            Welcome to TMS
                        </Typography>
                        <Typography variant="h6" color={darkMode ? "lightgray" : "text.secondary"} sx={{ maxWidth: 350, mx: 'auto' }}>
                            Register to join our professional training management system.
                        </Typography>
                    </Box>
                </Grid>
                {/* Form Side */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                    <Paper elevation={isMobile ? 0 : 6} sx={{
                        width: '100%',
                        maxWidth: 700, // Increased maxWidth
                        p: { xs: 2, md: 6 },
                        borderRadius: 4,
                        boxShadow: isMobile ? 'none' : undefined,
                        mx: 'auto',
                        bgcolor: darkMode ? "#1a1a1a" : "#fff",
                        color: darkMode ? "#eee" : "#212121",
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar src={logo} alt="TMS Logo" sx={{ width: 48, height: 48, mr: 1 }} />
                            <Typography variant="h4" fontWeight={700} color={darkMode ? "white" : "primary"}>Register</Typography>
                        </Box>
                        {errors.general && (
                            <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* First Name and Last Name in one row */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.firstname}
                                        helperText={errors.firstname}
                                        autoComplete="given-name"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff', // Darker background for input fields
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.lastname}
                                        helperText={errors.lastname}
                                        autoComplete="family-name"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                {/* Username and Phone in one row on wider screens */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Username"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.username}
                                        helperText={errors.username}
                                        autoComplete="username"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        autoComplete="tel"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                {/* Email and Password in one row on wider screens */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        autoComplete="email"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        autoComplete="new-password"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                // Ensure background color is applied to the input field itself
                                                '& .MuiOutlinedInput-input': {
                                                    backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                                    color: darkMode ? '#eee' : 'inherit',
                                                },
                                                // Style for the entire outlined input root
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: darkMode ? '#2d2d2d' : '#fff', // Apply directly here
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                },
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" aria-label="toggle password visibility"
                                                        sx={{ color: darkMode ? '#999' : 'rgba(0, 0, 0, 0.54)' }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            // Ensure overall TextField component respects the dark mode background
                                            '& .MuiInputBase-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                {/* Confirm Password and Gender in one row on wider screens */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.confirmpassword}
                                        helperText={errors.confirmpassword}
                                        autoComplete="new-password"
                                        InputLabelProps={{ style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                // Ensure background color is applied to the input field itself
                                                '& .MuiOutlinedInput-input': {
                                                    backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                                    color: darkMode ? '#eee' : 'inherit',
                                                },
                                                // Style for the entire outlined input root
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: darkMode ? '#2d2d2d' : '#fff', // Apply directly here
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                },
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword((show) => !show)} edge="end" aria-label="toggle confirm password visibility" sx={{ color: darkMode ? '#999' : 'rgba(0, 0, 0, 0.54)' }}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            // Ensure overall TextField component respects the dark mode background
                                            '& .MuiInputBase-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required error={!!errors.gender} sx={{
                                        minWidth: 180,
                                        '& .MuiInputLabel-root': { color: darkMode ? '#bbb' : 'inherit' },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: darkMode ? '#2d2d2d' : '#fff', // Darker background for select field
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                            '&:hover fieldset': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                        },
                                        '& .MuiSelect-select': { color: darkMode ? '#eee' : 'inherit' }, // Selected value color
                                        '& .MuiSvgIcon-root': { color: darkMode ? '#999' : 'rgba(0, 0, 0, 0.54)' }, // Dropdown arrow color
                                    }}>
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            label="Gender"
                                            onChange={handleInputChange}
                                            MenuProps={{
                                                // Styling for the dropdown menu
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: darkMode ? '#3a3a3a' : '#fff', // Menu background
                                                        border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="" sx={{ color: darkMode ? '#eee' : 'inherit' }}>Select Gender</MenuItem>
                                            <MenuItem value="Male" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Male</MenuItem>
                                            <MenuItem value="Female" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Female</MenuItem>
                                        </Select>
                                        {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                {/* Birth Date and Role in one row on wider screens */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Birth Date"
                                        name="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.birthdate}
                                        helperText={errors.birthdate}
                                        InputLabelProps={{ shrink: true, style: { color: darkMode ? '#bbb' : 'inherit' } }}
                                        InputProps={{
                                            style: { color: darkMode ? '#eee' : 'inherit' },
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{
                                        minWidth: 180,
                                        '& .MuiInputLabel-root': { color: darkMode ? '#bbb' : 'inherit' },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)' },
                                            '&:hover fieldset': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: darkMode ? theme.palette.primary.light : theme.palette.primary.main },
                                        },
                                        '& .MuiSelect-select': { color: darkMode ? '#eee' : 'inherit' },
                                        '& .MuiSvgIcon-root': { color: darkMode ? '#999' : 'rgba(0, 0, 0, 0.54)' },
                                    }} required error={!!errors.role}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            name="role"
                                            value={formData.role}
                                            label="Role"
                                            onChange={handleInputChange}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: darkMode ? '#3a3a3a' : '#fff',
                                                        border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Select Role</MenuItem>
                                            <MenuItem value="Trainee" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Trainee</MenuItem>
                                            <MenuItem value="Supervisor" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Supervisor</MenuItem>
                                            <MenuItem value="Company" sx={{ color: darkMode ? '#eee' : 'inherit', '&:hover': { bgcolor: darkMode ? '#4a4a4a' : '#f0f0f0' } }}>Company</MenuItem>
                                        </Select>
                                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                {/* Profile Image */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel shrink style={{ color: darkMode ? '#bbb' : 'inherit' }}>Profile Image</InputLabel>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mt: 1,
                                            justifyContent: 'center',
                                            p: 1,
                                            border: `1px solid ${darkMode ? '#555' : '#e0e0e0'}`,
                                            borderRadius: 2,
                                            backgroundColor: darkMode ? '#2d2d2d' : '#fafafa', // Darker background for file input area
                                            minHeight: '56px'
                                        }}>
                                            <Button variant="outlined" component="label" sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                color: darkMode ? theme.palette.info.light : theme.palette.primary.main,
                                                borderColor: darkMode ? theme.palette.info.light : theme.palette.primary.main,
                                                '&:hover': {
                                                    borderColor: darkMode ? theme.palette.info.light : theme.palette.primary.dark,
                                                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25,118,210,0.04)'
                                                }
                                            }}
                                            >
                                                Upload Profile Image
                                                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                                            </Button>
                                            <Box sx={{ flex: 1, ml: 2 }}>
                                                {formData.profileImageFile ?
                                                    (
                                                        <Typography variant="body2" color={darkMode ? '#eee' : 'text.secondary'} sx={{ fontStyle: 'italic' }}>
                                                            {formData.profileImageFile.name}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" color={darkMode ? '#aaa' : 'text.disabled'} sx={{ fontStyle: 'italic' }}>
                                                            No file selected
                                                        </Typography>
                                                    )}
                                            </Box>
                                        </Box>
                                    </FormControl>
                                </Grid>
                                {/* Register Button */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mt: 3,
                                            mb: 1,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            bgcolor: darkMode ? theme.palette.primary.dark : theme.palette.primary.main,
                                            '&:hover': { bgcolor: darkMode ? theme.palette.primary.main : theme.palette.primary.dark }
                                        }}
                                    >
                                        Register
                                    </Button>
                                </Grid>
                                {/* Sign up with Google Button */}
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        fullWidth
                                        startIcon={<Google />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            mb: 2,
                                            borderColor: darkMode ? '#555' : 'rgba(0, 0, 0, 0.23)',
                                            color: darkMode ? '#eee' : 'inherit',
                                            '&:hover': {
                                                borderColor: darkMode ? '#777' : 'inherit',
                                                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                        onClick={handleGoogleLogin}
                                    >
                                        Sign up with Google
                                    </Button>
                                </Grid>
                                {/* Already have an account? Login link */}
                                <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
                                    <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : 'inherit' }}>
                                        Already have an account?{" "}
                                        <Box component="span" onClick={() => navigate('/login')} sx={{
                                            color: darkMode ? "#90caf9" : "#1976d2",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            "&:hover": { textDecoration: "underline" }
                                        }}>
                                            Login here
                                        </Box>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal for TMS Logo (new) */}
            <Modal
                open={isLogoModalOpen}
                onClose={() => setLogoModalOpen(false)}
                aria-labelledby="tms-logo-modal-title"
                aria-describedby="tms-logo-modal-description"
                closeAfterTransition
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'backdropFilter 0.3s ease-in-out',
                }}
            >
                <Box sx={{
                    position: 'relative',
                    p: 4,
                    bgcolor: darkMode ? '#1a1a1a' : 'background.paper',
                    boxShadow: 24,
                    borderRadius: 4,
                    textAlign: 'center',
                    maxWidth: { xs: '90%', sm: '70%', md: '50%' },
                    maxHeight: '90%',
                    outline: 'none',
                    animation: 'fadeIn 0.5s ease-out',
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setLogoModalOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: darkMode ? '#bbb' : 'rgba(0, 0, 0, 0.54)',
                            transition: 'color 0.3s ease-in-out',
                            '&:hover': {
                                color: darkMode ? theme.palette.error.light : theme.palette.error.main,
                                transform: 'rotate(90deg)',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img src={logo} alt="TMS Logo" style={{ maxWidth: '80%', height: 'auto', marginBottom: 20 }} />
                    <Typography id="tms-logo-modal-title" variant="h6" component="h2" gutterBottom sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                        Training Management System (TMS)
                    </Typography>
                    <Typography id="tms-logo-modal-description" sx={{ color: darkMode ? 'lightgray' : 'text.secondary' }}>
                        TMS is a comprehensive platform designed to streamline the management of training programs, connecting trainees, supervisors, and companies.
                    </Typography>
                </Box>
            </Modal>

            {/* Snackbar for Success Message */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* ===== Footer (Contact + Share + Signature) ===== */}
            <Box id="contact" component="footer" sx={{
                py: 3,
                textAlign: "center",
                background: darkMode ? "linear-gradient(135deg, #1c1c1c, #3a3a3a)" : "linear-gradient(135deg, #a7d9ff, #c6e7ff)",
                color: darkMode ? "#fff" : "#333",
                mt: 'auto',
                position: "relative", overflow: "hidden"
            }}>
                <Box sx={{
                    position: "absolute", top: -60, right: -60,
                    width: 220, height: 220,
                    bgcolor: darkMode ? "#444" : "#e0f2f7",
                    borderRadius: "50%",
                    animation: "pulseCircle 4s infinite ease-in-out"
                }} />
                <Typography variant="h5" gutterBottom>📬 Stay Connected</Typography>
                <Typography variant="body1">Got questions? Reach out anytime!</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, fontSize: 30, mb: 2 }}>
                    <IconButton href="mailto:tms.contactus1@gmail.com" sx={{ color: darkMode ? "#fff" : "#1976d2", animation: "iconPulse 2s infinite .1s" }}><EmailIcon /></IconButton>
                    <IconButton href="https://www.linkedin.com/in/amjad-hamidi/" target="_blank" sx={{ color: darkMode ? "#fff" : "#1976d2", animation: "iconPulse 2s infinite .5s" }}><LinkedInIcon /></IconButton>
                    <IconButton href="https://www.instagram.com/amjada871/" target="_blank" sx={{ color: darkMode ? "#fff" : "#1976d2", animation: "iconPulse 2s infinite .7s" }}><InstagramIcon /></IconButton>
                    <IconButton href="https://www.facebook.com/AmjadHamidi01/" target="_blank" sx={{ color: darkMode ? "#fff" : "#1976d2", animation: "iconPulse 2s infinite .9s" }}><FacebookIcon /></IconButton>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: "Check out TMS!",
                                    text: "Explore the Training Management System (TMS) – where tech talents are born!",
                                    url: window.location.href
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied! Share it anywhere you like.");
                            }
                        }}
                        sx={{
                            color: darkMode ? "#fff" : "#1976d2",
                            borderColor: darkMode ? "#fff" : "#1976d2",
                            "&:hover": { backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(25,118,210,0.1)" },
                            transition: "0.3s"
                        }}
                    >
                        Share Website
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setShowQR(q => !q)}
                        sx={{
                            color: darkMode ? "#fff" : "#1976d2",
                            borderColor: darkMode ? "#fff" : "#1976d2",
                            "&:hover": { backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(25,118,210,0.1)" },
                            transition: "0.3s"
                        }}
                    >
                        {showQR ? "Hide QR" : "Show QR"}
                    </Button>
                </Box>
                {showQR && (
                    <Box sx={{ mt: 2, animation: "fadeIn 0.6s ease-in" }}>
                        <CardMedia component="img" src={qrImage} alt="QR Code" sx={{
                            width: 120, height: 120, mb: 2, mx: "auto", cursor: "pointer", borderRadius: 2,
                            boxShadow: darkMode ? "0 0 12px rgba(144,202,249,0.4)" : "0 0 10px rgba(0,0,0,0.2)",
                            "&:hover": {
                                transform: "scale(1.1)",
                                boxShadow: darkMode ? "0 0 25px rgba(144,202,249,0.6)" : "0 0 20px rgba(0,0,0,0.3)"
                            },
                            transition: "transform 0.3s ease, box-shadow 0.3s ease"
                        }} onClick={() => setQRModalOpen(true)} />
                    </Box>
                )}
                {/* Modal for QR Code (existing) */}
                {isQRModalOpen && (
                    <Box sx={{
                        position: "fixed", inset: 0, zIndex: 3000,
                        backgroundColor: "rgba(0,0,0,0.85)",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        animation: "fadeIn 0.5s ease-in",
                        backdropFilter: 'blur(5px)',
                    }} onClick={() => setQRModalOpen(false)}>
                        <Box onClick={e => e.stopPropagation()} sx={{
                            position: "relative", maxWidth: "90%", maxHeight: "90%",
                            outline: 'none',
                        }}>
                            <IconButton onClick={() => setQRModalOpen(false)} sx={{
                                position: "absolute", top: -20, right: -20,
                                bgcolor: darkMode ? "#333" : "#fff",
                                color: darkMode ? "#f48fb1" : "#d32f2f",
                                "&:hover": {
                                    bgcolor: darkMode ? "#f06292" : "#f44336",
                                    transform: "rotate(45deg) scale(1.2)"
                                },
                                boxShadow: darkMode ? "0 0 12px rgba(255,105,135,0.5)" : "0 0 8px rgba(244,67,54,0.3)",
                                transition: "all 0.3s ease"
                            }}><CloseIcon /></IconButton>
                            <CardMedia component="img" src={qrImage} alt="Full QR" sx={{
                                borderRadius: 3,
                                maxWidth: "100%",
                                maxHeight: "80vh",
                                boxShadow: darkMode ? "0 0 25px rgba(144,202,249,0.6)" : "0 0 25px rgba(0,0,0,0.2)",
                                animation: "zoomIn 0.4s ease-out"
                            }} />
                        </Box>
                    </Box>
                )}

                {/* ===== Footer Signature ===== */}
                <Box sx={{ mt: 4, textAlign: "center", animation: "fadeIn 1s ease-in" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            color: darkMode ? "#90caf9" : "#333",
                            fontWeight: 500
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover .signature-text": {
                                textDecoration: "underline",
                                color: darkMode ? "#bbdefb" : "#42a5f5",
                                transition: "0.3s ease"
                            }
                        }}>
                            <Box component="span" sx={{
                                fontStyle: "italic",
                                color: darkMode ? "#f48fb1" : "#d84315"
                            }}>
                                Made with
                                <span style={{
                                    display: "inline-block",
                                    margin: "0 5px",
                                    animation: "beatHeart 1.5s infinite"
                                }}>❤️</span> by
                            </Box>

                            <Box component="a"
                                href="https://github.com/Amjad-Hamidi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="signature-text"
                                sx={{
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                    fontSize: "1rem",
                                    color: darkMode ? "#90caf9" : "#1976d2",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                <Box component="img"
                                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                    alt="GitHub"
                                    sx={{
                                        width: 22, height: 22,
                                        opacity: 0.9,
                                        transition: "transform 0.4s ease",
                                        "&:hover": {
                                            transform: "rotate(15deg) scale(1.2)",
                                            opacity: 1
                                        }
                                    }}
                                />
                                Amjad Hamidi
                            </Box>

                            <svg width="50" height="25" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
                                <path d="M0 20 C20 0, 30 30, 50 20 S80 0, 100 20" stroke={darkMode ? "#90caf9" : "#1976d2"} strokeWidth="1.2" fill="transparent" />
                            </svg>
                        </Box>
                    </Typography>


                    <Typography variant="caption" sx={{
                        display: "block", mt: 1,
                        color: darkMode ? "#cccccc" : "#616161"
                    }}>
                        © 2025 | All Rights Reserved.
                    </Typography>
                    <style>{`
                        @keyframes beatHeart {
                            0%,100%{transform:scale(1);}
                            50%{transform:scale(1.3);}
                        }
                    `}</style>
                </Box>

            </Box>

            {/* ===== Global Animations (Moved here for accessibility) ===== */}
            <style>{`
                @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.07);} }
                @keyframes fadeSection {0%{opacity:0;}100%{opacity:1;} }
                @keyframes pulseCircle {0%,100%{transform:scale(1);opacity:0.6;}50%{transform:scale(1.3);opacity:0.3;} }
                @keyframes iconPulse {0%,100%{transform:scale(1);}50%{transform:scale(1.3);} }
                @keyframes fadeIn {from{opacity:0;transform:scale(0.95);} to{opacity:1;transform:scale(1);}}
                @keyframes zoomIn {from{transform:scale(0.7);opacity:0;} to{transform:1;opacity:1;}}
            `}</style>
        </Box>
    );
};

export default RegisterForm;