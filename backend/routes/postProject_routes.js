import express from 'express';
const addProject = express.Router();

import { postProject } from '../controller/postProjectController.js';

addProject.post('/add-project', postProject);



export default addProject;