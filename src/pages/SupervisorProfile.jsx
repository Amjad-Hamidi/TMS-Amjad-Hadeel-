import React from "react";
import "../styles/SupervisorProfile.css";

const SupervisorProfile = () => {
const supervisor = {
name: "Eng. Hadeel Hamdan",
email: "hadeel@example.com",
phone: "+970 599 123 456",
bio: "Senior supervisor with 7+ years of experience in guiding tech students and managing educational programs effectively.",
image: "https://i.pravatar.cc/150?img=47",
};

return (
<div className="profile-container">
<div className="profile-card">
<img src={supervisor.image} alt="Supervisor" className="profile-avatar" />
<h1>{supervisor.name}</h1>
<p className="email">{supervisor.email}</p>
<p className="phone">{supervisor.phone}</p>
<p className="bio">{supervisor.bio}</p>
</div>
</div>
);
};

export default SupervisorProfile;






