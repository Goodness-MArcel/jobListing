import React, { useState, useEffect } from "react";

const ClientProfileModal = ({ show, onHide, clientData, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    bio: "",
    website: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clientData) {
      setProfileData({
        name: clientData.firstName +" "+ clientData.lastName || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        company: clientData.company || "",
        location: clientData.location || "",
        bio: clientData.bio || "",
        website: clientData.website || "",
        profileImageUrl: clientData.profileImageUrl || null,
      });
      setImagePreview(clientData.profileImageUrl || null);
    }
  }, [clientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size should be less than 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please select a valid image file",
        }));
        return;
      }

      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (profileData.website && !profileData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      // Append all profile data
      Object.keys(profileData).forEach((key) => {
        if (key === "profileImage" && profileData[key]) {
          formData.append("profileImage", profileData[key]);
        } else if (key !== "profileImage") {
          formData.append(key, profileData[key]);
        }
      });

      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to original data
    if (clientData) {
      setProfileData({
        name: clientData.firstName || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        company: clientData.company || "",
        location: clientData.location || "",
        bio: clientData.bio || "",
        website: clientData.website || "",
        profileImageUrl: null,
      });
      setImagePreview(clientData.profileImageUrl || null);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fas fa-user-circle me-2"></i>
              {isEditing ? "Edit Profile" : "My Profile"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          <div className="modal-body">
            {/* Profile Image Section */}
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <div
                  className="rounded-circle border d-flex align-items-center justify-content-center overflow-hidden"
                  style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#f8f9fa",
                    border: "5px solid green",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      crossOrigin="true"
                    />
                  ) : (
                    <div className="text-muted" style={{ fontSize: "48px" }}>
                      {profileData.name
                        ? profileData.name
                            .split(" ")
                            .map((name) => name.charAt(0))
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "CU"}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="position-absolute bottom-0 end-0">
                    <label
                      htmlFor="profileImageInput"
                      className="btn btn-sm btn-primary rounded-circle"
                    >
                      <i className="fas fa-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="profileImageInput"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
              {errors.profileImage && (
                <div className="text-danger small mt-1">
                  {errors.profileImage}
                </div>
              )}
            </div>

            {/* Profile Form */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Full Name <span className="text-danger">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {profileData.name.toLowerCase() || "Not provided"}
                  </div>
                )}
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  Email Address <span className="text-danger">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {profileData.email || "Not provided"}
                  </div>
                )}
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {clientData.phone || "Not provided"}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-building me-2 text-primary"></i>
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {profileData.company || "Not provided"}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {profileData.location || "Not provided"}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-globe me-2 text-primary"></i>
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    className={`form-control ${
                      errors.website ? "is-invalid" : ""
                    }`}
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    placeholder="https://your-website.com"
                  />
                ) : (
                  <div className="form-control-plaintext border rounded px-3 py-2 bg-light">
                    {profileData.website ? (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profileData.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
                {errors.website && (
                  <div className="invalid-feedback">{errors.website}</div>
                )}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your business..."
                  />
                ) : (
                  <div
                    className="form-control-plaintext border rounded px-3 py-2 bg-light"
                    style={{ minHeight: "100px" }}
                  >
                    {profileData.bio || "No bio provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  <i className="fas fa-times me-2"></i>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileModal;
