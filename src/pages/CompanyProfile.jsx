import React, { useEffect, useState } from "react";
import "../styles/CompanyProfile.css";
import { fetchWithAuth } from '../utils/fetchWithAuth';

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/me", {
          headers: { Accept: "*/*" },
        });
        if (!response.ok) throw new Error("Failed to load profile.");
        const data = await response.json();
        setCompany(data);
      } catch (err) {
        setError(err.message || "Error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  if (loading) return <p>Loading company profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="company-profile">
      <div className="company-card">
        <img
          src={company.profileImageUrl || "https://via.placeholder.com/150"}
          alt="Company Logo"
          className="company-logo"
        />
        <h1 className="company-name">{company.fullName}</h1>
        <div className="company-info">
          <p><strong>ID:</strong> {company.id}</p>
          <p><strong>Role:</strong> {company.role}</p>
          <p><strong>Email:</strong> <a href={`mailto:${company.email}`}>{company.email}</a></p>
          <p><strong>Phone:</strong> {company.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}
