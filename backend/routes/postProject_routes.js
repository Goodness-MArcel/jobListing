import express from "express";
const addProject = express.Router();

import {
  postProject,
  getProjectsByClient,
  updateProject,
  deleteProject,
} from "../controller/postProjectController.js";
// iMPORTING CONTROLLERS FOR CLIENT PROFILE CRUD OPERATIONS


addProject.post("/add-project", postProject);
addProject.get("/client", getProjectsByClient);
addProject.put("/projects/:id", updateProject);
addProject.delete("/projects/:id", deleteProject);

// Client Profile CRUD operations


export default addProject;
