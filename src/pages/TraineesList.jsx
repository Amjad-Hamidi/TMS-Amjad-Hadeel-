import React, { useEffect, useState } from "react";
import "../styles/TraineesList.css";

export default function TraineesList() {
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    const fetchTrainees = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch("http://amjad-hamidi-tms.runasp.net/api/Users/trainees-company", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trainees");
        }

        const data = await response.json();
        setTrainees(data.items); // 👈 حسب الـ response اللي وفرته
      } catch (error) {
        console.error("❌ Error fetching trainees:", error);
      }
    };

    fetchTrainees();
  }, []);

  const handleInvite = (email) => {
    alert(`📩 Invitation sent to ${email}`);
    // يمكنك لاحقًا ربط هذه الدالة بـ API حقيقي للإرسال
  };

  return (
    <div className="trainees-page">
      <h2>Available Trainees</h2>
      <div className="trainee-grid">
        {trainees.map(t => (
          <div key={t.id} className="trainee-card">
            <img
              src={t.profileImageUrl || "https://i.pravatar.cc/100"} // ✅ صورة افتراضية في حال null
              alt={t.fullName}
              className="avatar"
            />
            <h3>{t.fullName}</h3>
            <p>{t.trainingProgramName} - {t.categoryName}</p>
            <a href={t.cvPath} target="_blank" rel="noreferrer">📄 View CV</a>
            <button onClick={() => handleInvite(t.email)}>📧 Invite by Email</button>
          </div>
        ))}
      </div>
    </div>
  );
}
