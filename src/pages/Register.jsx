


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const RegisterForm = () => {
  const navigate = useNavigate();

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
        setSuccessMessage('✅ Registered successfully!');
        setErrors({});
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
      console.error('Error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errors.general && (
          <div className="error-box">
            <p>{errors.general}</p>
          </div>
        )}

        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          {errors.firstname && <small className="error-text">{errors.firstname}</small>}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          {errors.lastname && <small className="error-text">{errors.lastname}</small>}
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleInputChange} required />
          {errors.username && <small className="error-text">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          {errors.phone && <small className="error-text">{errors.phone}</small>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
          {errors.confirmpassword && <small className="error-text">{errors.confirmpassword}</small>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <small className="error-text">{errors.gender}</small>}
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required />
          {errors.birthdate && <small className="error-text">{errors.birthdate}</small>}
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleInputChange} required>
            <option value="">Select Role</option>
            <option value="Trainee">Trainee</option>
            <option value="Trainer">Trainer</option>
            <option value="Company">Company</option>
          </select>
          {errors.role && <small className="error-text">{errors.role}</small>}
        </div>

        <button type="submit" className="submit-btn">Register</button>

        {successMessage && (
          <div className="success-box" style={{ marginTop: '15px' }}>
            <p>{successMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;



