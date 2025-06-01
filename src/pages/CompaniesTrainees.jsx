import React from "react";
import "../styles/CompaniesTrainees.css";

const companies = [
  {
    id: 1,
    name: "TechVision",
    email: "contact@techvision.com",
    logo: "https://via.placeholder.com/100?text=TV",
  },
  {
    id: 2,
    name: "InnoCore",
    email: "info@innocore.com",
    logo: "https://via.placeholder.com/100?text=IC",
  },
];

const trainees = [
  {
    id: 1,
    name: "Salma Hasan",
    email: "salma.hasan@example.com",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    id: 2,
    name: "Ahmad Nasser",
    email: "ahmad.nasser@example.com",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const CompaniesTrainees = () => {
  return (
    <div className="container">
      <h2>Companies</h2>
      <div className="cards-container">
        {companies.map((company) => (
          <div key={company.id} className="card">
            <img src={company.logo} alt={company.name} className="avatar" />
            <h3>{company.name}</h3>
            <p>{company.email}</p>
            <a href={`mailto:${company.email}`} className="contact-btn">
              Contact by Email
            </a>
          </div>
        ))}
      </div>

      <h2>Trainees</h2>
      <div className="cards-container">
        {trainees.map((trainee) => (
          <div key={trainee.id} className="card">
            <img src={trainee.image} alt={trainee.name} className="avatar" />
            <h3>{trainee.name}</h3>
            <p>{trainee.email}</p>
            <a href={`mailto:${trainee.email}`} className="contact-btn trainee-btn">
              Contact by Email
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesTrainees;
