import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/ViewPrograms.css";
import ApplyModal from "./ApplyModal"; // تأكدي من المسار حسب مشروعك

const programs = [
  {
    name: "Full-Stack Web Development",
    startDate: "2025-06-01",
    endDate: "2025-09-30",
    location: "Amman, Jordan",
    status: "Open",
    image:
      "https://images.unsplash.com/photo-1581090700227-1e8e2fe05b53?auto=format&fit=crop&w=800&q=80",
    company: "TechCorp",
    supervisor: "Eng. Lina Harb",
    rating: 4.7,
    seats: 20,
    approval: "Pending"
  },
  {
    name: "Data Science Bootcamp",
    startDate: "2025-07-15",
    endDate: "2025-10-15",
    location: "Online",
    status: "Closed",
    image:
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80",
    company: "DataSpark",
    supervisor: "Dr. Nour Odeh",
    rating: 4.5,
    seats: 0,
    approval: "Approved"
  }
];

export default function CategoryTPrograms() {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleApply = (program) => {
    setSelectedProgram(program);
  };

  const closeModal = () => {
    setSelectedProgram(null);
  };

  const handleSuccess = () => {
    alert("Application sent successfully!");
    setSelectedProgram(null);
  };
  const navigate = useNavigate(); // هنا بنستخدم useNavigate للتنقل بين الصفحات
  
  const handleBack = () => {
    navigate(-1); // يقوم بالعودة للصفحة السابقة
    };
  return (
    <div className="programs-page">
      <h1 className="category-title">Web Development Programs</h1>

      <div className="programs-grid">
        {programs.map((prog, i) => (
          <div className="program-card" key={i}>
            <img src={prog.image} alt={prog.name} />
            <div className="info">
              <h2>{prog.name}</h2>
              <p><strong>Start:</strong> {prog.startDate}</p>
              <p><strong>End:</strong> {prog.endDate}</p>
              <p><strong>Location:</strong> {prog.location}</p>
              <p><strong>Status:</strong> {prog.status}</p>
              <p><strong>Company:</strong> {prog.company}</p>
              <p><strong>Supervisor:</strong> {prog.supervisor}</p>
              <p><strong>Rating:</strong> ⭐ {prog.rating}</p>
              <p><strong>Seats:</strong> {prog.seats}</p>
              <p><strong>Approval:</strong> {prog.approval}</p>
              <button className="apply-btn" onClick={() => handleApply(prog)}>
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <ApplyModal
          program={{ title: selectedProgram.name, company: selectedProgram.company }}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
       <button className="back-btn" onClick={handleBack}>
    Back
    </button>
    </div>
    
  );
}
