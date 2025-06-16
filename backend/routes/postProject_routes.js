import express from 'express';
const addProject = express.Router();

import { postProject, getProjectsByClient } from '../controller/postProjectController.js';

addProject.post('/add-project', postProject);
addProject.get('/client', getProjectsByClient);



export default addProject;