import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        error: 'User account has been banned',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user info
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}

/**
 * Get authenticated user's profile
 * GET /api/users/profile
 * Requires: Authorization header with Bearer token
 */
export async function getUserProfile(req, res) {
  try {
    // User is attached by auth middleware
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isBanned: user.isBanned,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get user profile' });
  }
}
