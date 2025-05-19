import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";  // صححت الاستيراد
import Swal from "sweetalert2";
import "../styles/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [message, setMessage] = useState("");
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [lockedUsers, setLockedUsers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        setAccessToken(token);
        fetchUsers(token);
      } catch (error) {
        console.error("Invalid token:", error);
        setMessage("❌ Invalid access token");
      }
    } else {
      setMessage("❌ No access token found");
    }
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(
        "http://amjad-hamidi-tms.runasp.net/api/Users/search",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched users data:", data);

      if (Array.isArray(data.items)) {
        setUsers(data.items);
        setMessage("");
      } else {
        console.error("Unexpected users format", data);
        setUsers([]);
        setMessage("❌ Unexpected data format received.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setMessage("❌ Error fetching users");
    }
  };

  const startRoleEdit = (user) => {
    setEditingRoleUserId(user.userAccountId);
    setNewRole(user.role);
  };

  const saveRole = async (userId) => {
    const user = users.find((u) => u.userAccountId === userId);
    if (!user) return;

    if (newRole === user.role) {
      setEditingRoleUserId(null);
      return;
    }

    const result = await Swal.fire({
      title: `Are you sure you want to change role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://amjad-hamidi-tms.runasp.net/api/Users/ChangeRole/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: newRole }),
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          try {
            const errorJson = JSON.parse(responseText);
            console.error("ChangeRole error JSON:", errorJson);
          } catch {
            console.error("ChangeRole response is not JSON");
          }
          throw new Error(`Failed to update role: ${response.status}`);
        }

        Swal.fire("Updated!", "User role has been updated.", "success");

        setUsers(
          users.map((u) =>
            u.userAccountId === userId ? { ...u, role: newRole } : u
          )
        );
        setEditingRoleUserId(null);
      } catch (error) {
        console.error("ChangeRole catch error:", error);
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  const deleteUser = async (userId, role) => {
    if (role === "Admin") return; // لا تحذف الأدمين

    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://amjad-hamidi-tms.runasp.net/api/Users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          try {
            const errorJson = JSON.parse(responseText);
            console.error("Delete error JSON:", errorJson);
          } catch {
            console.error("Delete response is not JSON");
          }
          throw new Error(`Failed to delete user: ${response.status}`);
        }

        Swal.fire("Deleted!", "User has been deleted.", "success");

        setUsers(users.filter((u) => u.userAccountId !== userId));
      } catch (error) {
        console.error("Delete catch error:", error);
        Swal.fire("Error!", error.message, "error");
      }
    }
  };

  const toggleLock = async (userId) => {
    const isLocked = lockedUsers[userId] || false;
    const actionText = isLocked ? "Unblock" : "Block";

    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}!`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://amjad-hamidi-tms.runasp.net/api/Users/LockUnLock/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorJson = JSON.parse(responseText);
          console.error("LockUnLock error JSON:", errorJson);
        } catch {
          console.error("LockUnLock response is not JSON");
        }
        throw new Error(`Failed to ${actionText.toLowerCase()} user: ${response.status}`);
      }

      Swal.fire(
        `${actionText}ed!`,
        `User has been ${actionText.toLowerCase()}ed successfully.`,
        "success"
      );

      setLockedUsers((prev) => ({
        ...prev,
        [userId]: !isLocked,
      }));
    } catch (error) {
      console.error("LockUnLock catch error:", error);
      Swal.fire("Error!", error.message, "error");
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
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userAccountId}>
                <td>{user.userAccountId}</td>
                <td>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="profile"
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
                      <option value="Company">Company</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Trainee">Trainee</option>
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
                      disabled={user.role === "Admin"}
                    >
                      Edit Role
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.userAccountId, user.role)}
                    disabled={user.role === "Admin"}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>

                  {user.role !== "Admin" && (
                    <button
                      onClick={() => toggleLock(user.userAccountId)}
                      style={{
                        marginLeft: "8px",
                        marginTop: "4px",
                        backgroundColor: lockedUsers[user.userAccountId]
                          ? "green"
                          : "red",
                        color: "white",
                      }}
                    >
                      {lockedUsers[user.userAccountId] ? "Unlock" : "Lock"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
