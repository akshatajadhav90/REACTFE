import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    age: "",
    gender: "",
    profession: "",
  });
  const [isEditResponse, setIsEditResponse] = useState(false);
  const [isAddResponse, setIsAddResponse] = useState(false);
  const [showAgeErrorPopup, setShowAgeErrorPopup] = useState(false);

  const API_URL = "http://localhost:4008/api/users";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token)
          throw new Error("Authorization token is missing. Please log in.");

        const response = await axios.get(`${API_URL}/getUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditResponse(false);
        setIsAddResponse(false);
        setUsers(response.data.users);
      } catch (error) {
        setError("Failed to fetch users. " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isEditResponse, isAddResponse]);

  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.age ||
      !newUser.gender ||
      !newUser.profession
    ) {
      return alert("Please fill all fields!");
    }

    const age = Number(newUser.age);
    if (!Number.isInteger(age)) {
      setShowAgeErrorPopup(true);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/addUsers`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAddResponse(true);

      setUsers([...users, response.data.users]);
      setNewUser({ name: "", age: "", gender: "", profession: "" });
      setShowAgeErrorPopup(false);
    } catch (err) {
      setIsAddResponse(false);
      setError("Failed to add user");
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_URL}/updateUsers/${editingUser.id}`,
        editingUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditResponse(true);

      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? response.data.users : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      setIsEditResponse(false);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/deletUsers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const closeAgeErrorPopup = () => {
    setShowAgeErrorPopup(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Users Management</h1>

      <div className="tableActions">
        <i
          className="fas fa-search"
          onClick={globalSearch}
          style={{ cursor: "pointer", fontSize: "20px", color: "#007bff" }}
        ></i>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Profession</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={styles.row}>
              <td
                style={styles.td}
                title={
                  editingUser && editingUser.id === user.id
                    ? editingUser.name
                    : user.name
                }
              >
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
              <td
                style={styles.td}
                title={
                  editingUser && editingUser.id === user.id
                    ? editingUser.age
                    : user.age
                }
              >
                {editingUser && editingUser.id === user.id ? (
                  <input
                    type="number"
                    value={editingUser.age}
                    onChange={(e) => {
                      const age = e.target.value;
                      if (/^\d+$/.test(age) || age === "") {
                        setEditingUser({ ...editingUser, age: e.target.value });
                      } else {
                        setShowAgeErrorPopup(true);
                      }
                    }}
                    style={styles.input}
                  />
                ) : (
                  user.age
                )}
              </td>
              <td
                style={styles.td}
                title={
                  editingUser && editingUser.id === user.id
                    ? editingUser.gender
                    : user.gender
                }
              >
                {editingUser && editingUser.id === user.id ? (
                  <input
                    value={editingUser.gender}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, gender: e.target.value })
                    }
                    style={styles.input}
                  />
                ) : (
                  user.gender
                )}
              </td>
              <td
                style={styles.td}
                title={
                  editingUser && editingUser.id === user.id
                    ? editingUser.profession
                    : user.profession
                }
              >
                {editingUser && editingUser.id === user.id ? (
                  <input
                    value={editingUser.profession}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        profession: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                ) : (
                  user.profession
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
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => {
            const age = e.target.value;
            if (/^\d+$/.test(age) || age === "") {
              setNewUser({ ...newUser, age: e.target.value });
            } else {
              setShowAgeErrorPopup(true);
            }
          }}
          style={styles.input}
        />
        <input
          placeholder="Gender"
          value={newUser.gender}
          onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Profession"
          value={newUser.profession}
          onChange={(e) =>
            setNewUser({ ...newUser, profession: e.target.value })
          }
          style={styles.input}
        />
        <button onClick={handleAddUser} style={styles.addButton}>
          Add User
        </button>
      </div>

      {showAgeErrorPopup && (
        <div style={styles.errorPopup}>
          <p>Please enter a valid age (positive integer).</p>
          <button onClick={closeAgeErrorPopup} style={styles.closeButton}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "8px",
  },
  input: {
    width: "100%",
    padding: "5px",
    margin: "5px 0",
    boxSizing: "border-box",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  addUser: {
    marginTop: "20px",
  },
  addUserHeader: {
    marginBottom: "10px",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  errorPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default UsersPage;
