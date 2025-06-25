import { useState } from "react";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Footer from "../component/Footer.jsx";
import CustomNavbar from "../component/Navbar.jsx";
import '../styles/login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const clearAllTokens = () => {
    console.log('🧹 Clearing all existing tokens...');
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear cookies by setting them to expire
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.onrender.com;';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('✅ All tokens cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    console.log('🔐 Login form submitted');

    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError("");
    setSuccess("");
    setValidated(true);
    setIsLoading(true);

    try {
      // Clear any existing invalid tokens first
      clearAllTokens();

      console.log('📡 Sending login request...');
      
      const response = await axios.post(
        "https://joblisting-backend-m2wa.onrender.com/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('✅ Login response received:', response.status);
      console.log('Response data:', response.data);

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        
        console.log('👤 User data received:', {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          isVerified: userData.isVerified
        });

        // Store user data (without sensitive info)
        const safeUserData = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          bio: userData.bio,
          skills: userData.skills,
          isVerified: userData.isVerified,
          profileImageUrl: userData.profileImageUrl,
          phone: userData.phone
        };
        
        localStorage.setItem("user", JSON.stringify(safeUserData));
        
        // Store token for API calls (fallback if cookies don't work)
        if (userData.token) {
          localStorage.setItem("token", userData.token);
          console.log('🔐 Token stored in localStorage');
        }

        setSuccess("Login successful! Redirecting...");
        
        // Small delay to show success message
        setTimeout(() => {
          const redirectPath = userData.role === "client" 
            ? "/client-dashboard" 
            : "/freelancer-dashboard";
          
          console.log('🚀 Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 1000);

      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Clear any stored data on error
      clearAllTokens();
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection and try again.";
      } else if (err.response) {
        // Server responded with error
        console.log('Server error response:', err.response.data);
        
        switch (err.response.status) {
          case 400:
            errorMessage = "Please check your email and password format.";
            break;
          case 401:
            errorMessage = "Invalid email or password.";
            break;
          case 403:
            errorMessage = "Please verify your email first.";
            // Navigate to verification page
            setTimeout(() => {
              navigate('/verify-email', { 
                state: { email: formData.email },
                replace: true 
              });
            }, 2000);
            break;
          case 429:
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || "Login failed. Please try again.";
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 login-container">
        <div className="mx-auto form" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4 header">Log In</h2>

          {error && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setError("")}>
              <strong>Error:</strong> {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              <strong>Success:</strong> {success}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  disabled={isLoading}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    borderLeft: "none",
                    backgroundColor: "transparent",
                    borderColor: "#ced4da",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters long.
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="success"
              type="submit" 
              className="w-100 mb-3 login-button"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>

            <div className="text-center">
              <p className="mb-1">
                Don't have an account? <a href="/signup" className="text-decoration-none">Sign up here</a>
              </p>
              <p className="mb-0">
                <a href="/forgot-password" className="text-decoration-none">Forgot your password?</a>
              </p>
            </div>
          </Form>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default LoginPage;
