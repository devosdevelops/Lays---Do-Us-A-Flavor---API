/**
 * Input validation utilities
 */

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // At least 6 characters
  return password && password.length >= 6;
}

export function validateUsername(username) {
  // At least 3 characters, alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}

export function validateRegisterInput(username, email, password) {
  const errors = [];

  if (!username) {
    errors.push('Username is required');
  } else if (!validateUsername(username)) {
    errors.push('Username must be at least 3 characters (alphanumeric and underscores only)');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
