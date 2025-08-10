import { z } from "zod";
import { SECURITY_CONFIG, COMMON_PASSWORDS } from "../(auth)/utils/security";

/**
 * Enhanced email validation with security checks
 */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email address is too long")
  .email("Please enter a valid email address")
  .refine((email) => {
    // Additional security validations
    const lowercaseEmail = email.toLowerCase();
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\+{2,}/, // Multiple plus signs
      /\.{3,}/, // Multiple consecutive dots
      /@.*@/, // Multiple @ symbols
      /<|>/, // HTML characters
      /javascript:/i, // Script injection
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, "Email format is not allowed")
  .refine((email) => {
    // Check for null bytes and control characters
    return !/[\x00-\x1f\x7f-\x9f]/.test(email);
  }, "Email contains invalid characters")
  .transform((email) => email.toLowerCase().trim());

/**
 * Enhanced password validation with security requirements
 */
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(SECURITY_CONFIG.password.minLength, `Password must be at least ${SECURITY_CONFIG.password.minLength} characters`)
  .max(SECURITY_CONFIG.password.maxLength, `Password must not exceed ${SECURITY_CONFIG.password.maxLength} characters`)
  .refine((password) => {
    // Check for null bytes and control characters
    return !/[\x00-\x1f\x7f-\x9f]/.test(password);
  }, "Password contains invalid characters")
  .refine((password) => {
    // Check for common passwords
    const lowerPassword = password.toLowerCase();
    return !COMMON_PASSWORDS.some(common => lowerPassword.includes(common));
  }, "Password is too common. Please choose a more secure password")
  .refine((password) => {
    // Check for excessive repeating characters
    return !/(.)\1{4,}/.test(password);
  }, "Password cannot have more than 4 consecutive identical characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;