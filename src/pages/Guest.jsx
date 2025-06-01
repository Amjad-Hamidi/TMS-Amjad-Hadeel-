import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Guest.css";

const categories = [
  {
    id: "CAT001",
    name: "Web Development",
    description: "Build modern websites using HTML, CSS, JavaScript, and more.",
    image: "https://images.unsplash.com/photo-1581090700227-1e8e2fe05b53?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CAT002",
    name: "Data Science",
    description: "Master data analysis, visualization, and machine learning.",
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CAT003",
    name: "UI/UX Design",
    description: "Design intuitive and elegant user interfaces.",
    image: "https://images.unsplash.com/photo-1614113818379-00f0436c4b15?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CAT004",
    name: "Cyber Security",
    description: "Protect systems and data from cyber threats.",
    image: "https://images.unsplash.com/photo-1614064641938-b31b7f2e0452?auto=format&fit=crop&w=800&q=80"
  }
];

export default function GuestPage() {
  const navigate = useNavigate();

  return (
    <div className="guest-container">
      <header className="guest-header">
        <h1>Not just training. A launchpad to your dream career 🚀</h1>
        <p>Join thousands of learners upgrading their skills in top-demand fields.</p>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
        </div>
      </header>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <img src={cat.image} alt={cat.name} />
            <div className="cat-info">
              <h2>{cat.name}</h2>
              <p><strong>ID:</strong> {cat.id}</p>
              <p>{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
