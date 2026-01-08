import jwt from 'jsonwebtoken';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid or expired token',
        });
      }

      // Attach decoded user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Authentication error',
    });
  }
}

/**
 * Admin authorization middleware
 * Should be used after authenticateToken
 * Verifies user has admin role
 */
export function authorizeAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization error' });
  }
}
