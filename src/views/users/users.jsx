import React, { useState, useEffect } from "react";
import axios from "axios";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClipLoader } from "react-spinners";


const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getApi, setGetApi] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const limit = 10;
  const [newUser, setNewUser] = useState({
    name: "",
    age: "",
    gender: "",
    profession: "",
  });
  const [isEditResponse, setIsEditResponse] = useState(false);
  const [isAddResponse, setIsAddResponse] = useState(false);
  const [showAgeErrorPopup, setShowAgeErrorPopup] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortBy: null,
    sortOrder: null,
  });

  const API_URL = "http://localhost:4008/api/users";

  useEffect(() => {
    if (!getApi) return; // Prevent unnecessary API calls

    const fetchUsers = async () => {
      try {
        // setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authorization token is missing.");

        const response = await axios.get(`${API_URL}/getUsers`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
            search: searchQuery,
            sortBy: sortConfig.sortBy,
            sortOrder: sortConfig.sortOrder,
          },
        });

        setTotalUsers(response.data.totalUsers);
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setIsEditResponse(false);
        setIsAddResponse(false);
        setGetApi(false);

        if (response?.data?.totalUsers === 0) {
          alert("No matching users found!");
        }
      } catch (error) {
        setError("Failed to fetch users: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isEditResponse, isAddResponse, page, limit, searchQuery, sortConfig]);

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
      setFilteredUsers([...users, response.data.users]);
      setNewUser({ name: "", age: "", gender: "", profession: "" });
      setShowAgeErrorPopup(false);
      setIsModalOpen(false);
      setGetApi(true);
    } catch (err) {
      setIsAddResponse(false);
      setError("Failed to add user");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setGetApi(true); // This will trigger `useEffect` and call API
  };

 

  const sortData = (sortBy) => {
    const sortOrder =
      sortConfig.sortBy === sortBy && sortConfig.sortOrder === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ sortBy, sortOrder });
    setGetApi(true); // This will trigger `useEffect` and call API
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
    // Close the dropdown
    setDropdownOpen(null);
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
      setFilteredUsers(updatedUsers);
      setEditingUser(null);
      setGetApi(true);
    } catch (err) {
      setIsEditResponse(false);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/deleteUsers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setGetApi(true);
      // Close the dropdown
      setDropdownOpen(null);
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const closeAgeErrorPopup = () => {
    setShowAgeErrorPopup(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentData = filteredUsers?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setGetApi(true); // Trigger API call on page change
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      setGetApi(true); // Trigger API call on page change
    }
  };

  const handleDropdownToggle = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId); // Toggle the dropdown visibility
  };

  if (loading) return <p>Loading...</p>;
  // if (loading) return <ClipLoader color="#3498db" size={40} />;

  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Users Management</h1>

      <div className="tableActions">
        <i
          className="fas fa-search"
          style={{ cursor: "pointer", fontSize: "20px", color: "#007bff" }}
        ></i>

        <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>
          Add User
        </button>

        <input
          type="text"
          placeholder="Search by any column..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            fontSize: "16px",
            padding: "5px",
            margin: "10px 0",
            marginTop: "50px",
            float: "right",
            border: "2px solid #555",
          }}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => setUsers(sortData("name"))}>
                Name{" "}
                {sortConfig.sortBy === "name"
                  ? sortConfig.sortOrder === "asc"
                    ? "↑↑"
                    : "↓↓"
                  : ""}
              </th>
              <th style={styles.th} onClick={() => setUsers(sortData("age"))}>
                Age{" "}
                {sortConfig.sortBy === "age"
                  ? sortConfig.sortOrder === "asc"
                    ? "↑↑"
                    : "↓↓"
                  : ""}
              </th>
              <th
                style={styles.th}
                onClick={() => setUsers(sortData("gender"))}
              >
                Gender{" "}
                {sortConfig.sortBy === "gender"
                  ? sortConfig.sortOrder === "asc"
                    ? "↑↑"
                    : "↓↓"
                  : ""}
              </th>
              <th
                style={styles.th}
                onClick={() => setUsers(sortData("profession"))}
              >
                Profession{" "}
                {sortConfig.sortBy === "profession"
                  ? sortConfig.sortOrder === "asc"
                    ? "↑↑"
                    : "↓↓"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((user) => (
              <tr key={user.id} style={styles.row}>
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
                      type="number"
                      value={editingUser.age}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, age: e.target.value })
                      }
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
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          gender: e.target.value,
                        })
                      }
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

                {/* Conditionally display Save Button */}
                {editingUser && editingUser.id === user.id && (
                  <td style={styles.td}>
                    <button
                      onClick={() => handleSaveEdit(user.id)} // Save the entire row
                      style={styles.saveButton}
                    >
                      Save
                    </button>
                  </td>
                )}

                {/* Dots button and dropdown placed inside the table row */}
                <td style={styles.dotsContainer}>
                  <button
                    onClick={() => handleDropdownToggle(user.id)}
                    style={styles.dotsButton}
                  >
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                  </button>
                  {/* Dropdown Menu */}
                  {dropdownOpen === user.id && (
                    <div style={{ ...styles.dropdownMenu, left: "1350px" }}>
                      <p onClick={() => handleEditUser(user.id)}>Edit</p>
                      <p onClick={() => handleDeleteUser(user.id)}>Delete</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup message */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {showAgeErrorPopup && (
          <div style={styles.popup}> Please enter a valid age! </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={styles.paginationButton}>
        <button
          onClick={handlePrev}
          style={{
            backgroundColor: "#479f76",
          }}
          disabled={page === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>
          {" "}
          {page} of {totalPages}{" "}
        </span>
        <button
          onClick={handleNext}
          style={{
            backgroundColor: "#479f76",
          }}
          disabled={page === totalPages}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Add new user popup */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
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
              onChange={(e) =>
                setNewUser({ ...newUser, gender: e.target.value })
              }
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
            <button
              onClick={() => setIsModalOpen(false)}
              style={styles.cancelAddButton}
            >
              Close
            </button>
          </div>
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
    color: "#160d27",
  },
  table: {
    marginTop: "100px",
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #999",
  },
  th: {
    border: "1px solid #999",
    padding: "8px",
    borderRight: "1px solid #000",
    backgroundColor: "#479f76",
  },
  row: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "8px",
    border: "1px solid #999",
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

  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "2px solid #999",
    padding: "5px 10px",
    marginTop: "50px",
    cursor: "pointer",
    float: "left",
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
    marginLeft: "100px",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    marginLeft: "70px",
  },

  paginationButton: {
    float: "right",
    marginTop: "15px",
  },

  addUser: {
    marginTop: "20px",
  },
  addUserHeader: {
    marginBottom: "10px",
    color: "#333",
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
  popup: {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
    fontSize: "16px",
    fontWeight: "bold",
    zIndex: 1000,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(115, 120, 121, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#f0f8ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(59, 84, 106, 0.1)",
    width: "400px",
    textAlign: "center",
  },
  cancelAddButton: {
    marginTop: "50px",
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #999",
    cursor: "pointer",
    float: "right",
  },
  dotsButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "20px", 
    marginLeft: "5px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "20%",
    backgroundColor: "#333", 
    margin: "2px 0",
  },
  dropdownMenu: {
    position: "absolute",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "5px 10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column", 
    zIndex: 1000, 
  },
  dotsContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "1px",
  },

  dotWrapper: {
    marginBottom: "10px", 
  },
};

export default UsersPage;
