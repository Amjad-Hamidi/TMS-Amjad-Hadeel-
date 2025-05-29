import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Link,
  Paper
} from "@mui/material";

const TraineeProfile = () => {
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainee = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithAuth("http://amjad-hamidi-tms.runasp.net/api/Profiles/me");

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch trainee profile. Status: ${response.status}`);
        }

        const data = JSON.parse(text);

        setTrainee({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileImageUrl: data.profileImageUrl,
          role: data.role,
          cvPath: data.cvPath,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainee();
  }, []);

  if (loading) {
    return (
      <Box sx={{ marginLeft: "60px", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginLeft: "60px", p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ marginLeft: "60px", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Trainee Profile
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {trainee.profileImageUrl ? (
            <Avatar
              src={trainee.profileImageUrl}
              alt="Profile"
              sx={{ width: 80, height: 80 }}
            />
          ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
              {trainee.fullName?.[0] || "?"}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6">{trainee.fullName}</Typography>
            <Typography color="text.secondary">{trainee.role}</Typography>
          </Box>
        </Box>

        <Typography><strong>ID:</strong> {trainee.id}</Typography>
        <Typography><strong>Email:</strong> {trainee.email}</Typography>
        <Typography><strong>Phone:</strong> {trainee.phoneNumber}</Typography>

        <Box mt={2}>
          <Typography>
            <strong>CV:</strong>{" "}
            {trainee.cvPath ? (
              <Link href={trainee.cvPath} target="_blank" rel="noopener">
                Download CV
              </Link>
            ) : (
              "No CV uploaded"
            )}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TraineeProfile;
