import { Router } from 'express';
import {
  createUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';

const router = Router();

// TODO: Add authentication middleware
// POST /api/users/register - Create new user account
router.post('/register', createUser);

// POST /api/users/login - User login with JWT
router.post('/login', loginUser);

// GET /api/users/profile - Get authenticated user's profile
// TODO: Protect with authentication middleware
router.get('/profile', getUserProfile);

export default router;
