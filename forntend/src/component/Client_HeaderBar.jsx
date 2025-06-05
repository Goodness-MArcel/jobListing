import React from "react";

const Client_HeaderBar = ({ userName }) => (
  <div className="bg-white shadow-sm border-bottom sticky-top">
    <div className="container-fluid px-4">
      <div className="row py-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="me-4">
                <h3 className="mb-0 text-nowrap"  style={{color: 'green'}}>
                  <i className="fas fa-tachometer-alt me-2" style={{color: 'green'}}></i>
                  Client Dashboard
                </h3>
                <small className="fw-bold">Manage your projects and freelancers</small>
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              {/* Notifications */}
              <div className="dropdown me-3">
                <button className="btn btn-outline-secondary position-relative" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-bell"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                    3
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><h6 className="dropdown-header">Notifications</h6></li>
                  <li><a className="dropdown-item" href="#"><small>New bid received</small></a></li>
                  <li><a className="dropdown-item" href="#"><small>Project deadline approaching</small></a></li>
                  <li><a className="dropdown-item" href="#"><small>Payment completed</small></a></li>
                </ul>
              </div>

              {/* User Profile */}
              <div className="dropdown d-none d-md-block">
                <button className="btn btn-link text-decoration-none d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                  <div className="me-3 text-end">
                    <div className="fw-semibold text-dark">{userName}</div>
                    <small className="text-muted">Client</small>
                  </div>
                  <img
                    src="https://via.placeholder.com/45"
                    alt="Profile"
                    className="rounded-circle border d-none d-md-block"
                    width="45"
                    height="45"
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#"><i className="fas fa-user me-2"></i>Profile</a></li>
                  <li><a className="dropdown-item" href="#"><i className="fas fa-cog me-2"></i>Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#"><i className="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Client_HeaderBar;