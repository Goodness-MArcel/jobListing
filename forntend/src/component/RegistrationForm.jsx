// src/components/RegistrationForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistrationForm.css";

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

  const [showFullForm, setShowFullForm] = useState(false);
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

  const handleContinue = (e) => {
    e.preventDefault();
    if (formData.role) {
      setShowFullForm(true);
    }
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
      const response = await axios.post("/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.role === "freelancer" ? formData.bio : undefined,
        skills: formData.role === "freelancer" ? formData.skills : undefined,
      });

      navigate(
        formData.role === "client"
          ? "/client-dashboard"
          : "/freelancer-dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

    <div className="registration-container">
      <h2>Create Your Account</h2>
      {error && <div className="error-message">{error}</div>}

      {!showFullForm ? (
        <form onSubmit={handleContinue}>
          <div className="form-group">
            <p className="joinAS">Join as a client or freelancer</p>
            <div className="role-selection">
              <div className="right">
                <label>
                  Client  (I want to hire freelancers)
                </label>
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
                <label>
                  
                  Freelancer (I want to find work)
                </label>
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
          <button type="submit" className={formData.role ? "btn" : ''} disabled={!formData.role}>
            {getActionButtonText()}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
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

          {formData.role === "freelancer" && (
            <>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your skills and experience"
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
                />
              </div>
            </>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : formData.role === "client"
              ? "Complete Client Registration"
              : "Complete Freelancer Application"}
          </button>
        </form>
      )}
      <p className="have_Account">Alredy have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default RegistrationForm;
