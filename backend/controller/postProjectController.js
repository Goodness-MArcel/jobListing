import Project from "../models/Project.js";
import { Op } from "sequelize";

export const postProject = async (req, res) => {
  try {
    console.log("Received request to post project:", req.body);
    console.log("Query parameters:", req.query);
    
    // Get client_id from query parameters
    const clientId = req.query.client_id;
    
    // Validate client_id exists
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required in query parameters."
      });
    }
    
    // Parse and validate client_id
   
    
    console.log('Parsed client ID:', clientId);
    
    // Extract project data from request body
    const { title, description, budget, deadline, category, skillsRequired } = req.body;
    
    // Validate required fields
    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, budget, or deadline."
      });
    }
    
    // Validate budget is a number
    const budgetAmount = parseFloat(budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid positive number."
      });
    }
    
    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be a valid date."
      });
    }
    
    // Check if deadline is in the future
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be in the future."
      });
    }
    
    // Prepare project data
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      budget: budgetAmount,
      deadline: deadlineDate,
      client_id: clientId,
      category: category ? category.trim() : null,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      status: 'draft' // Default status
    };
    
    console.log('Project data to be created:', projectData);
    
    // Create new project
    const newProject = await Project.create(projectData);
    
    console.log('Project created successfully:', newProject.id);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        budget: newProject.budget,
        deadline: newProject.deadline,
        category: newProject.category,
        skillsRequired: newProject.skillsRequired,
        status: newProject.status,
        client_id: newProject.client_id,
        createdAt: newProject.createdAt
      }
    });
    
  } catch (error) {
    console.error("Error creating project:", error);
    
    // Handle specific database errors
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
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: "A project with similar details already exists."
      });
    }
    
    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later."
      });
    }
    
    // Generic error response
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Optional: Add a function to get projects by client
export const getProjectsByClient = async (req, res) => {
  try {
    const clientId = req.query.client_id || req.params.client_id;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required."
      });
    }
    
    const projects = await Project.findAll({
      where: {
        client_id: clientId
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
      count: projects.length
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


// Get projects by authenticated client
// export const getProjectsByClient = async (req, res) => {
//   try {
//     const clientId = req.query.client_id || req.params.client_id;
//     const { status, page = 1, limit = 10 } = req.query;
    
//     if (!clientId) {
//       return res.status(400).json({
//         success: false,
//         message: "Client ID is required."
//       });
//     }
    
//     const clientID = parseInt(clientId);
//     if (isNaN(clientID) || clientID <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid client ID format."
//       });
//     }

//     // Build where clause
//     const whereClause = { client_id: clientID };
//     if (status && status !== 'all') {
//       whereClause.status = status;
//     }

//     // Calculate pagination
//     const offset = (parseInt(page) - 1) * parseInt(limit);
    
//     const { count, rows: projects } = await Project.findAndCountAll({
//       where: whereClause,
//       order: [['createdAt', 'DESC']],
//       limit: parseInt(limit),
//       offset: offset
//     });

//     // Format projects data
//     const formattedProjects = projects.map(project => ({
//       id: project.id,
//       title: project.title,
//       description: project.description,
//       budget: project.budget,
//       deadline: new Date(project.deadline).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }),
//       category: project.category,
//       skillsRequired: project.skillsRequired || [],
//       status: project.status,
//       client_id: project.client_id,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt,
//       // Add mock data for bids (you'll need to implement this based on your bids model)
//       bids: Math.floor(Math.random() * 10), // Replace with actual bid count
//       type: project.status === 'in-progress' ? 'progress' : 'bids'
//     }));
    
//     res.status(200).json({
//       success: true,
//       message: "Projects retrieved successfully",
//       data: formattedProjects,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / parseInt(limit)),
//         totalProjects: count,
//         projectsPerPage: parseInt(limit)
//       }
//     });
    
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//     });
//   }
// };

