/**
 * Global error handling middleware
 * Should be the last middleware mounted in app.js
 *
 * TODO: Implement structured error logging
 * TODO: Add error tracking/monitoring service integration
 */
export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    // TODO: Only include stack trace in development environment
  });
}
