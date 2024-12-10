import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", age: "", gender: "", profession: "" });
  const [isEditResponse,setIsEditResponse]=useState(false)
  const [isAddResponse,setIsAddResponse]=useState(false)



  const API_URL = "http://localhost:4008/api/users"; 

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Retrieve token from localStorage
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          throw new Error("Authorization token is missing. Please log in.");
        }

        // Make the API call with the token in the headers
        const response = await axios.get(`${API_URL}/getUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsEditResponse(false)
        setIsAddResponse(false)
        setUsers(response.data.users);
      } catch (error) {
        setError("Failed to fetch users. " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isEditResponse, isAddResponse]);

  // Add a new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.age || !newUser.gender || !newUser.profession) return alert("Please fill all fields!");
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(`${API_URL}/addUsers`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAddResponse(true)


      setUsers([...users, response.data.users]);
      setNewUser({ name: "", age: "", gender: "", profession: "" });
    } catch (err) {
      setIsAddResponse(false)

      setError("Failed to add user");
    }
  };

  // Edit a user
  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(`${API_URL}/updateUsers/${editingUser.id}`, editingUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditResponse(true)

      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? response.data.users : user
      );
  
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (err) {
      setIsEditResponse(false)
      setError("Failed to update user");
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`${API_URL}/deletUsers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (

    <div style={styles.container}>
      <h1 style={styles.header}>Users Management</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
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
      <td style={styles.td}>{user.id}</td>
      <td style={styles.td}>
        {editingUser && editingUser.id === user.id ? (
          <input
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            style={styles.input}
          />
        ) : (
          user.name
        )}
      </td>
      <td style={styles.td}>
        {editingUser && editingUser.id === user.id ? (
          <input
            value={editingUser.age}
            onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
            style={styles.input}
          />
        ) : (
          user.age
        )}
      </td>
      <td style={styles.td}>
        {editingUser && editingUser.id === user.id ? (
          <input
            value={editingUser.gender}
            onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}
            style={styles.input}
          />
        ) : (
          user.gender
        )}
      </td>
      <td style={styles.td}>
        {editingUser && editingUser.id === user.id ? (
          <input
            value={editingUser.profession}
            onChange={(e) => setEditingUser({ ...editingUser, profession: e.target.value })}
            style={styles.input}
          />
        ) : (
          user.profession
        )}
      </td>
      <td style={styles.td}>
        {editingUser && editingUser.id === user.id ? (
          <>
            <button onClick={handleSaveEdit} style={styles.saveButton}>Save</button>
            <button onClick={() => setEditingUser(null)} style={styles.cancelButton}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => handleEditUser(user.id)} style={styles.editButton}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteButton}>Delete</button>
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
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
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
          onChange={(e) => setNewUser({ ...newUser, profession: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleAddUser} style={styles.addButton}>Add User</button>
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
      backgroundColor: "#fff9c4",
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
