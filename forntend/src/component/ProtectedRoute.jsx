import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/verify', { 
          withCredentials: true 
        });
        
        if (response.data.status === 'success') {
          setIsAuthenticated(true);
          setUser(response.data.data);
          // Store user data in localStorage for easy access
          localStorage.setItem('user', JSON.stringify(response.data.data));
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        setIsAuthenticated(false);
        // Clear any existing user data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Pass user data to child components via context or props
  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;