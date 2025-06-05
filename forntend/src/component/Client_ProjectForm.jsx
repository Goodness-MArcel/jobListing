import React, { useState } from "react";
import '../styles/Client_ProjectForm.css';

const Client_ProjectForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="client-project-form mt-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-gradient text-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold  " style={{color: 'green'}}>
              <i className="fas fa-plus-circle me-2"></i>
              Post New Project
            </h5>
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ transition: 'transform 0.3s ease' , transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' , color: isExpanded ? '#ffc107' : 'green' }}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="card-body p-4 col-sm-12 col-md-10 col-lg-8 mx-auto">
            <form>
              <div className="row g-3 ">
                <div className="col-12">
                  <label htmlFor="projectTitle" className="form-label fw-semibold">
                    <i className="fas fa-heading me-1 text-primary"></i>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="projectTitle"
                    placeholder="Enter a clear, descriptive project title"
                    value="kspjsp"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="projectBudget" className="form-label fw-semibold">
                    <i className="fas fa-dollar-sign me-1 text-success"></i>
                    Budget (USD) *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="projectBudget"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="projectDeadline" className="form-label fw-semibold">
                    <i className="fas fa-calendar-alt me-1 text-warning"></i>
                    Deadline *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="projectDeadline"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="projectCategory" className="form-label fw-semibold">
                    <i className="fas fa-tags me-1 text-info"></i>
                    Category *
                  </label>
                  <select className="form-select" id="projectCategory">
                    <option value="">Select a category</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="design">Design & Creative</option>
                    <option value="writing">Writing & Content</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="data">Data & Analytics</option>
                  </select>
                </div>
                
                <div className="col-12">
                  <label htmlFor="projectDescription" className="form-label fw-semibold">
                    <i className="fas fa-align-left me-1 text-secondary"></i>
                    Project Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="projectDescription"
                    rows="5"
                    placeholder="Provide a detailed description of your project requirements, goals, and expectations..."
                  ></textarea>
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Be specific about your requirements to attract the right freelancers
                  </div>
                </div>
                
                <div className="col-12">
                  <label htmlFor="projectSkills" className="form-label fw-semibold">
                    <i className="fas fa-code me-1 text-primary"></i>
                    Required Skills *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectSkills"
                    placeholder="e.g., React, Node.js, MongoDB, UI/UX Design"
                  />
                  <div className="form-text">
                    <i className="fas fa-lightbulb me-1"></i>
                    Separate skills with commas
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <div className="text-muted">
                  <small>
                    <i className="fas fa-shield-alt me-1"></i>
                    Your project will be reviewed before publishing
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary">
                    <i className="fas fa-save me-2"></i>
                    Save Draft
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="fas fa-paper-plane me-2"></i>
                    Post Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Client_ProjectForm;
