import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // جلب عدد المستخدمين
    const fetchUsersCount = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          "http://amjad-hamidi-tms.runasp.net/api/Users/search",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUsersCount(data.totalCount);
      } catch (err) {
        setErrorUsers("Failed to load users.");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    // جلب الكاتيجوريز
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          "http://amjad-hamidi-tms.runasp.net/api/Categories?page=1&limit=10",
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        setErrorCategories(err.message || "Error loading categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchUsersCount();
    fetchCategories();
  }, []);

  const handleViewProgramClick = (categoryId) => {
    navigate(`/CategoryTProgramsW/${categoryId}`);
  };

  return (
    <div className="a-shell">
      <main className="a-main">
        <h1>System Overview</h1>

        <div className="stat-grid">
          <Stat
            title="Users"
            value={
              loadingUsers
                ? "Loading..."
                : errorUsers
                ? errorUsers
                : usersCount !== null
                ? usersCount.toLocaleString()
                : "N/A"
            }
          />
          <Stat title="Companies" value="48" />
          <Stat title="Active Programs" value="32" />
          <Stat title="Pending Apps" value="87" />
        </div>

        <h2>Explore Categories</h2>

        <div className="search">
          <input
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loadingCategories && <p>Loading categories...</p>}
        {errorCategories && <p className="error">{errorCategories}</p>}

        <div className="grid">
          {!loadingCategories &&
            categories
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
                        onError={() => console.warn("Failed to load image:", imageUrl)}
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

          {!loadingCategories &&
            categories.filter((c) =>
              c.name?.toLowerCase().includes(query.toLowerCase())
            ).length === 0 && <p className="empty">No categories found.</p>}
        </div>
      </main>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
