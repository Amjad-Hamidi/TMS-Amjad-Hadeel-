
import React, { useEffect, useState } from "react";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [lockedUsers, setLockedUsers] = useState({});
  const [message, setMessage] = useState("");

  const currentUserRole = "Admin"; // ثابت الآن لغرض التجريب

  const mockUsers = [
    {
      userAccountId: 1,
      firstName: "Lina",
      lastName: "Salem",
      email: "lina@example.com",
      role: "Trainee",
      profileImageUrl: "https://i.pravatar.cc/100?img=5",
    },
    {
      userAccountId: 2,
      firstName: "Khaled",
      lastName: "Ahmad",
      email: "khaled@example.com",
      role: "Company",
      profileImageUrl: "https://i.pravatar.cc/100?img=2",
    },
    {
      userAccountId: 3,
      firstName: "Sara",
      lastName: "Ali",
      email: "sara@example.com",
      role: "Supervisor",
      profileImageUrl: "",
    },
    {
      userAccountId: 4,
      firstName: "Rami",
      lastName: "Ziad",
      email: "rami@example.com",
      role: "Admin",
      profileImageUrl: "https://i.pravatar.cc/100?img=4",
    },
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const startRoleEdit = (user) => {
    setEditingRoleUserId(user.userAccountId);
    setNewRole(user.role);
  };

  const saveRole = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userAccountId === id ? { ...user, role: newRole } : user
      )
    );
    setEditingRoleUserId(null);
    setNewRole("");
    setMessage("✅ Role updated successfully");
  };

  const deleteUser = (id, role) => {
    if (role === "Admin") {
      setMessage("❌ Cannot delete an Admin user.");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.userAccountId !== id));
    setMessage("🗑️ User deleted successfully");
  };

  const toggleLock = (userId) => {
    setLockedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    setMessage("✅ Lock status updated.");
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
                    <option value="Admin">Admin</option>
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
};

export default UserManagement;



