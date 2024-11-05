import { Router, Request, Response } from 'express';
import upload from '../utils/multer'; // Ensure this path is correct
import { register } from '../controllers/authController';
import asyncHandler from "../utils/asyncHandler";
import { userValidationRules } from '../validators/userValidator';

const router = Router();

// Route for user registration with avatar upload
router.post('/register', upload.single('avatar'), userValidationRules(), asyncHandler(register));

// Simple ping route for health check
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'pong!!!' });
});

export default router;
