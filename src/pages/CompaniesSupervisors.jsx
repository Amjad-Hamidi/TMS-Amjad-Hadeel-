import React from "react";
import "../styles/CompaniesSupervisors.css";

const companies = [
  {
    id: 1,
    name: "Advanced Tech Company",
    email: "contact@advtech.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Innovation Corp",
    email: "info@innovation.com",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const supervisors = [
  {
    id: 1,
    name: "Ahmed Ali",
    email: "ahmed.ali@company.com",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 2,
    name: "Sarah Mahmoud",
    email: "sarah.mahmoud@company.com",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const CompaniesSupervisors = () => {
  return (
    <div className="container">
      <h2>Companies</h2>
      <div className="cards-container">
        {companies.map((company) => (
          <div key={company.id} className="card">
            <img src={company.image} alt={company.name} className="avatar" />
            <h3>{company.name}</h3>
            <p>{company.email}</p>
            <a href={`mailto:${company.email}`} className="contact-btn">
              Contact by Email
            </a>
          </div>
        ))}
      </div>

      <h2>Supervisors</h2>
      <div className="cards-container">
        {supervisors.map((supervisor) => (
          <div key={supervisor.id} className="card">
            <img src={supervisor.image} alt={supervisor.name} className="avatar" />
            <h3>{supervisor.name}</h3>
            <p>{supervisor.email}</p>
            <a href={`mailto:${supervisor.email}`} className="contact-btn contact-supervisor">
              Contact by Email
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesSupervisors;
