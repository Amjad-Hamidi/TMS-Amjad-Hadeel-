import React, { useState } from "react";
import "../styles/AddTrainingProgram.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';

function AddTrainingProgram() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    seatsAvailable: "",
    rating: "",
    contentUrl: "",
    classroomUrl: "",
    categoryId: "",
    companyId: "",
    supervisorId: "",
    imageFile: null,
    status: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSubmitted(false);

    const data = new FormData();
    data.append("Title", formData.title);
    data.append("Description", formData.description);
    data.append("StartDate", formData.startDate);
    data.append("EndDate", formData.endDate);
    data.append("Location", formData.location);
    data.append("SeatsAvailable", formData.seatsAvailable);
    data.append("Rating", formData.rating);
    data.append("ContentUrl", formData.contentUrl);
    data.append("ClassroomUrl", formData.classroomUrl);
    data.append("CategoryId", formData.categoryId);
    data.append("CompanyId", formData.companyId);
    data.append("SupervisorId", formData.supervisorId);
    data.append("Status", formData.status);
    if (formData.imageFile) {
      data.append("ImageFile", formData.imageFile);
    }

    try {
      const res = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/TrainingPrograms", {
        method: "POST",
        body: data,
      });

      const contentType = res.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = await res.text();
      }

      console.log("🔵 Server Response:", result);

      if (!res.ok) {
        setErrors(typeof result === "string" ? { general: result } : result.errors || result);
      } else {
        setResponseData(result);
        setSubmitted(true);
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
          seatsAvailable: "",
          rating: "",
          contentUrl: "",
          classroomUrl: "",
          categoryId: "",
          companyId: "",
          supervisorId: "",
          imageFile: null,
          status: true,
        });
      }
    } catch (error) {
      console.error("❌ Request Failed:", error);
      setErrors({ general: "Failed to submit program." });
    }
  };

  return (
    <div className="add-training-container">
      <h2>✨ Add Training Program ✨</h2>

      {submitted && (
        <div className="success-message">
          ✅ Program submitted successfully.
        </div>
      )}

      {errors && (
        <div className="error-message">
          ❌ Submission failed:
          <ul>
            {Object.entries(errors).map(([key, value], i) => (
              <li key={i}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="training-form">
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />

        <label>Start Date</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

        <label>End Date</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        <label>Seats Available</label>
        <input type="number" name="seatsAvailable" value={formData.seatsAvailable} onChange={handleChange} required />

        <label>Rating</label>
        <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} required />

        <label>Content URL</label>
        <input name="contentUrl" value={formData.contentUrl} onChange={handleChange} />

        <label>Classroom URL</label>
        <input name="classroomUrl" value={formData.classroomUrl} onChange={handleChange} />

        <label>Category ID</label>
        <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange} required />

        <label>Company ID</label>
        <input type="number" name="companyId" value={formData.companyId} onChange={handleChange} required />

        <label>Supervisor ID</label>
        <input type="number" name="supervisorId" value={formData.supervisorId} onChange={handleChange} required />

        <label>Image File</label>
        <input type="file" name="imageFile" onChange={handleChange} />

        <label>Status</label>
        <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />

        <button type="submit">🚀 Submit Program</button>
      </form>
    </div>
  );
}

export default AddTrainingProgram;
