import React from "react";
import "../styles/TraineesList.css";

const dummyTrainees = [
  {
    id: 1,
    name: "Lina Ahmad",
    email: "lina@example.com",
    cvUrl: "https://example.com/lina-cv.pdf",
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    id: 2,
    name: "Omar Saleh",
    email: "omar@example.com",
    cvUrl: "https://example.com/omar-cv.pdf",
    avatar: "https://i.pravatar.cc/100?img=2"
  },
  {
    id: 3,
    name: "Maya Hamdan",
    email: "maya@example.com",
    cvUrl: "https://example.com/maya-cv.pdf",
    avatar: "https://i.pravatar.cc/100?img=3"
  }
];

export default function TraineesList() {
  const handleInvite = (email) => {
    alert(`📩 Invitation sent to ${email}`);
    // هنا ممكن تستخدمي API حقيقية للإرسال
  };

  return (
    <div className="trainees-page">
      <h2>Available Trainees</h2>
      <div className="trainee-grid">
        {dummyTrainees.map(t => (
          <div key={t.id} className="trainee-card">
            <img src={t.avatar} alt={t.name} className="avatar" />
            <h3>{t.name}</h3>
            <a href={t.cvUrl} target="_blank" rel="noreferrer">📄 View CV</a>
            <button onClick={() => handleInvite(t.email)}>📧 Contact by Email</button>
          </div>
        ))}
      </div>
    </div>
  );
}
