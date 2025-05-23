import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Add these imports at the top of your index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CustomNavbar from "./component/Navbar.jsx";
import HomePage from "./Pages/Home.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignUp.jsx";
import RegistrationForm from "./component/RegistrationForm.jsx";
// import "./App.css";

function App() {
  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationForm />} />
      </Routes>
    </>
  );
}

export default App;