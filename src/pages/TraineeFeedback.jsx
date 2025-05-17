import React, { useState, useMemo } from "react";
import "../styles/TraineeFeedback.css";

const dummy = [
  {
    id: 11,
    source: "Company",
    author: "FutureSoft – HR",
    authorImg: "/avatars/company1.png",
    receiverImg: "/avatars/trainee1.png",
    date: "2025-04-28 10:15",
    rating: 4.8,
    msg: "Excellent problem‑solving skills in the React project!",
    type: "Praise",
    attachment: null
  },
  {
    id: 10,
    source: "Trainer",
    author: "Eng. Sarah Hamdan",
    authorImg: "/avatars/trainer.png",
    receiverImg: "/avatars/trainee1.png",
    date: "2025-04-26 14:00",
    rating: 4.5,
    msg: "Great progress on backend assignments; keep refactoring.",
    type: "General",
    attachment: null
  },
  {
    id: 8,
    source: "Company",
    author: "TechCorp – Mentor",
    authorImg: "/avatars/company2.png",
    receiverImg: "/avatars/trainee1.png",
    date: "2025-04-20 09:20",
    rating: 3.9,
    msg: "Need to improve time‑management; sprint tasks slipped.",
    type: "Suggestion",
    attachment: "feedback-doc.pdf"
  }
];

export default function TraineeFeedback() {
  const [filterSource, setFilterSource] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState("Supervisor");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("General");
  const [attachment, setAttachment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const sorted = useMemo(() =>
    [...dummy].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , []);

  const filtered = sorted.filter(f =>
    (filterSource === "All" || f.source === filterSource) &&
    (filterType === "All" || f.type === filterType) &&
    f.msg.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert(`Feedback sent to ${target}:\n${message}\nType: ${type}`);
      setMessage("");
      setAttachment(null);
      setShowForm(false);
    }
  };

  return (
    <div className="fb-wrap">
      <h2>Feedback</h2>

      {/* Search bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search feedback..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="fb-filter">
        <label>Source:</label>
        {["All", "Trainer", "Company"].map((f) => (
          <button
            key={f}
            className={filterSource === f ? "active" : ""}
            onClick={() => setFilterSource(f)}
          >
            {f}
          </button>
        ))}

        <label>Type:</label>
        {["All", "General", "Suggestion", "Praise"].map((t) => (
          <button
            key={t}
            className={filterType === t ? "active" : ""}
            onClick={() => setFilterType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      <div className="fb-list">
        {filtered.map((f) => (
          <div key={f.id} className={`fb-card ${f.source.toLowerCase()}`}>
            <div className="row">
              <img src={f.authorImg} className="avatar" alt="author" />
              <span className="badge">{f.source}</span>
              <span className="rating">⭐ {f.rating}</span>
            </div>

            <p className="msg">{f.msg}</p>

            <div className="meta">
              <img src={f.receiverImg} className="avatar sm" alt="receiver" />
              <span>{f.author}</span>
              <span>{f.date}</span>
              <span className="type">{f.type}</span>
            </div>

            {f.attachment && (
              <div className="attach">
                📎 <a href={`/${f.attachment}`} target="_blank" rel="noopener noreferrer">{f.attachment}</a>
              </div>
            )}

            <button className="edit-btn">✏️ Edit</button>
          </div>
        ))}

        {filtered.length === 0 && <p className="empty">No feedback found.</p>}
      </div>

      <hr className="divider" />

      {/* Feedback Form */}
      {!showForm ? (
        <button className="show-btn" onClick={() => setShowForm(true)}>
          Give Feedback
        </button>
      ) : (
        <div className="fb-form">
          <h3>Write Feedback</h3>
          <form onSubmit={handleSubmit}>
            <label>
              To:
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="Supervisor">Supervisor</option>
                <option value="Company">Company</option>
              </select>
            </label>

            <label>
              Type:
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="General">General</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Praise">Praise</option>
              </select>
            </label>

            <textarea
              placeholder="Write your feedback here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <label>
              Attachment (optional):
              <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
            </label>

            <button type="submit">Send Feedback</button>
          </form>
        </div>
      )}
    </div>
  );
}


