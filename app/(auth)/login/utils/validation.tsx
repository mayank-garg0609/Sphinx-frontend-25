import DOMPurify from "isomorphic-dompurify";
import { SECURITY_CONFIG } from "./security";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") {
    return "";
  }
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  SECURITY_CONFIG.input.suspiciousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized.substring(0, SECURITY_CONFIG.input.maxLength);
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required" };
  }

  if (email.length > SECURITY_CONFIG.email.maxLength) {
    return { isValid: false, error: "Email address is too long" };
  }
  const sanitized = sanitizeInput(email.toLowerCase().trim());

  const hasSuspiciousContent = SECURITY_CONFIG.input.suspiciousPatterns.some(
    (pattern) => pattern.test(sanitized)
  );

  if (hasSuspiciousContent) {
    return { isValid: false, error: "Email contains invalid characters" };
  }

  if (!SECURITY_CONFIG.email.pattern.test(sanitized)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (
    sanitized.includes("..") ||
    sanitized.startsWith(".") ||
    sanitized.endsWith(".")
  ) {
    return { isValid: false, error: "Email format is invalid" };
  }

  return { isValid: true, sanitized };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < SECURITY_CONFIG.password.minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${SECURITY_CONFIG.password.minLength} characters`,
    };
  }

  if (password.length > SECURITY_CONFIG.password.maxLength) {
    return { isValid: false, error: "Password is too long" };
  }

  // Check for null bytes and control characters
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(password)) {
    return { isValid: false, error: "Password contains invalid characters" };
  }

  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Name is required" };
  }

  const sanitized = sanitizeInput(name.trim());

  if (sanitized.length < 1) {
    return { isValid: false, error: "Name is required" };
  }

  if (sanitized.length > 100) {
    return { isValid: false, error: "Name is too long" };
  }

  if (!/^[a-zA-Z\s\-'\.]+$/.test(sanitized)) {
    return { isValid: false, error: "Name contains invalid characters" };
  }

  return { isValid: true, sanitized };
};
