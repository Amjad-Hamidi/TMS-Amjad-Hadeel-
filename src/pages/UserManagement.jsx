import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Avatar,
  Chip,
  Pagination,
  Stack,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import GavelIcon from "@mui/icons-material/Gavel";
import SettingsIcon from "@mui/icons-material/Settings";
import NumbersIcon from "@mui/icons-material/Numbers";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AddIcon from "@mui/icons-material/Add"; // Icon for Add User button

// Removed fetchWithAuth as it's not directly used in the provided snippet
// import { fetchWithAuth } from '../utils/fetchWithAuth';

const roleOptions = ["Admin", "Company", "Supervisor", "Trainee"];
const API_BASE_URL = "https://amjad-hamidi-tms.runasp.net/api";

function UserManagement() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [users, setUsers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [message, setMessage] = useState("");
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [lockedUsers, setLockedUsers] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState("");

  const [query, setQuery] = useState(""); // State for search query
  const [searchTimeout, setSearchTimeout] = useState(null); // State for search debounce
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 3, // Set default limit to 3 as requested
    totalPages: 1,
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // State for image preview dialog

  // Function to fetch users with pagination and search
  const fetchUsers = useCallback(
    async (token, page = 1, limit = 3, search = "") => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const url = `${API_BASE_URL}/Users/search?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        if (Array.isArray(data.items)) {
          setUsers(data.items);
          setMeta({
            totalCount: data.totalCount,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
          });
          setMessage("");
        } else {
          console.error("Unexpected format", data);
          setUsers([]);
          setMessage("❌ Unexpected data format received.");
        }
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        setUsers([]);
        setErrorUsers(`❌ Error fetching users: ${err.message}`);
      } finally {
        setLoadingUsers(false);
      }
    },
    []
  ); // Empty dependency array as `token` will be passed as an argument

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    setCurrentUserRole(role);

    if (token) {
      try {
        jwtDecode(token); // Validate token
        setAccessToken(token);
        fetchUsers(token, meta.page, meta.limit, query);
      } catch (error) {
        console.error("❌ Invalid token:", error);
        setMessage("❌ Invalid access token");
      }
    } else {
      setMessage("❌ No access token found");
    }
  }, [meta.page, meta.limit, fetchUsers, query]); // Added query and fetchUsers to dependencies

  // Debounce for search input
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const newTimeout = setTimeout(() => {
      fetchUsers(accessToken, 1, meta.limit, query); // Reset to page 1 on search
    }, 500);
    setSearchTimeout(newTimeout);
    return () => clearTimeout(newTimeout);
  }, [query, meta.limit, accessToken, fetchUsers]);

  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const startRoleEdit = (user) => {
    console.log(`✏️ Start editing role for: ${user.firstName} ${user.lastName}`);
    setEditingRoleUserId(user.userAccountId);
    setNewRole(user.role);
  };

  const saveRole = async (userId) => {
    const user = users.find((u) => u.userAccountId === userId);
    if (!user || newRole === user.role) {
      console.log("⚠️ No change in role or user not found.");
      setEditingRoleUserId(null);
      return;
    }

    const result = await Swal.fire({
      title: `Change role of ${user.firstName} ${user.lastName} to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      const body = JSON.stringify({ roleName: newRole });

      console.log("🧪 Changing role...");
      console.log("User ID:", userId);
      console.log("New Role:", newRole);
      console.log("Body Sent:", body);

      try {
        const response = await fetch(
          `${API_BASE_URL}/Users/ChangeRole/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body,
          }
        );

        const responseText = await response.text();
        console.log("🔍 Response Status:", response.status);
        console.log("🔍 Response Text:", responseText);

        if (!response.ok) {
          throw new Error(`❌ Failed to update role. ${responseText}`);
        }

        Swal.fire("✅ Role Updated", `${user.firstName} is now ${newRole}`, "success");
        setUsers((prev) =>
          prev.map((u) =>
            u.userAccountId === userId ? { ...u, role: newRole } : u
          )
        );
        setEditingRoleUserId(null);
      } catch (err) {
        console.error("❌ Role update error:", err);
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const deleteUser = async (userId, role) => {
    const user = users.find((u) => u.userAccountId === userId);
    if (!user) return;

    if (role === "Admin") {
      Swal.fire("🚫 Not allowed", "Cannot delete an Admin user.", "error");
      return;
    }

    console.log(`🗑️ Attempting to delete user: ${user.firstName} ${user.lastName}`);

    const result = await Swal.fire({
      title: `Delete ${user.firstName} ${user.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Users/${userId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Try to get error message from response body
          throw new Error(errorData.message || "❌ Failed to delete user.");
        }

        setUsers((prev) => prev.filter((u) => u.userAccountId !== userId));
        Swal.fire("🗑️ Deleted", `${user.firstName} was deleted successfully`, "success");
        console.log("✅ User deleted:", userId);
      } catch (err) {
        console.error("❌ Delete error:", err);
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const toggleLock = async (userId) => {
    const user = users.find((u) => u.userAccountId === userId);
    if (!user) return;

    if (user.role === "Admin") {
      Swal.fire("🚫 Not Allowed", "Cannot block/unblock an Admin user.", "error");
      return;
    }

    console.log(`🔐 Toggling lock for: ${user.firstName} ${user.lastName}`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/Users/LockUnLock/${userId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // No need to parse response as JSON if it's just a status update
      if (!response.ok) {
        const errorText = await response.text(); // Get raw text for better error debugging
        throw new Error(`❌ Failed to update lock status. ${errorText}`);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.userAccountId === userId
            ? { ...u, isLocked: !u.isLocked } // Assuming the API returns `isLocked` status
            : u
        )
      );

      // Update lockedUsers state if it's still being used for UI logic,
      // though relying on `user.isLocked` from `users` state is generally better.
      setLockedUsers((prev) => ({
        ...prev,
        [userId]: !prev[userId], // Toggle based on previous state
      }));

      Swal.fire(
        "🔒 Status",
        `${user.firstName} is now ${user.isLocked ? "unblocked" : "blocked"} for 5 Minutes.`, // Use user.isLocked for current status
        "info"
      );
    } catch (err) {
      console.error("❌ Lock error:", err);
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        p: { xs: 1, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, background: "#fff" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e3c72" }}>
              User Management
            </Typography>
            {currentUserRole === "Admin" && ( // Show Add User button only for Admin
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate("/add-user")} // Navigate to Add User page
                sx={{
                  background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)", // Blue gradient
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.8rem", // Make it slightly smaller
                  
                  "&:hover": {
                    background: "linear-gradient(45deg, #21cbf3 30%, #2196f3 90%)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Add User
              </Button>
            )}
          </Stack>
          <TextField
            variant="outlined"
            placeholder="Search users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 260, background: "#f5f7fa", borderRadius: 2 }}
          />
        </Stack>

        {message && <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            icon={<GroupIcon />}
            label={`Total: ${meta.totalCount}`}
            color="primary"
            variant="outlined"
            sx={{
              px: 1.5,
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#1976d2" },
            }}
          />
          <Chip
            icon={<ArticleIcon />}
            label={`Page: ${meta.page} / ${meta.totalPages}`}
            color="secondary"
            variant="outlined"
            sx={{
              px: 1.5,
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#9c27b0" },
            }}
          />
          <Chip
            icon={<FormatListNumberedIcon />}
            label={`Limit: ${meta.limit}`}
            color="info"
            variant="outlined"
            sx={{
              px: 1.5,
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#0288d1" },
            }}
          />
        </Stack>

        {loadingUsers ? (
          <Stack alignItems="center" sx={{ my: 6 }}>
            <CircularProgress size={44} color="primary" />
          </Stack>
        ) : errorUsers ? (
          <Typography color="error">{errorUsers}</Typography>
        ) : (
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="user management table">
              <TableHead sx={{ backgroundColor: "#1e3c72" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    <NumbersIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Profile
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    <PersonIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    <EmailIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Email
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    <GavelIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Role
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    <SettingsIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />{" "}
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="subtitle1" color="text.secondary" sx={{ py: 2 }}>
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.userAccountId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {user.userAccountId}
                      </TableCell>
                      <TableCell>
                        {user.profileImageUrl ? (
                          <Avatar
                            src={
                              user.profileImageUrl.startsWith("http")
                                ? user.profileImageUrl
                                : `https://amjad-hamidi-tms.runasp.net${user.profileImageUrl}`
                            }
                            alt={user.userName}
                            sx={{ width: 56, height: 56, cursor: "pointer" }}
                            onClick={() =>
                              handleImageClick(
                                user.profileImageUrl.startsWith("http")
                                  ? user.profileImageUrl
                                  : `https://amjad-hamidi-tms.runasp.net${user.profileImageUrl}`
                              )
                            }
                          />
                        ) : (
                          <Avatar sx={{ width: 56, height: 56, bgcolor: "grey.400" }}>
                            <AccountCircleIcon sx={{ fontSize: 40, color: "grey.700" }} />
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${user.email}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {user.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {editingRoleUserId === user.userAccountId ? (
                          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                              {roleOptions.map((role) => (
                                <MenuItem key={role} value={role}>
                                  {role}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip
                            label={user.role}
                            color={
                              user.role === "Admin"
                                ? "error"
                                : user.role === "Company"
                                ? "success" // Different color for Company
                                : user.role === "Supervisor"
                                ? "secondary"
                                : "info" // Keep info for Trainee
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={1}>
                          {/* Edit Role */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => startRoleEdit(user)}
                            disabled={currentUserRole !== "Admin" || user.role === "Admin"}
                            sx={{
                              background:
                                "linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)",
                              color: "#fff",
                              fontWeight: 600,
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)",
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                              },
                              "&:disabled": {
                                background: "#ccc",
                                color: "#777",
                              },
                            }}
                          >
                            Edit Role
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => deleteUser(user.userAccountId, user.role)}
                            disabled={user.role === "Admin"}
                            sx={{
                              background:
                                "linear-gradient(45deg, #ff416c 30%, #ff4b2b 90%)",
                              color: "#fff",
                              fontWeight: 600,
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #ff4b2b 30%, #ff416c 90%)",
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                              },
                              "&:disabled": {
                                background: "#ccc",
                                color: "#777",
                              },
                            }}
                          >
                            Delete
                          </Button>
                          {user.role !== "Admin" && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => toggleLock(user.userAccountId)}
                              sx={{
                                background:
                                  lockedUsers[user.userAccountId] || user.isLocked
                                    ? "linear-gradient(45deg, #757575 30%, #9e9e9e 90%)"
                                    : "linear-gradient(45deg, #f7971e 30%, #ffd200 90%)",
                                color: "#fff",
                                fontWeight: 600,
                                transition: "transform 0.2s, box-shadow 0.2s",
                                "&:hover": {
                                  background:
                                    lockedUsers[user.userAccountId] || user.isLocked
                                      ? "linear-gradient(45deg, #9e9e9e 30%, #757575 90%)"
                                      : "linear-gradient(45deg, #ffd200 30%, #f7971e 90%)",
                                  transform: "scale(1.05)",
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                },
                              }}
                            >
                              {lockedUsers[user.userAccountId] || user.isLocked
                                ? "Unblock"
                                : "Block"}
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Pagination
            count={meta.totalPages}
            page={meta.page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            color="primary"
            shape="rounded"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 700,
                fontSize: 18,
                mx: 0.5,
                transition: "all 0.3s ease-in-out",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#1e3c72", // لون خلفية عند المرور
                color: "#fff", // لون الخطّ
                transform: "scale(1.1)", // يكبّر العنصر قليلاً
              },
              "& .Mui-selected": {
                color: "#fff !important",
                background: "#1e3c72 !important",
              },
            }}
          />
        </Box>
      </Paper>

      {/* ─── Image Preview Dialog ────────────────────────────────────────────────── */}
      <Dialog open={Boolean(selectedImage)} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogContent dividers sx={{ position: "relative", p: 0 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: "fit-content",
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Profile Image Preview"
              sx={{
                width: "50%",
                height: "auto",
                maxHeight: "80vh",
                display: "block",
                mx: "auto",
                objectFit: "contain",
                p: 2,
                margin: "auto",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default UserManagement;