/**
 * Authentication middleware
 * TODO: Implement JWT verification
 * TODO: Extract user ID from token
 * TODO: Attach user to req object
 */
export function authenticateToken(req, res, next) {
  // TODO: Verify JWT token from Authorization header
  // TODO: If invalid, return 401 Unauthorized
  // TODO: If valid, attach decoded user to req.user and call next()
  next();
}

/**
 * Admin authorization middleware
 * TODO: Implement admin role verification
 * Should be used after authenticateToken
 */
export function authorizeAdmin(req, res, next) {
  // TODO: Check if req.user has admin role
  // TODO: If not admin, return 403 Forbidden
  // TODO: If admin, call next()
  next();
}
