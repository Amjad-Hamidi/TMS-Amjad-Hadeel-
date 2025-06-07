import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Categories.css';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  FormLabel,
  Paper,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdminCategories = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generalSkills, setGeneralSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  // تم إزالة السطر: const accessToken = localStorage.getItem('accessToken');
  // لأن fetchWithAuth تتعامل مع الـ accessToken داخليًا.

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleImageClick = () => {
    if (imagePreview) {
      setOpenImageDialog(true);
    }
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !imageFile || !generalSkills.trim()) {
      Swal.fire('Error', 'Please fill all required fields and select an image.', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Description', description);
      formData.append('CategoryImageFile', imageFile);

      const skillsArray = generalSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      skillsArray.forEach(skill => formData.append('GeneralSkills', skill));

      const response = await fetchWithAuth('https://amjad-hamidi-tms.runasp.net/api/Categories', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire('Success', 'Category created successfully.', 'success');
        setName('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setGeneralSkills('');
      } else {
        const errorText = await response.text();
        Swal.fire('Error', errorText || 'Failed to create category.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, md: 4 }, minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)", borderRadius: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72", mb: 3, textAlign: 'center' }}>
        Admin Dashboard — Categories
      </Typography>

      <Box component={Paper} elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, background: "#fff" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", mb: 3 }}>
          Add New Category
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <FormLabel component="legend" required sx={{ mb: 1 }}>Category Image</FormLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              style={{ display: 'block', marginBottom: '10px' }}
            />
            {imagePreview && (
              <Box
                sx={{
                  mt: 2,
                  width: 150,
                  height: 150,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                }}
                onClick={handleImageClick}
              >
                <img src={imagePreview} alt="Category Preview" />
              </Box>
            )}
          </Box>

          <TextField
            label="General Skills"
            variant="outlined"
            fullWidth
            placeholder="e.g., HTML, CSS, JavaScript, React"
            value={generalSkills}
            onChange={e => setGeneralSkills(e.target.value)}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
            helperText="Enter skills separated by commas (e.g., HTML, CSS, JavaScript)"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: '#1e3c72',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Category'}
          </Button>
        </Stack>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          dividers
          sx={{ position: 'relative', p: 0 }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: 'fit-content',
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              backgroundColor: 'rgba(20, 50, 221, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(215, 172, 255, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {imagePreview && (
            <Box
              component="img"
              src={imagePreview}
              alt="Category Image Preview"
              sx={{
                width: '50%',
                height: 'auto',
                maxHeight: '80vh',
                display: 'block',
                mx: 'auto',
                objectFit: 'contain',
                p: 2,
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminCategories;