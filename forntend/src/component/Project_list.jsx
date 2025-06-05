import React, { useState } from "react";

function ProjectList() {
  const [filter, setFilter] = useState('all');
  
  const projects = [
    {
      id: 1,
      title: "E-commerce Website Development",
      description: "Need a full-stack developer to build a modern e-commerce platform with payment integration...",
      skills: ["React", "Node.js", "MongoDB"],
      budget: 2500,
      deadline: "Dec 15, 2024",
      status: "active",
      bids: 5,
      type: "bids"
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      description: "Looking for a creative designer to create modern UI/UX for a fitness mobile app...",
      skills: ["Figma", "UI/UX", "Mobile Design"],
      budget: 800,
      deadline: "Nov 30, 2024",
      status: "in-progress",
      freelancer: "Sarah Johnson",
      type: "progress"
    },
    {
      id: 3,
      title: "Content Writing for Blog",
      description: "Need 10 high-quality blog posts about digital marketing trends...",
      skills: ["Content Writing", "SEO", "Marketing"],
      budget: 500,
      deadline: "Dec 1, 2024",
      status: "active",
      bids: 3,
      type: "bids"
    }
  ];

  const getStatusBadge = (status, bids, type) => {
    if (status === 'in-progress') {
      return <span className="badge bg-success fs-6">In Progress</span>;
    }
    if (type === 'bids') {
      return <span className="badge bg-primary fs-6">{bids} Bids</span>;
    }
    return <span className="badge bg-secondary fs-6">Draft</span>;
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold text-dark">
            <i className="fas fa-project-diagram me-2 text-success"></i>
            My Projects
          </h5>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm" 
              style={{width: 'auto'}}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-sm btn-outline-primary">
              <i className="fas fa-filter me-1"></i>
              Filter
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
        {projects.map((project) => (
          <div key={project.id} className="border-bottom p-4 hover-bg-light">
            <div className="row align-items-start">
              <div className="col-lg-8">
                <div className="d-flex align-items-start mb-2">
                  <h6 className="text-dark mb-0 me-2 fw-semibold">{project.title}</h6>
                  {getStatusBadge(project.status, project.bids, project.type)}
                </div>
                
                <p className="text-muted mb-3" style={{fontSize: '0.95rem'}}>
                  {project.description}
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="badge bg-light text-dark border">
                      {skill}
                    </span>
                  ))}
                </div>
                
                {project.status === 'in-progress' && project.freelancer && (
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-user-check text-success me-2"></i>
                    <small className="text-muted">
                      Working with: <span className="fw-semibold text-dark">{project.freelancer}</span>
                    </small>
                  </div>
                )}
              </div>
              
              <div className="col-lg-4">
                <div className="text-lg-end">
                  <div className="mb-2">
                    <h5 className="text-success mb-0 fw-bold">
                      ${project.budget.toLocaleString()}
                    </h5>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="fas fa-calendar-alt me-1"></i>
                      Due: {project.deadline}
                    </small>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                    {project.status === 'active' && (
                      <>
                        <button className="btn btn-sm btn-primary">
                          <i className="fas fa-eye me-1"></i>
                          View Bids
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                      </>
                    )}
                    
                    {project.status === 'in-progress' && (
                      <>
                        <button className="btn btn-sm btn-success">
                          <i className="fas fa-tasks me-1"></i>
                          View Progress
                        </button>
                        <button className="btn btn-sm btn-info">
                          <i className="fas fa-comments me-1"></i>
                          Message
                        </button>
                      </>
                    )}
                    
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#"><i className="fas fa-share me-2"></i>Share</a></li>
                        <li><a className="dropdown-item" href="#"><i className="fas fa-copy me-2"></i>Duplicate</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-danger" href="#"><i className="fas fa-trash me-2"></i>Delete</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h6 className="text-muted">No projects found</h6>
            <p className="text-muted">Start by posting your first project!</p>
          </div>
        )}
      </div>
      
      <div className="card-footer bg-light border-top-0">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing {projects.length} of {projects.length} projects
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              <li className="page-item active">
                <span className="page-link">1</span>
              </li>
              <li className="page-item disabled">
                <span className="page-link">Next</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ProjectList;
