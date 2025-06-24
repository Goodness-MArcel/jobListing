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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError("");
    setValidated(true);

    try {
      setIsLoading(true);
      
      // Make login request with credentials - Fixed URL
      const response = await axios.post(
        "https://joblisting-backend-m2wa.onrender.com/api/auth/login", // Fixed port number
        {
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true, // Essential for cookies
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store user data in localStorage (without sensitive info)
      if (response.data.data) {
        const userData = response.data.data;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Redirect based on role
      const redirectPath = response.data.data?.role === "client" 
        ? "/client-dashboard" 
        : "/freelancer-dashboard";
      
      navigate(redirectPath);
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else if (err.response.status === 403) {
          setError("Please verify your email first");
          navigate('/verify-email', { state: { email: formData.email } });
        } else {
          setError(err.response.data?.message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred");
      }
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
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
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
                Password must be at least 6 characters.
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="success"
              type="submit" 
              className="w-100 mb-3 login-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <div className="text-center">
              <p className="mb-1">
                Don't have an account? <a href="/signup">Sign up</a>
              </p>
              <p className="mb-0">
                <a href="/forgot-password">Forgot your password?</a>
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
