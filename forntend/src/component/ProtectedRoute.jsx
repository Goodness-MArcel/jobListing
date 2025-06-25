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
        console.log('🔍 ProtectedRoute: Starting authentication verification...');

        // Check if user data exists in localStorage first
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('📦 Stored user data exists:', !!storedUser);
        console.log('🔐 Stored token exists:', !!storedToken);

        // Prepare request config
        const config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        };

        // Add token to header if available (fallback)
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
          console.log('🔐 Added token to Authorization header');
        }

        console.log('📡 Making verification request...');
        
        // Use production URL - FIXED
        const response = await axios.get(
          'https://joblisting-backend-m2wa.onrender.com/api/auth/verify', 
          config
        );
        
        console.log('✅ Verification response received:', response.status);
        console.log('Response data:', response.data);

        // Check response format - FIXED
        if (response.data.success === true && response.data.user) {
          console.log('✅ Authentication verified successfully');
          
          setIsAuthenticated(true);
          setUser(response.data.user);
          
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('💾 User data updated in localStorage');
          
        } else {
          console.log('❌ Invalid response format:', response.data);
          throw new Error('Invalid response format from server');
        }
        
      } catch (err) {
        console.error('❌ Auth verification failed:', err);
        
        // Log specific error details
        if (err.response) {
          console.log('Server error status:', err.response.status);
          console.log('Server error data:', err.response.data);
        } else if (err.request) {
          console.log('Network error - no response received');
        } else {
          console.log('Request setup error:', err.message);
        }
        
        setIsAuthenticated(false);
        setUser(null);
        
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Clear cookies
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        console.log('🧹 Cleared invalid authentication data');
        
      } finally {
        setLoading(false);
        console.log('🏁 Authentication verification completed');
      }
    };

    verifyAuth();
  }, []);

  // Show loading spinner
  if (loading) {
    console.log('⏳ ProtectedRoute: Showing loading state');
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Verifying authentication...</span>
          </div>
          <p className="text-muted">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  console.log('✅ ProtectedRoute: User authenticated, rendering protected content');
  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;