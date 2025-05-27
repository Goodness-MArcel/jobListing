// src/components/RegistrationForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Footer from "./Footer.jsx";
import axios from "axios";
import "./RegistrationForm.css";
import CustomNavbar from "./Navbar.jsx";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Start with no role selected
    bio: "",
    skills: [],
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: role, 2: main form, 3: freelancer specific
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && formData.role) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.role === "freelancer") {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.role === "freelancer" ? formData.bio : undefined,
        skills: formData.role === "freelancer" ? formData.skills : undefined,
      });

      // Navigate to success page with email parameter
    navigate(`/registration-success?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtonText = () => {
    if (!formData.role) return "Create Account";
    return formData.role === "client"
      ? "Join as Client"
      : "Apply as Freelancer";
  };

  return (
    <>
    <CustomNavbar />
    <div className="registration-container">
      <h2>Create Your Account</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Step 1: Role Selection */}
      {currentStep === 1 && (
        <form onSubmit={handleNext}>
          <div className="form-group">
            <p className="joinAS">Join as a client or freelancer</p>
            <div className="role-selection">
              <div className="right">
                <label>Client (I want to hire freelancers)</label>
                <div className="upper">
                  ✅
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === "client"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="right">
                <label>Freelancer (I want to find work)</label>
                <div className="upper">
                  😊
                  <input
                    type="radio"
                    name="role"
                    value="freelancer"
                    checked={formData.role === "freelancer"}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={formData.role ? "btn" : ""}
            disabled={!formData.role}
          >
            {getActionButtonText()}
          </button>
        </form>
      )}

      {/* Step 2: Main Registration Form */}
      {currentStep === 2 && (
        <form
          onSubmit={formData.role === "freelancer" ? handleNext : handleSubmit}
        >
          <div className="grid-first">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            {/* <button type="button" onClick={handleBack} className="secondary">
              Back
            </button> */}
            <button
              type="button"
              onClick={handleBack}
              className="secondary back-button"
            >
              <FaArrowLeft className="back-icon" /> Back
            </button>
            <button type="submit">
              {formData.role === "client" ? "Complete Registration" : "Next"}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Freelancer Specific Fields */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your skills and experience"
              required
            />
          </div>

          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={handleSkillChange}
              placeholder="e.g., JavaScript, React, Node.js"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleBack}
              className="secondary back-button"
            >
              <FaArrowLeft className="back-icon" /> Back
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Complete Application"}
            </button>
          </div>
        </form>
      )}

      <p className="have_Account">
        Already have an account? <Link to='/login'>login</Link>
      </p>
    </div>
    <Footer />
    </>
  );
};

export default RegistrationForm;
