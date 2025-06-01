import React, { useState } from 'react';
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
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import logo from '../images/TMS Logo.png'; // Place the provided image as logo.png in src/

const illustrationUrl = logo; // Use the same image for illustration

const RegisterForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      profileImageFile: e.target.files[0],
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

    try {
      const response = await fetch('http://amjad-hamidi-tms.runasp.net/api/Account/Register', {
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
            fieldErrors[key.toLowerCase()] = result.errors[key].join(', ');
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
    // Placeholder for Google login logic
    alert('Google login not implemented.');
  };

  return (
    <Grid container sx={{ minHeight: '100vh', background: theme.palette.background.default, transition: 'background 0.3s' }}>
      {/* Illustration/Logo Side */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 60%, ${theme.palette.secondary.light} 100%)`,
        borderRadius: isMobile ? 0 : '0 40px 40px 0',
        p: 4,
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={illustrationUrl} alt="TMS Logo" style={{ width: isMobile ? 120 : 200, borderRadius: '30%', marginBottom: 24, boxShadow: theme.shadows[4] }} />
          <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight={700} color="primary" sx={{ mb: 2 }}>
            Welcome to TMS
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 350, mx: 'auto' }}>
            Register to join our professional training management system.
          </Typography>
        </Box>
      </Grid>
      {/* Form Side */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={isMobile ? 0 : 6} sx={{ width: '100%', maxWidth: 520, p: { xs: 2, md: 6 }, borderRadius: 4, boxShadow: isMobile ? 'none' : undefined, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar src={logo} alt="TMS Logo" sx={{ width: 48, height: 48, mr: 1 }} />
            <Typography variant="h4" fontWeight={700} color="primary">Register</Typography>
          </Box>
        {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} fullWidth required error={!!errors.firstname} helperText={errors.firstname} autoComplete="given-name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} fullWidth required error={!!errors.lastname} helperText={errors.lastname} autoComplete="family-name" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Username" name="userName" value={formData.userName} onChange={handleInputChange} fullWidth required error={!!errors.username} helperText={errors.username} autoComplete="username" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth required error={!!errors.phone} helperText={errors.phone} autoComplete="tel" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth required error={!!errors.email} helperText={errors.email} autoComplete="email" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} fullWidth required error={!!errors.password} helperText={errors.password} autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((show) => !show)} edge="end" aria-label="toggle password visibility">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} fullWidth required error={!!errors.confirmpassword} helperText={errors.confirmpassword} autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword((show) => !show)} edge="end" aria-label="toggle confirm password visibility">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.gender} sx={{ minWidth: 180 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={formData.gender} label="Gender" onChange={handleInputChange}>
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Birth Date" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} fullWidth required error={!!errors.birthdate} helperText={errors.birthdate} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: 180 }} required error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select name="role" value={formData.role} label="Role" onChange={handleInputChange}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="Trainee">Trainee</MenuItem>
                    <MenuItem value="Supervisor">Supervisor</MenuItem>
                    <MenuItem value="Company">Company</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink>Profile Image</InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, justifyContent: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor:'#fafafa', minHeight: '56px' }}>
                    <Button variant="outlined" component="label" sx={{ textTransform: 'none', borderRadius: 2 }}>
                      Upload Profile Image
                      <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                    <Box sx={{ flex: 1, ml: 2 }}>
                      {formData.profileImageFile ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {formData.profileImageFile.name}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                          No file selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1, mb: 1, borderRadius: 2, fontWeight: 600 }}>
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" color="inherit" fullWidth startIcon={<Google />} sx={{ textTransform: 'none', borderRadius: 2, mt: 2 }} onClick={handleGoogleLogin}>
                  Sign up with Google
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 0}}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Button variant="text" size="small" onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Login
                  </Button>
                </Typography>
              </Grid>       
            </Grid>
      </form>
        </Paper>
        {/* Success Snackbar */}
        <Snackbar
          open={showSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Registered Successfully, please confirm your email on Gmail
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default RegisterForm;