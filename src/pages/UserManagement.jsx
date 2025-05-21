import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "../styles/UserManagement.css";

const roleOptions = ["Admin", "Company", "Supervisor", "Trainee"];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [message, setMessage] = useState("");
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [lockedUsers, setLockedUsers] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    setCurrentUserRole(role);

    if (token) {
      try {
        jwtDecode(token); // Validate token
        setAccessToken(token);
        fetchUsers(token);
      } catch (error) {
        console.error("❌ Invalid token:", error);
        setMessage("❌ Invalid access token");
      }
    } else {
      setMessage("❌ No access token found");
    }
  }, []);

  const fetchUsers = async (token) => {
    console.log("📡 Fetching users...");
    try {
      const response = await fetch(
        "http://amjad-hamidi-tms.runasp.net/api/Users/search",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("📥 Received users:", data);

      if (Array.isArray(data.items)) {
        setUsers(data.items);
        setMessage("");
      } else {
        console.error("Unexpected format", data);
        setUsers([]);
        setMessage("❌ Unexpected data format received.");
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setUsers([]);
      setMessage("❌ Error fetching users");
    }
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
          `http://amjad-hamidi-tms.runasp.net/api/Users/ChangeRole/${userId}`,
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
          `http://amjad-hamidi-tms.runasp.net/api/Users/${userId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) throw new Error("❌ Failed to delete user.");

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

    console.log(`🔐 Toggling lock for: ${user.firstName} ${user.lastName}`);

    try {
      const response = await fetch(
        `http://amjad-hamidi-tms.runasp.net/api/Users/LockUnLock/${userId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const result = await response.json();
      console.log("🔄 Lock toggle response:", result);

      setLockedUsers((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }));

      Swal.fire(
        "🔒 Status",
        `${user.firstName} is now ${lockedUsers[userId] ? "unblocked" : "blocked"} for 5 Minutes.`,
        "info"
      );
    } catch (err) {
      console.error("❌ Lock error:", err);
      Swal.fire("Error", "❌ Failed to update lock status", "error");
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {message && <div className="message-box">{message}</div>}

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userAccountId}>
              <td>{user.userAccountId}</td>
              <td>
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="profile-img"
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>
                {editingRoleUserId === user.userAccountId ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingRoleUserId === user.userAccountId ? (
                  <button onClick={() => saveRole(user.userAccountId)}>
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startRoleEdit(user)}
                    disabled={
                      currentUserRole !== "Admin" || user.role === "Admin"
                    }
                  >
                    Edit Role
                  </button>
                )}

                <button
                  onClick={() => deleteUser(user.userAccountId, user.role)}
                  disabled={user.role === "Admin"}
                >
                  Delete
                </button>

                {user.role !== "Admin" && (
                  <button
                    onClick={() => toggleLock(user.userAccountId)}
                    style={{
                      marginTop: "4px",
                      backgroundColor: lockedUsers[user.userAccountId]
                        ? "#6c757d"
                        : "#ffc107",
                      color: "black",
                    }}
                  >
                    {lockedUsers[user.userAccountId] ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
