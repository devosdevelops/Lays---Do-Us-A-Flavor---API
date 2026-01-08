/**
 * Logger utility
 * TODO: Implement structured logging with timestamps
 * TODO: Add log levels (error, warn, info, debug)
 * TODO: Integrate with a logging service (Winston, Pino, etc.)
 */

export const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },

  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  },

  info: (message) => {
    console.log(`[INFO] ${message}`);
  },

  debug: (message) => {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${message}`);
    }
  },
};
