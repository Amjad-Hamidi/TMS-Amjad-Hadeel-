import React, { useState } from "react";
import "../styles/TraineeProfile.css";

const dummyProfile = {
  name: "Sara Odeh",
  email: "sara@example.com",
};

const myPrograms = [
  { id: 1, title: "Full‑Stack Bootcamp", status: "Current" },
  { id: 2, title: "Data Analysis Basics", status: "Completed" },
];

export default function TraineeProfile() {
  const [form, setForm] = useState(dummyProfile);
  const [cv, setCV] = useState(null);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?img=68");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCV({ name: file.name, url: URL.createObjectURL(file) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000)); // API call later
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="prof-wrap">
      <div className="profile-card">
        {/* صورة الملف الشخصي */}
        <div className="image-container">
          <label htmlFor="upload-photo">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-pic clickable"
              title="Click to change photo"
            />
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <h2>My Profile</h2>

        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Resume (PDF/DOCX)</label>
        {cv ? (
          <div className="cv-row">
            <a href={cv.url} target="_blank" rel="noreferrer">
              {cv.name}
            </a>
            <button onClick={() => setCV(null)}>×</button>
          </div>
        ) : (
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} />
        )}

        <label>My Training Programs</label>
        <div className="prog-section">
          <div className="column">
            <h4>Current</h4>
            {myPrograms
              .filter((p) => p.status === "Current")
              .map((p) => (
                <p key={p.id}>• {p.title}</p>
              ))}
          </div>
          <div className="column">
            <h4>Completed</h4>
            {myPrograms
              .filter((p) => p.status === "Completed")
              .map((p) => (
                <p key={p.id}>• {p.title}</p>
              ))}
          </div>
        </div>

        <button className="save" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <p className="ok">Saved ✓</p>}
      </div>
    </div>
  );
}
