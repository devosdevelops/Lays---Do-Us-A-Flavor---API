import { Router } from 'express';
import {
  createUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/users/register - Create new user account
router.post('/register', createUser);

// POST /api/users/login - User login with JWT
router.post('/login', loginUser);

// GET /api/users/profile - Get authenticated user's profile
// Requires: Authorization: Bearer <token>
router.get('/profile', authenticateToken, getUserProfile);

export default router;
