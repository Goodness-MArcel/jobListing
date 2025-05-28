import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientDashboard = () => {
  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row bg-primary text-white py-3 mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Client Dashboard</h2>
            <div className="d-flex align-items-center">
              <span className="me-3">Welcome, John Doe</span>
              <img 
                src="https://via.placeholder.com/40" 
                alt="Profile" 
                className="rounded-circle"
                width="40"
                height="40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Sidebar - Project Management */}
        <div className="col-lg-8">
          {/* Post New Project Section */}
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Post New Project
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label htmlFor="projectTitle" className="form-label">Project Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="projectTitle"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="projectBudget" className="form-label">Budget ($)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="projectBudget"
                      placeholder="Enter budget"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="projectDeadline" className="form-label">Deadline</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="projectDeadline"
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="projectDescription" className="form-label">Project Description</label>
                    <textarea 
                      className="form-control" 
                      id="projectDescription"
                      rows="4"
                      placeholder="Describe your project requirements..."
                    ></textarea>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label htmlFor="projectSkills" className="form-label">Required Skills</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="projectSkills"
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-paper-plane me-2"></i>
                  Post Project
                </button>
              </form>
            </div>
          </div>

          {/* My Projects Section */}
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-project-diagram me-2"></i>
                My Projects
              </h5>
            </div>
            <div className="card-body">
              {/* Project Item 1 */}
              <div className="border rounded p-3 mb-3">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="text-primary">E-commerce Website Development</h6>
                    <p className="text-muted mb-2">
                      Need a full-stack developer to build a modern e-commerce platform with payment integration...
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge bg-secondary">React</span>
                      <span className="badge bg-secondary">Node.js</span>
                      <span className="badge bg-secondary">MongoDB</span>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="mb-2">
                      <strong className="text-success">$2,500</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Deadline: Dec 15, 2024</small>
                    </div>
                    <span className="badge bg-warning">5 Bids</span>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary">View Bids</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
              </div>

              {/* Project Item 2 */}
              <div className="border rounded p-3 mb-3">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="text-primary">Mobile App UI/UX Design</h6>
                    <p className="text-muted mb-2">
                      Looking for a creative designer to create modern UI/UX for a fitness mobile app...
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge bg-secondary">Figma</span>
                      <span className="badge bg-secondary">UI/UX</span>
                      <span className="badge bg-secondary">Mobile Design</span>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="mb-2">
                      <strong className="text-success">$800</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Deadline: Nov 30, 2024</small>
                    </div>
                    <span className="badge bg-success">In Progress</span>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary">View Progress</button>
                  <button className="btn btn-sm btn-outline-info">Contact Freelancer</button>
                </div>
              </div>

              {/* Project Item 3 */}
              <div className="border rounded p-3 mb-3">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="text-primary">Content Writing for Blog</h6>
                    <p className="text-muted mb-2">
                      Need 10 high-quality blog posts about digital marketing trends...
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge bg-secondary">Content Writing</span>
                      <span className="badge bg-secondary">SEO</span>
                      <span className="badge bg-secondary">Marketing</span>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="mb-2">
                      <strong className="text-success">$500</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Deadline: Dec 1, 2024</small>
                    </div>
                    <span className="badge bg-primary">3 Bids</span>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary">View Bids</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat Section */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                Messages
              </h5>
            </div>
            
            {/* Chat Contacts */}
            <div className="card-body p-0" style={{height: '600px'}}>
              <div className="list-group list-group-flush" style={{height: '200px', overflowY: 'auto'}}>
                {/* Contact 1 */}
                <div className="list-group-item list-group-item-action">
                  <div className="d-flex align-items-center">
                    <img 
                      src="https://via.placeholder.com/40" 
                      alt="Freelancer" 
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Sarah Johnson</h6>
                      <small className="text-muted">UI/UX Designer</small>
                    </div>
                    <span className="badge bg-success rounded-pill">2</span>
                  </div>
                </div>

                {/* Contact 2 */}
                <div className="list-group-item list-group-item-action active">
                  <div className="d-flex align-items-center">
                    <img 
                      src="https://via.placeholder.com/40" 
                      alt="Freelancer" 
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Mike Chen</h6>
                      <small className="text-muted">Full Stack Developer</small>
                    </div>
                  </div>
                </div>

                {/* Contact 3 */}
                <div className="list-group-item list-group-item-action">
                  <div className="d-flex align-items-center">
                    <img 
                      src="https://via.placeholder.com/40" 
                      alt="Freelancer" 
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Emma Wilson</h6>
                      <small className="text-muted">Content Writer</small>
                    </div>
                    <span className="badge bg-success rounded-pill">1</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="border-top p-3" style={{height: '300px', overflowY: 'auto'}}>
                <div className="mb-3">
                  <div className="d-flex">
                    <img 
                      src="https://via.placeholder.com/30" 
                      alt="Freelancer" 
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                    <div className="bg-light rounded p-2 flex-grow-1">
                      <small className="text-muted">Mike Chen</small>
                      <p className="mb-0">Hi! I've reviewed your e-commerce project requirements. I have 5+ years of experience with React and Node.js.</p>
                      <small className="text-muted">10:30 AM</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-end">
                    <div className="bg-primary text-white rounded p-2" style={{maxWidth: '70%'}}>
                      <p className="mb-0">That sounds great! Can you share some of your previous work?</p>
                      <small className="text-light">10:35 AM</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex">
                    <img 
                      src="https://via.placeholder.com/30" 
                      alt="Freelancer" 
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                    />
                    <div className="bg-light rounded p-2 flex-grow-1">
                      <small className="text-muted">Mike Chen</small>
                      <p className="mb-0">Absolutely! I'll send you my portfolio link and some case studies.</p>
                      <small className="text-muted">10:38 AM</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-top p-3">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Type your message..."
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
