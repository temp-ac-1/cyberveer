/**
 * Input validation and sanitization utilities for secure authentication
 * Implements RFC 5322 compliant email validation and security best practices
 */

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password requirements regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// OTP regex (6 digits only)
const OTP_REGEX = /^\d{6}$/;

// Allowed characters for email (whitelist approach)
const EMAIL_WHITELIST = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]+$/;

/**
 * Sanitizes input by removing potentially dangerous characters and HTML
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove SQL injection patterns
    .replace(/(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi, '')
    // Remove JavaScript event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove dangerous characters
    .replace(/[<>'";&()]/g, '');
};

/**
 * Validates and sanitizes email address
 * @param {string} email - Raw email input
 * @returns {{isValid: boolean, error?: string, sanitizedEmail?: string}}
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const sanitized = sanitizeInput(email).toLowerCase();

  if (!EMAIL_WHITELIST.test(sanitized)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, sanitizedEmail: sanitized };
};

/**
 * Validates password strength
 * @param {string} password - Raw password input
 * @returns {{isValid: boolean, error?: string}}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { 
      isValid: false, 
      error: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }

  return { isValid: true };
};

/**
 * Validates OTP input
 * @param {string} otp - Raw OTP input
 * @returns {{isValid: boolean, error?: string, sanitizedOTP?: string}}
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }

  const sanitized = otp.replace(/\D/g, '');

  if (sanitized.length !== 6) {
    return { isValid: false, error: 'OTP must be exactly 6 digits' };
  }

  if (!OTP_REGEX.test(sanitized)) {
    return { isValid: false, error: 'OTP must contain only numbers' };
  }

  return { isValid: true, sanitizedOTP: sanitized };
};

/**
 * Sanitizes password input (removes dangerous characters but preserves special chars for validation)
 * @param {string} password - Raw password input
 * @returns {string} Sanitized password
 */
export const sanitizePassword = (password) => {
  return password
    .replace(/<[^>]*>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi, '')
    .replace(/[<>]/g, '');
};

/**
 * Prevents clipboard operations for sensitive fields
 * @param {ClipboardEvent} event - Clipboard event
 */
export const preventClipboard = (event) => {
  event.preventDefault();
  return false;
};

/**
 * Sanitizes OTP input to only allow digits
 * @param {string} value - Raw OTP input
 * @returns {string} Sanitized OTP (digits only)
 */
export const sanitizeOTP = (value) => {
  return value.replace(/\D/g, '').slice(0, 6);
};
