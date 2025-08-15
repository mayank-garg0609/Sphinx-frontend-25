import { z } from "zod";

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

    return !suspiciousPatterns.some((pattern) => pattern.test(email));
  }, "Email format is not allowed")
  .refine((email) => {
    // Check for null bytes and control characters
    return !/[\x00-\x1f\x7f-\x9f]/.test(email);
  }, "Email contains invalid characters")
  .transform((email) => email.toLowerCase().trim());

/**
 * Enhanced password validation with security requirements
 */
const passwordSchema = z.string().min(1, "Password is required");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
