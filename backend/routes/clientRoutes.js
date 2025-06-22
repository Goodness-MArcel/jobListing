import express from 'express';
import { 
  getClientProfile, 
  updateClientProfile, 
  uploadProfileImage,
  handleMulterError 
} from '../controller/clientController.js';

const Clienrouter = express.Router();

// Get client profile
// Clienrouter.get('/profile', getClientProfile);

// Update client profile (with file upload middleware)
Clienrouter.put('/profile', uploadProfileImage, handleMulterError, updateClientProfile);

export default Clienrouter;