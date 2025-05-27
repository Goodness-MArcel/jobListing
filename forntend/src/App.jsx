
import { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Add these imports at the top of your index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CustomNavbar from "./component/Navbar.jsx";
// import HomePage from "./Pages/Home.jsx";
// import LoginPage from "./Pages/LoginPage.jsx";
// import RegistrationForm from "./component/RegistrationForm.jsx";
// import "./App.css";


const HomePage = lazy(() => import("./Pages/Home.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));
// import RegistrationSuccess from "./component/RegistrationSuccessPage.jsx";
const RegistrationSuccessPage = lazy(() => import("./component/RegistrationSuccessPage.jsx"));
const RegistrationForm = lazy(() => import("./component/RegistrationForm.jsx"));
// Loading component
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <>
      {/* <CustomNavbar /> */}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;