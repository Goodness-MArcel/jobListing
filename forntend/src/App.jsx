
import { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Add these imports at the top of your index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CustomNavbar from "./component/Navbar.jsx";


const HomePage = lazy(() => import("./Pages/Home.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));
const EmailVerificationPage = lazy(()=> import("./Pages/EmailVerificationPage.jsx"));
const ResendVerificationPage = lazy((() => import("./Pages/ResendVerificationPage.jsx")))
const ClientDashboard = lazy(() => import("./Pages/ClientDashboard.jsx"));
// import RegistrationSuccess from "./component/RegistrationSuccessPage.jsx";
const RegistrationSuccessPage = lazy(() => import("./component/RegistrationSuccessPage.jsx"));
const RegistrationForm = lazy(() => import("./component/RegistrationForm.jsx"));
// Loading component
// anoter
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
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;