import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_URL = "http://localhost:4008/api/auth"; // Replace with your API base URL

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // Basic client-side validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      setSuccess("");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format!");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setSuccess("");
      return;
    }

    try {
      setError(""); // Clear previous errors

      // Send API request
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });

      // Handle successful signup
      setSuccess("Signup Successful!");
      console.log("User Signed Up:", response.data);
      navigate("/login");

      // Clear form fields
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      // Handle API errors
      const errorMessage =
        err.response?.data?.message || "An error occurred during signup.";
      setError(errorMessage);
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style = {styles.title}>Signup</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <div style={styles.field}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your username"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/2016/08/Nature-wallpapers-Full-HD-backgroud.jpg')", // Replace with your image path
    backgroundSize: "cover", // Ensures the image covers the entire container
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat",
    backgroundColor: "#f0f2f5",
  },
  form: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  field: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center", 
    margin: 0,
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  success: {
    color: "green",
    marginBottom: "15px",
  },
};

export default SignupPage;
