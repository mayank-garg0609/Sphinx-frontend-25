// app/(auth)/utils/validation.tsx
import { SECURITY_CONFIG, COMMON_PASSWORDS, PasswordStrengthResult } from './security';

/**
 * Sanitizes input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  const sanitized = input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '');
    
  // Limit input length
  return sanitized.substring(0, SECURITY_CONFIG.validation.maxInputLength);
};

/**
 * Validates email format with additional security checks
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const sanitizedEmail = sanitizeInput(email);
  
  if (!sanitizedEmail) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Check email length limits
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address too long' };
  }
  
  // Domain-specific checks if configured
  if (SECURITY_CONFIG.validation.allowedEmailDomains.length > 0) {
    const domain = sanitizedEmail.split('@')[1];
    if (!SECURITY_CONFIG.validation.allowedEmailDomains.includes(domain)) {
      return { isValid: false, error: 'Email domain not allowed' };
    }
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\+{2,}/, // Multiple plus signs
    /\.{3,}/, // Multiple dots
    /@.*@/, // Multiple @ symbols
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(sanitizedEmail))) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

/**
 * Comprehensive password strength validation
 */
export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      level: 'very-weak',
      score: 0,
      feedback: ['Password is required'],
      isValid: false,
    };
  }
  
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < SECURITY_CONFIG.password.minLength) {
    feedback.push(`Password must be at least ${SECURITY_CONFIG.password.minLength} characters long`);
  } else if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
  }
  
  // Character variety checks
  if (!/[a-z]/.test(password)) {
    feedback.push('Include lowercase letters');
  } else {
    score += 15;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Include uppercase letters');
  } else {
    score += 15;
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Include numbers');
  } else {
    score += 15;
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Include special characters');
  } else {
    score += 15;
  }
  
  // Check for common passwords
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    feedback.push('Avoid common passwords');
    score -= 20;
  }
  
  // Check for consecutive characters
  const hasConsecutive = /(.)\1{2,}/.test(password);
  if (hasConsecutive) {
    feedback.push('Avoid repeating characters');
    score -= 10;
  }
  
  // Check for keyboard patterns
  const keyboardPatterns = [
    /qwerty/i, /asdf/i, /zxcv/i, /1234/i, /abcd/i
  ];
  if (keyboardPatterns.some(pattern => pattern.test(password))) {
    feedback.push('Avoid keyboard patterns');
    score -= 15;
  }
  
  // Determine strength level
  let level: PasswordStrengthResult['level'];
  if (score >= 80) level = 'strong';
  else if (score >= 60) level = 'good';
  else if (score >= 40) level = 'fair';
  else if (score >= 20) level = 'weak';
  else level = 'very-weak';
  
  const isValid = feedback.length === 0 && score >= 40;
  
  return { level, score: Math.max(0, score), feedback, isValid };
};

/**
 * Validates name with additional security checks
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const sanitizedName = sanitizeInput(name);
  
  if (!sanitizedName) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (sanitizedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, error: 'Name is too long' };
  }
  
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(sanitizedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }
  
  // Check for suspicious patterns
  if (/\s{2,}/.test(sanitizedName) || /--/.test(sanitizedName) || /''/test(sanitizedName)) {
    return { isValid: false, error: 'Invalid name format' };
  }
  
  return { isValid: true };
};

/**
 * Rate limiting utility
 */
class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number; blockUntil?: number }> = new Map();
  
  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record?.blockUntil) return false;
    
    if (Date.now() > record.blockUntil) {
      this.attempts.delete(identifier);
      return false;
    }
    
    return true;
  }
  
  recordAttempt(identifier: string): { blocked: boolean; remainingAttempts: number; blockDuration?: number } {
    const now = Date.now();
    const config = SECURITY_CONFIG.rateLimit;
    let record = this.attempts.get(identifier);
    
    // Initialize or reset if window expired
    if (!record || (now - record.firstAttempt) > config.windowMs) {
      record = { count: 0, firstAttempt: now };
    }
    
    record.count++;
    this.attempts.set(identifier, record);
    
    if (record.count > config.maxAttempts) {
      record.blockUntil = now + config.blockDuration;
      return { 
        blocked: true, 
        remainingAttempts: 0, 
        blockDuration: config.blockDuration 
      };
    }
    
    return { 
      blocked: false, 
      remainingAttempts: config.maxAttempts - record.count 
    };
  }
  
  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record?.blockUntil) return 0;
    
    return Math.max(0, record.blockUntil - Date.now());
  }
}

export const rateLimiter = new RateLimiter();