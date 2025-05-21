import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TDashboard.css";

export default function TraineeDashboard() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://amjad-hamidi-tms.runasp.net/api/Categories?page=1&limit=10",
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        setError(err.message || "Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewProgramClick = (categoryId) => {
    navigate(`/CategoryTPrograms/${categoryId}`);
  };

  return (
    <div className="shell">
      <div
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        <i className="fas fa-sign-out-alt"></i> Logout
      </div>

      <main className="main">
        <h1>Explore Categories</h1>

        <div className="search">
          <input
            placeholder="Search your programs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {categories
            .filter((c) =>
              c.name?.toLowerCase().includes(query.toLowerCase())
            )
            .map((c) => {
              const hasImage = !!c.categoryImage;
              const imageUrl = hasImage
                ? c.categoryImage.startsWith("http")
                  ? c.categoryImage
                  : `http://amjad-hamidi-tms.runasp.net${c.categoryImage}`
                : null;

              return (
                <div key={c.id} className="card">
                  {hasImage && (
                    <img
                      src={imageUrl}
                      alt={c.name}
                      className="card-img"
                      onError={() =>
                        console.warn("⚠️ Failed to load image:", imageUrl)
                      }
                    />
                  )}

                  <h3>{c.name}</h3>
                  <p className="desc">{c.description}</p>

                  {c.generalSkills && c.generalSkills.length > 0 && (
                    <ul className="skills-list">
                      {c.generalSkills.map((skill, idx) => (
                        <li key={idx} className="skill-item">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    className="view-btn"
                    onClick={() => handleViewProgramClick(c.id)}
                  >
                    View Training Programs
                  </button>
                </div>
              );
            })}

          {!loading &&
            categories.filter((c) =>
              c.name?.toLowerCase().includes(query.toLowerCase())
            ).length === 0 && <p className="empty">No categories found.</p>}
        </div>
      </main>
    </div>
  );
}
