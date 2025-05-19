import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Categories.css';

const AdminCategories = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [generalSkills, setGeneralSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken'); // تأكد أن التوكن موجود

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !imageFile) {
      Swal.fire('Error', 'Please fill all required fields and select an image.', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Description', description);
      formData.append('CategoryImageFile', imageFile);
      
      // GeneralSkills هي قائمة نصوص، افترضنا المستخدم يكتبها مفصولة بفواصل
      const skillsArray = generalSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      skillsArray.forEach(skill => formData.append('GeneralSkills', skill));

      const response = await fetch('http://amjad-hamidi-tms.runasp.net/api/Categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // لا تضف Content-Type عند إرسال FormData، المتصفح يضبطها تلقائياً
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire('Success', 'Category created successfully.', 'success');
        // تفريغ الحقول
        setName('');
        setDescription('');
        setImageFile(null);
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
    <div className="admin-cats-shell">
      <h2>Admin Dashboard — Categories</h2>

      <div className="form-section">
        <h3>Add New Category</h3>

        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="General Skills (comma separated)"
          value={generalSkills}
          onChange={e => setGeneralSkills(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Add Category'}
        </button>
      </div>
    </div>
  );
};

export default AdminCategories;
