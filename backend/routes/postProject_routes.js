import express from 'express';
const addProject = express.Router();

import {
     postProject,
      getProjectsByClient,
      updateProject,
        deleteProject
     } from '../controller/postProjectController.js';

addProject.post('/add-project', postProject);
addProject.get('/client', getProjectsByClient);
addProject.put('/projects/:id', updateProject);
addProject.delete('/projects/:id', deleteProject);



export default addProject;