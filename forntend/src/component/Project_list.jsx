import React, { useState, useEffect } from "react";

function ProjectList({ clientId }) {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    projectsPerPage: 10,
  });

  // Fetch projects from API
  const fetchProjects = async (status = "all", page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Get client_id from props or localStorage/context
      const currentClientId =
        clientId ||
        localStorage.getItem("client_id") ||
        sessionStorage.getItem("client_id");

      if (!currentClientId) {
        throw new Error("Client ID not found. Please login again.");
      }

      const queryParams = new URLSearchParams({
        client_id: currentClientId,
        page: page.toString(),
        limit: "10",
      });

      if (status !== "all") {
        queryParams.append("status", status);
      }

      const response = await fetch(
        `https://joblisting-backend-m2wa.onrender.com/api/projects/client?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if you're using JWT
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setProjects(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || "Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete project function
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const currentClientId =
        clientId ||
        localStorage.getItem("client_id") ||
        sessionStorage.getItem("client_id");

      if (!currentClientId) {
        throw new Error("Client ID not found. Please login again.");
      }

      const response = await fetch(
        `https://joblisting-backend-m2wa.onrender.com/api/projects/projects/${projectId}?client_id=${currentClientId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Remove the deleted project from the local state
        setProjects(projects.filter(project => project.id !== projectId));
        alert("Project deleted successfully!");
        
        // Refresh the projects list to update pagination
        fetchProjects(filter, pagination.currentPage);
      } else {
        throw new Error(result.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert(`Error deleting project: ${err.message}`);
    }
  };

  // Edit project function
  const handleEditProject = (project) => {
    setEditingProject({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: new Date(project.deadline).toISOString().split('T')[0],
      category: project.category || '',
      skillsRequired: Array.isArray(project.skillsRequired) ? project.skillsRequired.join(', ') : '',
      status: project.status
    });
    setShowEditModal(true);
  };

  // Update project function
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    try {
      const currentClientId =
        clientId ||
        localStorage.getItem("client_id") ||
        sessionStorage.getItem("client_id");

      if (!currentClientId) {
        throw new Error("Client ID not found. Please login again.");
      }

      const updateData = {
        title: editingProject.title,
        description: editingProject.description,
        budget: parseFloat(editingProject.budget),
        deadline: editingProject.deadline,
        category: editingProject.category,
        skillsRequired: editingProject.skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill),
        status: editingProject.status
      };

      const response = await fetch(
        `https://joblisting-backend-m2wa.onrender.com/api/projects/projects/${editingProject.id}?client_id=${currentClientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the project in the local state
        setProjects(projects.map(project => 
          project.id === editingProject.id ? result.data : project
        ));
        setShowEditModal(false);
        setEditingProject(null);
        alert("Project updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      alert(`Error updating project: ${err.message}`);
    }
  };

  // Fetch projects on component mount and when filter changes
  useEffect(() => {
    fetchProjects(filter, 1);
  }, [filter, clientId]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchProjects(filter, newPage);
  };

  const getStatusBadge = (status, bids, type) => {
    if (status === "in-progress") {
      return <span className="badge bg-success fs-6">In Progress</span>;
    }
    if (status === "completed") {
      return <span className="badge bg-info fs-6">Completed</span>;
    }
    if (status === "active" && type === "bids") {
      return <span className="badge bg-primary fs-6">{bids} Bids</span>;
    }
    return <span className="badge bg-secondary fs-6">Draft</span>;
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h6 className="text-danger">Error Loading Projects</h6>
          <p className="text-muted">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => fetchProjects(filter, pagination.currentPage)}
          >
            <i className="fas fa-redo me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold text-dark">
            <i className="fas fa-project-diagram me-2 text-success"></i>
            My Projects {pagination && (
               pagination.totalProjects
            )}
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Projects</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => fetchProjects(filter, pagination.currentPage)}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="border-bottom p-4 hover-bg-light">
              <div className="row align-items-start">
                <div className="col-lg-8">
                  <div className="d-flex align-items-start mb-2">
                    <h6 className="text-dark mb-0 me-2 fw-semibold">
                      {project.title}
                    </h6>
                    {getStatusBadge(project.status, project.bids, project.type)}
                  </div>

                  <p
                    className="text-muted mb-3"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {project.description}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {project.skillsRequired &&
                      project.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark border"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  {project.category && (
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="fas fa-tag me-1"></i>
                        Category:{" "}
                        <span className="fw-semibold">{project.category}</span>
                      </small>
                    </div>
                  )}

                  {project.status === "in-progress" && project.freelancer && (
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-user-check text-success me-2"></i>
                      <small className="text-muted">
                        Working with:{" "}
                        <span className="fw-semibold text-dark">
                          {project.freelancer}
                        </span>
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
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                      {project.status === "active" && (
                        <>
                          <button className="btn btn-sm btn-primary">
                            <i className="fas fa-eye me-1"></i>
                            View Bids
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditProject(project)}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                        </>
                      )}

                      {project.status === "in-progress" && (
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

                      {project.status === "draft" && (
                        <>
                          <button className="btn btn-sm btn-warning">
                            <i className="fas fa-paper-plane me-1"></i>
                            Publish
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditProject(project)}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                        </>
                      )}

                      {project.status === "completed" && (
                        <button className="btn btn-sm btn-outline-info">
                          <i className="fas fa-star me-1"></i>
                          Rate & Review
                        </button>
                      )}

                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fas fa-share me-2"></i>Share
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fas fa-copy me-2"></i>Duplicate
                            </a>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button 
                              className="dropdown-item text-danger"
                              onClick={() => handleDeleteProject(project.id)}
                              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                            >
                              <i className="fas fa-trash me-2"></i>Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h6 className="text-muted">No projects found</h6>
            <p className="text-muted">
              {filter === "all"
                ? "Start by posting your first project!"
                : `No ${filter} projects found. Try changing the filter.`}
            </p>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Post New Project
            </button>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="card-footer bg-light border-top-0">
          <div className="d-flex justify-content-between align-items-center">
            {pagination && (
              <small className="text-muted">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.projectsPerPage + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.projectsPerPage,
                  pagination.totalProjects
                )}{" "}
                of {pagination.totalProjects} projects
              </small>
            )}
            {pagination && pagination.totalPages > 1 && (
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${
                      pagination.currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= pagination.currentPage - 1 &&
                        pageNumber <= pagination.currentPage + 1)
                    ) {
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            pagination.currentPage === pageNumber
                              ? "active"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    } else if (
                      pageNumber === pagination.currentPage - 2 ||
                      pageNumber === pagination.currentPage + 2
                    ) {
                      return (
                        <li key={pageNumber} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}

                  <li
                    className={`page-item ${
                      pagination.currentPage === pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Edit Project
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateProject}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="editTitle" className="form-label">
                        Project Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTitle"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label htmlFor="editDescription" className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="editDescription"
                        rows="4"
                        value={editingProject.description}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, description: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editBudget" className="form-label">
                        Budget ($) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="editBudget"
                        min="1"
                        step="0.01"
                        value={editingProject.budget}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, budget: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editDeadline" className="form-label">
                        Deadline <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="editDeadline"
                        value={editingProject.deadline}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, deadline: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editCategory" className="form-label">
                        Category
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editCategory"
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editStatus" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="editStatus"
                        value={editingProject.status}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, status: e.target.value })
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label htmlFor="editSkills" className="form-label">
                        Skills Required
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editSkills"
                        placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                        value={editingProject.skillsRequired}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, skillsRequired: e.target.value })
                        }
                      />
                      <div className="form-text">
                        Separate multiple skills with commas
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProject(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Update Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
