import Project from "../models/Project.js";
import { Op } from "sequelize";

export const postProject = async (req, res) => {
    console.log("Received request to post project:", req.body);
    console.log('user ID:', req.user.id || 'not authenticated');
  try {
    const { title, description, budget, deadline, category, skillsRequired } = req.body;
     console.log('user ID:', req.user.id || 'not authenticated');
    // Validate required fields
    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, budget, or deadline."
      });
    }

    // Create new project
    const newProject = await Project.create({
      title,
      description,
      budget,
      deadline,
      client_id: req.user.id, // Assuming req.user contains authenticated user info
      category: category || null,
      skillsRequired: skillsRequired || [],
      status: 'draft' // Default status
    });
    console.log('authenticated user ID:', req.user.id);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

