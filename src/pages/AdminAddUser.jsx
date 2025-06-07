import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Ensure SweetAlert2 is installed: npm install sweetalert2
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
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import CakeIcon from "@mui/icons-material/Cake";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import GroupIcon from "@mui/icons-material/Group";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

// تأكد من أن مسار هذا الملف صحيح ولديك دالة fetchWithAuth
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = "https://amjad-hamidi-tms.runasp.net/api";

const AdminAddUser = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // للتجاوبية (Responsive design)

  // حالة الفورم لتخزين بيانات المستخدم المدخلة
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
    profileImageFile: null, // ملف الصورة
    role: "",
  });

  // حالة الأخطاء لكل حقل
  const [errors, setErrors] = useState({});
  // حالة لإظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // حالات الـ Snackbar (لإشعارات النجاح/الخطأ في الأسفل)
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' أو 'error' أو 'warning' أو 'info'

  // حالة لمعاينة الصورة التي تم تحميلها
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // خيارات الأدوار والجنس
  const roleOptions = ["Company", "Supervisor", "Trainee"];
  const genderOptions = ["Male", "Female"];

  // دالة لمعالجة التغييرات في حقول الإدخال
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null })); // مسح الخطأ لهذا الحقل عند التغيير
  };

  // دالة لمعالجة تغيير ملف الصورة
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImageFile: file }));
      setProfileImagePreview(URL.createObjectURL(file)); // إنشاء URL مؤقت للمعاينة
      setErrors((prev) => ({ ...prev, profileImageFile: null }));
    } else {
      setFormData((prev) => ({ ...prev, profileImageFile: null }));
      setProfileImagePreview(null);
    }
  };

  // دالة لعرض الصورة بحجم كبير عند النقر عليها
  const handleImageClick = () => {
    if (profileImagePreview) {
      Swal.fire({
        imageUrl: profileImagePreview,
        imageAlt: "Profile Image",
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
          popup: 'swal2-no-border-radius' // اختياري: إذا أردت زوايا مربعة
        }
      });
    }
  };

  // دالة للتحقق من صحة البيانات قبل الإرسال (Frontend Validation)
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      tempErrors.firstName = "First Name is required.";
      isValid = false;
    }
    if (!formData.lastName) {
      tempErrors.lastName = "Last Name is required.";
      isValid = false;
    }
    if (!formData.userName) {
      tempErrors.userName = "User Name is required.";
      isValid = false;
    }
    if (!formData.phone) {
      tempErrors.phone = "Phone is required.";
      isValid = false;
    } else if (!/^(\+?\d{1,4})?\d{8,10}$/.test(formData.phone)) { // تحقق من صحة رقم الهاتف
      tempErrors.phone = "Invalid phone number format. (e.g., +1234567890 or 0591234567)";
      isValid = false;
    }

    if (!formData.email) {
      tempErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // تحقق من صحة البريد الإلكتروني
      tempErrors.email = "Email is not valid.";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!formData.gender) {
      tempErrors.gender = "Gender is required.";
      isValid = false;
    }

    if (!formData.birthDate) {
      tempErrors.birthDate = "Birth Date is required.";
      isValid = false;
    } else {
      const birthDate = new Date(formData.birthDate);
      const sixteenYearsAgo = new Date();
      sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16); // يجب أن يكون العمر 16 سنة على الأقل
      if (birthDate > sixteenYearsAgo) {
        tempErrors.birthDate = "User must be at least 16 years old.";
        isValid = false;
      }
    }

    if (!formData.role) {
      tempErrors.role = "Role is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // دالة معالجة إرسال الفورم (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع السلوك الافتراضي لإعادة تحميل الصفحة

    // 1. التحقق من صحة البيانات على الواجهة الأمامية
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the form.",
      });
      console.log("Validation Errors (Frontend):", errors); // طباعة أخطاء التحقق للواجهة الأمامية
      return; // إيقاف العملية إذا كان هناك أخطاء
    }

    // 2. إعداد بيانات الـ FormData لإرسالها
    const data = new FormData();
    for (const key in formData) {
      if (key === "profileImageFile" && formData[key]) {
        data.append(key, formData[key]); // إضافة ملف الصورة
      } else if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]); // إضافة باقي الحقول غير الفارغة
      }
    }

    // للتأكد من أن الدور يتم إرساله كنص (خاصة إذا كان من Select)
    if (formData.role) {
      data.set("role", formData.role);
    }

    // طباعة بيانات الـ FormData في الكونسول للمراجعة
    console.log("FormData to be sent:");
    for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
    }

    // 3. إرسال البيانات إلى الـ API
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/Users/Add-User`, {
        method: "POST",
        body: data, // استخدام FormData كـ body
      });

      console.log("Raw API Response:", response); // طباعة الاستجابة الخام من الـ API
      const responseData = await response.json(); // تحليل الاستجابة كـ JSON
      console.log("Parsed API Response Data:", responseData); // طباعة البيانات المحللة

      // 4. معالجة الاستجابة من الـ API
      if (response.ok) { // إذا كانت الاستجابة ناجحة (status 2xx)
        setSnackbarMessage("User added successfully!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
        Swal.fire({
          icon: "success",
          title: "User Added!",
          text: "The new user has been successfully created.",
        }).then(() => {
          navigate("/admin/users"); // التوجيه بعد النجاح
        });
        // إعادة تعيين الفورم بعد النجاح
        setFormData({
          firstName: "",
          lastName: "",
          userName: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: "",
          birthDate: "",
          profileImageFile: null,
          role: "",
        });
        setProfileImagePreview(null);
      } else { // إذا كانت الاستجابة خطأ (مثلاً 400 Bad Request, 401 Unauthorized)
        let swalTitle = "Error!";
        let swalText = "Failed to add user."; // رسالة افتراضية

        // إذا كان هناك رسالة عامة من الـ backend
        if (responseData.message) {
            swalText = responseData.message;
        }

        // إذا كانت هناك أخطاء حقول محددة (مصفوفة من النصوص)
        if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
            swalText += "<br/><br/>";
            swalText += "<strong>Details:</strong><ul>";
            responseData.errors.forEach(err => {
                swalText += `<li>${err}</li>`;
            });
            swalText += "</ul>";
            // هنا يمكنك تحديث حالة errors لتظهر الأخطاء تحت الحقول المعنية
            // (يتطلب معالجة إضافية لربط رسائل الخطأ بأسماء الحقول إذا كانت الـ API لا ترجعها على هذا النحو)
        }
        // إذا كانت أخطاء الحقول كائن (مثل { "Username": ["is taken"] })
        else if (typeof responseData.errors === 'object' && responseData.errors !== null) {
            swalText += "<br/><br/>";
            swalText += "<strong>Details:</strong><ul>";
            for (const key in responseData.errors) {
                if (Array.isArray(responseData.errors[key])) {
                    responseData.errors[key].forEach(err => {
                        swalText += `<li>${key}: ${err}</li>`;
                    });
                } else {
                    swalText += `<li>${key}: ${responseData.errors[key]}</li>`;
                }
            }
            swalText += "</ul>";
            setErrors(responseData.errors || {}); // تحديث الأخطاء لعرضها تحت الحقول
        }

        // تعيين رسالة الـ Snackbar (مع إزالة تنسيق HTML)
        setSnackbarMessage(swalText.replace(/<br\/>/g, '\n').replace(/<\/?ul>/g, '').replace(/<\/?li>/g, '').replace(/<\/?strong>/g, ''));
        setSnackbarSeverity("error");
        setShowSnackbar(true);

        // عرض SweetAlert بالرسالة التفصيلية
        Swal.fire({
          icon: "error",
          title: swalTitle,
          html: swalText, // استخدام 'html' لعرض التنسيق
        });
      }
    } catch (err) {
      console.error("Error during API call:", err); // طباعة أخطاء الشبكة أو الاتصال
      setSnackbarMessage(`Network error: ${err.message}`);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: `Could not connect to the server: ${err.message}`,
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto", // توسيط الـ Box أفقياً
        p: { xs: 1, md: 4 }, // تباعد داخلي، متغير حسب حجم الشاشة
        minHeight: "100vh", // ارتفاع لا يقل عن 100% من ارتفاع الشاشة
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)", // خلفية متدرجة
        display: "flex",
        alignItems: "center", // توسيط عمودي
        justifyContent: "center", // توسيط أفقي
      }}
    >
      <Paper
        elevation={6} // ظل للـ Paper
        sx={{ p: { xs: 2, md: 5 }, borderRadius: 3, background: "#fff", width: "100%" }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1e3c72", mb: 3 }}
        >
          Add New User
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* User Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                error={!!errors.userName}
                helperText={errors.userName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Confirm Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender} required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      {formData.gender === "Male" ? (
                        <MaleIcon />
                      ) : formData.gender === "Female" ? (
                        <FemaleIcon />
                      ) : null}
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select Gender</em>
                  </MenuItem>
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Grid>
            {/* Birth Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                error={!!errors.birthDate}
                helperText={errors.birthDate}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.role} required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <GroupIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  {roleOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Profile Image Upload and Avatar (Horizontal layout) */}
            <Grid item xs={12} >
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* Stack للزر ورسالة الخطأ تحت بعض */}
                <Stack direction="column" alignItems="center" spacing={0.5}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageSearchIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Upload Profile Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {errors.profileImageFile && (
                    <FormHelperText error>{errors.profileImageFile}</FormHelperText>
                  )}
                </Stack>
                {/* الصورة المعاينة */}
                <Avatar
                  src={profileImagePreview || undefined}
                  sx={{ width: 100, height: 100, bgcolor: "grey.300", cursor: profileImagePreview ? 'pointer' : 'default' }}
                  onClick={handleImageClick}
                >
                  {!profileImagePreview && (
                    <AccountCircleIcon sx={{ fontSize: 60, color: "grey.600" }} />
                  )}
                </Avatar>
              </Stack>
            </Grid>

            {/* Submit Button (Alone in its own Grid item at the very bottom) */}
            <Grid item xs={12} width={"100%"}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2, // Added margin-top for spacing
                  py: 1.5,
                  background: "linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #2a5298 30%, #1e3c72 90%)",
                    transform: "scale(1.01)",
                  },
                }}
              >
                Add User
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Snackbar لعرض الرسائل المؤقتة */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AdminAddUser;