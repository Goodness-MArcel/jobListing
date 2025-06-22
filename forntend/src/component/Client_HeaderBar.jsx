import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ClientProfileModal from "./ClientProfileModal";

const Client_HeaderBar = ({
  userName,
  userEmail,
  onLogout,
  clientData,
  onUpdateProfile,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  console.log("clientId", clientData.id);
  const handleViewProfile = () => {
    setShowProfileModal(true);
  };
  console.log("loggin client info", clientData);
  const handleCloseProfile = () => {
    setShowProfileModal(false);
  };

  const handleUpdateProfile = async (formData) => {
    try {
      console.log("=== SENDING UPDATE REQUEST ===");

      // Debug: Log what we're sending
      console.log("FormData being sent:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await fetch(
        `/api/client/profile?client_id=${clientData.id}`,
        {
          method: "PUT",
          credentials: "include", // Ensures cookies are sent
          body: formData, // Don't set Content-Type header for FormData - let browser handle it
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      console.log("Success response:", updatedProfile);

      if (onUpdateProfile) {
        await onUpdateProfile(updatedProfile.data); // Update parent component with the data
      }

      setShowProfileModal(false);
      return updatedProfile.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error; // Let the modal handle the error
    }
  };

  return (
    <>
      <div className="bg-white shadow-sm border-bottom sticky-top">
        <div className="container-fluid px-4">
          <div className="row py-3">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <h3 className="mb-0 text-nowrap" style={{ color: "green" }}>
                      <i
                        className="fas fa-tachometer-alt me-2"
                        style={{ color: "green" }}
                      ></i>
                      Client Dashboard
                    </h3>
                    <small className="fw-bold">
                      Manage your projects and freelancers
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  {/* Notifications */}
                  <div className="dropdown me-3">
                    <button
                      className="btn btn-outline-secondary position-relative"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-bell"></i>
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        3
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <h6 className="dropdown-header">Notifications</h6>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <small>New bid received</small>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <small>Project deadline approaching</small>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <small>Payment completed</small>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* User Profile */}
                  <div className="dropdown d-none d-md-block">
                    <button
                      className="btn btn-link text-decoration-none d-flex align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <div className="me-3 text-end">
                        <div className="fw-semibold text-dark">
                          {userName || "Client User"}
                        </div>
                        <small className="text-muted">
                          {clientData.email || "Client"}
                        </small>
                      </div>
                      <div className="position-relative">
                        {/* User Avatar with Initials */}
                        <div
                          className="rounded-circle border d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: "45px",
                            height: "45px",
                            fontSize: "16px",
                            backgroundColor: "green",
                          }}
                        >
                          {clientData?.profileImageUrl ? (
                            <img
                              src={clientData.profileImageUrl}
                              alt="Pro"
                              className="w-100 h-100 rounded-circle"
                              style={{ objectFit: "cover" }}
                                crossOrigin="anonymous"
                            />
                          ) : userName ? (
                            userName
                              .split(" ")
                              .map((name) => name.charAt(0))
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()
                          ) : (
                            "CU"
                          )}
                        </div>
                        {/* Online Status Indicator */}
                        <span
                          className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                          style={{ width: "12px", height: "12px" }}
                        ></span>
                      </div>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <div className="dropdown-item-text">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 overflow-hidden"
                              style={{
                                width: "40px",
                                height: "40px",
                                fontSize: "14px",
                                backgroundColor: "green",
                              }}
                            >
                              {clientData?.profileImageUrl ? (
                                <img
                                  src={clientData.profileImageUrl}
                                  alt="Profile"
                                  className="w-100 h-100"
                                  style={{ objectFit: "cover" }}
                                  crossOrigin="true"
                                />
                              ) : userName ? (
                                userName
                                  .split(" ")
                                  .map((name) => name.charAt(0))
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()
                              ) : (
                                "CU"
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold">
                                {userName || "Client User"}
                              </div>
                              <small className="text-muted">
                                {userEmail || "client@example.com"}
                              </small>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleViewProfile}
                          style={{
                            border: "none",
                            background: "none",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <i className="fas fa-user me-2"></i>View Profile
                        </button>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#settings">
                          <i className="fas fa-cog me-2"></i>Account Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#billing">
                          <i className="fas fa-credit-card me-2"></i>Billing &
                          Payments
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#help">
                          <i className="fas fa-question-circle me-2"></i>Help &
                          Support
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={onLogout}
                          style={{
                            cursor: "pointer",
                            border: "none",
                            backgroundColor: "transparent",
                            width: "100%",
                            textAlign: "left",
                            fontWeight: "bold",
                          }}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>Logout
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Mobile User Menu */}
                  <div className="dropdown d-md-none">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-user"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <div className="dropdown-item-text">
                          <div className="fw-semibold">
                            {clientData.firstName + " " + clientData.lastName ||
                              "Client User"}
                          </div>
                          <small className="text-muted">
                            {userEmail || "client@example.com"}
                          </small>
                        </div>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleViewProfile}
                          style={{
                            border: "none",
                            background: "none",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <i className="fas fa-user me-2"></i>Profile
                        </button>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#settings">
                          <i className="fas fa-cog me-2"></i>Settings
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={onLogout}
                          style={{
                            cursor: "pointer",
                            border: "none",
                            background: "none",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ClientProfileModal
        show={showProfileModal}
        onHide={handleCloseProfile}
        clientData={clientData}
        onUpdateProfile={handleUpdateProfile}
      />
    </>
  );
};

export default Client_HeaderBar;
