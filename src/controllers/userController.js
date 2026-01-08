import bcrypt from 'bcrypt';
import { User } from '../models/Placeholder.js';
import { validateRegisterInput } from '../utils/validation.js';

/**
 * Register a new user account
 * POST /api/users/register
 */
export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    const validation = validateRegisterInput(username, email, password);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if user already exists (username or email)
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.username === username 
          ? 'Username already taken' 
          : 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return user without password
    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

/**
 * User login
 * POST /api/users/login
 */
export async function loginUser(req, res) {
  try {
    // TODO: Implement login with JWT token
    res.status(200).json({ message: 'Login not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
}

/**
 * Get authenticated user's profile
 * GET /api/users/profile
 */
export async function getUserProfile(req, res) {
  try {
    // TODO: Get user ID from JWT token in headers
    // TODO: Return user profile without password
    res.status(200).json({ message: 'Get user profile not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
}
