import React, { useState } from "react";
import '../styles/Client_ProjectForm.css';

const Client_ProjectForm = ({userId}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectBudget: '',
    projectDeadline: '',
    projectCategory: '',
    projectDescription: '', 
    projectSkills: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Convert skills string to array
  const skillsArray = formData.projectSkills
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);

  const projectData = {
    title: formData.projectTitle,
    description: formData.projectDescription,
    budget: parseFloat(formData.projectBudget),
    deadline: new Date(formData.projectDeadline),
    category: formData.projectCategory,
    skillsRequired: skillsArray,
    status: 'published', // or 'published' depending on which button was clicked
    // client_id should come from your auth system
  };

  try {
    const response = await fetch(`http://localhost:3000/api/projects/add-project?client_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    const result = await response.json();
      setAlert({ show: true, message: 'Project created successfully!', type: 'success' });
    console.log('Project created:', result);
    // Reset form or redirect
    setFormData({
      projectTitle: '',
      projectBudget: '',
      projectDeadline: '',
      projectCategory: '',
      projectDescription: '',
      projectSkills: ''
    });

  } catch (error) {
    console.error('Error submitting project:', error);
    // Handle error (show message to user)
    setAlert({ show: true, message: 'Error submitting project. Please try again.', type: 'danger' });
  }
};
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
              style={{ transition: 'transform 0.3s ease' , transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' , color: isExpanded ? '#ffc107' : 'green',width: '30px' }}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

         {alert.show && (
          <div className={`alert alert-${alert.type} m-3`} role="alert">
            {alert.message}
            <button className="btn-close" aria-label="close"></button>
          </div>
        )}
        
        {isExpanded && (
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
                    onChange={handleInputChange}
                    value={formData.projectTitle}
                    name="projectTitle"
                    placeholder="Enter a clear, descriptive project title"
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
                      value={formData.projectBudget}
                      onChange={handleInputChange}
                      name="projectBudget"
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
                    value={formData.projectDeadline}
                    name="projectDeadline"
                    id="projectDeadline"
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="projectCategory" className="form-label fw-semibold">
                    <i className="fas fa-tags me-1 text-info"></i>
                    Category *
                  </label>
                  <select className="form-select" id="projectCategory" name="projectCategory" value={formData.projectCategory} onChange={handleInputChange}>
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
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    name="projectDescription"
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
                    name="projectSkills"
                    value={formData.projectSkills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Node.js, MongoDB, UI/UX Design"
                  />
                  <div className="form-text">
                    <i className="fas fa-lightbulb me-1"></i>
                    Separate skills with commas
                  </div>
                </div>
              </div>
              
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
                <div className="text-muted">
                  <small className="text-nowrap">
                    <i className="fas fa-shield-alt me-1"></i>
                    Your project will be reviewed before publishing
                  </small>
                </div>
                <div className="d-flex  flex-sm-row gap-2">
                  <button type="button" className="btn btn-outline-secondary text-nowrap">
                    <i className="fas fa-save me-2"></i>
                    Save Draft
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg text-nowrap">
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
