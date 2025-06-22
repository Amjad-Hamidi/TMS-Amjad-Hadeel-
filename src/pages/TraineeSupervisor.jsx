import React from "react";
import "../styles/TraineeSupervisor.css";

const trainees = [
  {
    id: 1,
    name: "Mohammed Saleh",
    email: "mohammed.saleh@example.com",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    id: 2,
    name: "Lina Faris",
    email: "lina.faris@example.com",
    image: "https://randomuser.me/api/portraits/women/31.jpg",
  },
];

const supervisors = [
  {
    id: 1,
    name: "Omar Khaled",
    email: "omar.khaled@company.com",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const TraineeSupervisor = () => {
  return (
    <div className="container">
      <h2>Trainees Profiles</h2>
      <div className="cards-container">
        {trainees.map((trainee) => (
          <div key={trainee.id} className="card">
            <img src={trainee.image} alt={trainee.name} className="avatar" />
            <h3>{trainee.name}</h3>
            <p>{trainee.email}</p>
            <a href={`mailto:${trainee.email}`} className="contact-btn">
              Contact by Email
            </a>
          </div>
        ))}
      </div>

      <h2>Supervisors Profiles</h2>
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

export default TraineeSupervisor;
