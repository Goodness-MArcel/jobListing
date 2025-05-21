import express from 'express';
const router = express.Router();

import { text } from '../controller/index.js';
router.get('/', text);

export default router;