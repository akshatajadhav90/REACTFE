import React, { useState, useEffect } from "react";

const UsersPage = () => {
  // Fetch users from LocalStorage or use default values
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
      { id: 3, name: "Emily Johnson", email: "emily.johnson@example.com" },
    ];
  });

  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  // Save users to LocalStorage whenever the users array changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Add User
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return alert("Please fill all fields!");
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setNewUser({ name: "", email: "" });
  };

  // Edit User
  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveEdit = () => {
    setUsers(
      users.map((user) =>
        user.id === editingUser.id ? editingUser : user
      )
    );
    setEditingUser(null);
  };

  // Delete User
  const handleDeleteUser = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Users Management</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={styles.row}>
              <td style={styles.td}>{user.id}</td>
              <td style={styles.td}>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    style={styles.input}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td style={styles.td}>
                {editingUser && editingUser.id === user.id ? (
                  <input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    style={styles.input}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={styles.td}>
                {editingUser && editingUser.id === user.id ? (
                  <>
                    <button onClick={handleSaveEdit} style={styles.saveButton}>
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditUser(user.id)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.addUser}>
        <h3 style={styles.addUserHeader}>Add New User</h3>
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleAddUser} style={styles.addButton}>
          Add User
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#343a40",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #dee2e6",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #dee2e6",
  },
  row: {
    ":hover": {
      backgroundColor: "#f1f1f1",
    },
  },
  input: {
    padding: "8px",
    width: "20%",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
  },
  editButton: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  cancelButton: {
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addUser: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  addUserHeader: {
    marginBottom: "10px",
    color: "#343a40",
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
};

export default UsersPage;
