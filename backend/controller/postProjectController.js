import Project from "../models/Project.js";
import { emitProjectEvent } from "../socketService.js";
import { Op } from "sequelize";

export const postProject = async (req, res) => {
  try {
    console.log("Received request to post project:", req.body);
    console.log("Query parameters:", req.query);
    
    const clientId = req.query.client_id;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required in query parameters."
      });
    }
    
    const { title, description, budget, deadline, category, skillsRequired } = req.body;
    
    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, budget, or deadline."
      });
    }
    
    const budgetAmount = parseFloat(budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid positive number."
      });
    }
    
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be a valid date."
      });
    }
    
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be in the future."
      });
    }
    
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      budget: budgetAmount,
      deadline: deadlineDate,
      client_id: clientId,
      category: category ? category.trim() : null,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      status: 'draft'
    };
    
    const newProject = await Project.create(projectData);
    
    const responseData = {
      id: newProject.id,
      title: newProject.title,
      description: newProject.description,
      budget: newProject.budget,
      deadline: newProject.deadline,
      category: newProject.category,
      skillsRequired: newProject.skillsRequired,
      status: newProject.status,
      client_id: newProject.client_id,
      createdAt: newProject.createdAt,
      bids: 0,
      type: 'bids'
    };

    // Emit real-time event
    emitProjectEvent('project-created', {
      project: responseData,
      clientId: clientId
    }, clientId);
    
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: responseData
    });
    
  } catch (error) {
    console.error("Error creating project:", error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID. Client does not exist."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.query.client_id;
    const updateData = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }

    const project = await Project.findOne({
      where: { id, client_id: clientId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized."
      });
    }

    await project.update(updateData);
    await project.reload();

    const responseData = {
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: project.deadline,
      category: project.category,
      skillsRequired: project.skillsRequired,
      status: project.status,
      client_id: project.client_id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      bids: 0, // Replace with actual bid count
      type: project.status === 'in-progress' ? 'progress' : 'bids'
    };

    // Emit real-time event
    emitProjectEvent('project-updated', {
      project: responseData,
      clientId: clientId
    }, clientId);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.query.client_id;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }

    const project = await Project.findOne({
      where: { id, client_id: clientId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized."
      });
    }

    await project.destroy();

    // Emit real-time event
    emitProjectEvent('project-deleted', {
      projectId: id,
      clientId: clientId
    }, clientId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

export const getProjectsByClient = async (req, res) => {
  try {
    const clientId = req.query.client_id || req.params.client_id;
    const { status, page = 1, limit = 10 } = req.query;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }
    
   

    const whereClause = { client_id: clientId };
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      deadline: project.deadline,
      category: project.category,
      skillsRequired: project.skillsRequired || [],
      status: project.status,
      client_id: project.client_id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      bids: Math.floor(Math.random() * 10),
      type: project.status === 'in-progress' ? 'progress' : 'bids'
    }));
    
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: formattedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalProjects: count,
        projectsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};
