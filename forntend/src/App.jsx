import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProtectedRoute from "./component/ProtectedRoute.jsx";

// Lazy-loaded components
const HomePage = lazy(() => import("./Pages/Home.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));
const EmailVerificationPage = lazy(() => import("./Pages/EmailVerificationPage.jsx"));
const ResendVerificationPage = lazy(() => import("./Pages/ResendVerificationPage.jsx"));
const ClientDashboard = lazy(() => import("./Pages/ClientDashboard.jsx"));
// const FreelancerDashboard = lazy(() => import("./Pages/FreelancerDashboard.jsx"));
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
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            {/* <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} /> */}
          </Route>
          
          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;