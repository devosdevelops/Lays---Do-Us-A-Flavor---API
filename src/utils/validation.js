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

export function validateSubmissionInput(flavorName, bagColor, fontChoice, keyFlavors) {
  const errors = [];

  if (!flavorName || typeof flavorName !== 'string' || flavorName.trim().length === 0) {
    errors.push('Flavor name is required');
  } else if (flavorName.length < 2 || flavorName.length > 100) {
    errors.push('Flavor name must be between 2 and 100 characters');
  }

  if (!bagColor || typeof bagColor !== 'string' || bagColor.trim().length === 0) {
    errors.push('Bag color is required');
  } else if (!/^#[0-9A-F]{6}$/i.test(bagColor)) {
    errors.push('Bag color must be a valid hex color (e.g., #FF5733)');
  }

  if (fontChoice && (typeof fontChoice !== 'string' || fontChoice.trim().length === 0)) {
    errors.push('Font choice must be a non-empty string');
  }

  if (keyFlavors) {
    if (!Array.isArray(keyFlavors)) {
      errors.push('Key flavors must be an array');
    } else if (keyFlavors.length > 0) {
      const invalidFlavors = keyFlavors.filter(f => typeof f !== 'string' || f.trim().length === 0);
      if (invalidFlavors.length > 0) {
        errors.push('All key flavors must be non-empty strings');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
