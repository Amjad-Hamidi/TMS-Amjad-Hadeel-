// ApplyModal.jsx
import React, { useState } from "react";
import "../styles/ApplyModal.css";
import Swal from "sweetalert2";
import { fetchWithAuth } from '../utils/fetchWithAuth';

export default function ApplyModal({ program, onClose, onApplySuccess }) {
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
    console.log("📄 CV File Selected:", e.target.files[0]);
  };

  const handleApply = async () => {
    if (!cvFile) {
      Swal.fire({
        icon: "warning",
        title: "CV Required",
        text: "Please upload your CV before applying.",
        confirmButtonColor: "#3085d6",
      });
      console.warn("⚠️ No CV file uploaded.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You must be logged in to apply.",
        confirmButtonColor: "#d33",
      });
      console.error("⛔ No access token found.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("TrainingProgramId", program.trainingProgramId);
    formData.append("CV", cvFile);

    console.log("🟢 APPLYING TO PROGRAM:");
    console.log("Program Object:", program);
    console.log("Program ID:", program.trainingProgramId);
    console.log("Selected CV File:", cvFile);
    console.log("Access Token:", token);
    console.log("API Endpoint:", "http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/enroll");

    try {
      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/enroll`,
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMessage = "Failed to apply";

        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } else {
          const errText = await response.text();
          errorMessage = errText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "You have successfully applied to this program.",
        confirmButtonColor: "#3085d6",
      });

      onApplySuccess(program.trainingProgramId);
      onClose();
    } catch (error) {
      console.error("🔴 Error during application:", error.message);
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: error.message,
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
      console.log("🟡 Submission finished");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Apply to: {program.title}</h2>

        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

        <div className="modal-buttons">
          <button onClick={onClose} disabled={submitting}>Cancel</button>
          <button onClick={handleApply} disabled={submitting}>
            {submitting ? "Submitting..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
