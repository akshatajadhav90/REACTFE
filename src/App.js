import React from "react";
import LoginPage from "./views/login/login";
import SignupPage from "./views/signup/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./views/home/home";
import UsersPage from "./views/users/users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />

      </Routes>
    </Router>
  );
}

export default App;
