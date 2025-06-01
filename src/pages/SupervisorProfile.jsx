import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WcIcon from "@mui/icons-material/Wc";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useNavigate } from "react-router-dom";

const SupervisorProfile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisor = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/me");
        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch supervisor profile. Status: ${response.status}`);
        }

        const data = JSON.parse(text);

        setSupervisor({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileImageUrl: data.profileImageUrl,
          role: data.role,
          cvPath: data.cvPath,
          gender: data.gender,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisor();
  }, []);

  if (loading)
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;

  if (error)
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, position: "relative", p: 2 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
            <Avatar
              alt={supervisor.fullName}
              src={supervisor.profileImageUrl || ""}
              sx={{ width: 120, height: 120, mx: "auto", mb: 2, boxShadow: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              <BadgeIcon sx={{ mr: 1, fontSize: 18, color: "primary.main" }} />
              {supervisor.role}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {supervisor.fullName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography>{supervisor.email}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography>{supervisor.phoneNumber}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AssignmentIndIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography>ID: {supervisor.id}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <WcIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography>
                {supervisor.gender === 0
                  ? "Male"
                  : supervisor.gender === 1
                  ? "Female"
                  : "—"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography>
                <strong>CV:</strong>{" "}
                {supervisor.cvPath ? (
                  <a href={supervisor.cvPath} target="_blank" rel="noopener noreferrer">
                    Download CV
                  </a>
                ) : (
                  "No CV uploaded"
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: 3, textAlign: { xs: "center", sm: "left" } }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, minWidth: 180 }}
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>

        <hr style={{ margin: "32px 0" }} />

        <Typography variant="h6" gutterBottom>Change Email</Typography>
        <ChangeEmailForm />

        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Change Password</Typography>
        <ChangePasswordForm />
      </Card>
    </Box>
  );
};

function ChangeEmailForm() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/ChangeEmail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail, confirmEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Unknown error");
      } else {
        setSuccess(data.message || "Email changed successfully");
        setNewEmail(""); setConfirmEmail("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
      <input type="email" placeholder="New Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
      <input type="email" placeholder="Confirm Email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
      <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
        Change Email
      </button>
    </form>
  );
}

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://amjad-hamidi-tms.runasp.net/api/Account/ChangePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || Object.values(data.errors || {}).flat().join(" ") || "Unknown error");
      } else {
        setSuccess(data.message || "Password changed successfully");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
      <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: "100%", marginBottom: 12, padding: 8 }} />
      <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
        Change Password
      </button>
    </form>
  );
}

export default SupervisorProfile;
