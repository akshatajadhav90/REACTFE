import { useNavigate } from "react-router-dom";
import React from "react";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to Our Platform</h1>
                <p style={styles.subtitle}>Choose an option to get started:</p>

                <div style={styles.buttonGroup}>
                    <button
                        onClick={() => navigate("/login")}
                        style={styles.button}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        style={styles.button}
                    >
                        SignUp
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/2016/07/Wallpapers-pexels-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    },
    content: {
        textAlign: "center",
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        margin: "0 0 20px",
        color: "#333",
    },
    subtitle: {
        fontSize: "18px",
        margin: "0 0 30px",
        color: "#555",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#007BFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
};

export default HomePage;
