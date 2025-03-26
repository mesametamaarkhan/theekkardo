import express from 'express';
import dotenv from 'dotenv';
//other import go here
import authenticateToken from '../middleware/AuthenticateToken.js';
import { Tracking } from '../models/Tracking.js';

const router = express.Router();




export default router;