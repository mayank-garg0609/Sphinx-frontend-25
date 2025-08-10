import { SignUpFormData } from "@/app/schemas/signupSchema";
import { SignUpResponse } from "../types/authTypes";
import { authApi } from "../../utils/secureApiClient";
import { validateEmail, validateName, validatePasswordStrength, sanitizeInput } from "../../utils/validation";
import { SECURITY_CONFIG } from "../../utils/security";

/**
 * Enhanced signup user function with comprehensive validation
 */
export const signUpUser = async (data: SignUpFormData): Promise<SignUpResponse> => {
  console.log('📝 Processing signup with enhanced security');
  
  try {
    // Pre-flight validation and sanitization
    const validatedData = await validateAndSanitizeSignupData(data);
    
    // Use secure API client
    const result = await authApi.signup(validatedData);
    
    console.log('✅ Signup successful');
    return result;
    
  } catch (error) {
    console.error('❌ Signup failed:', error);
    throw error;
  }
};

/**
 * Enhanced Google signup function
 */
export const signUpWithGoogle = async (code: string): Promise<SignUpResponse> => {
  console.log('🔍 Processing Google signup with enhanced security');
  
  try {
    // Validate Google auth code
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid Google authentication code');
    }
    
    // Additional code validation
    if (code.length < 10 || code.length > 2048) {
      throw new Error('Google authentication code format is invalid');
    }
    
    // Check for suspicious patterns
    if (/<script|javascript:|on\w+=/i.test(code)) {
      throw new Error('Suspicious authentication code detected');
    }
    
    // Use secure API client
    const result = await authApi.googleAuth(code);
    
    console.log('✅ Google signup successful');
    return result;
    
  } catch (error) {
    console.error('❌ Google signup failed:', error);
    throw error;
  }
};

/**
 * Validate and sanitize signup data
 */
async function validateAndSanitizeSignupData(data: SignUpFormData): Promise<SignUpFormData> {
  console.log('🔍 Validating and sanitizing signup data');
  
  // Sanitize and validate name
  const sanitizedName = sanitizeInput(data.name).trim();
  const nameValidation = validateName(sanitizedName);
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.error || 'Invalid name format');
  }
  
  // Sanitize and validate email
  const sanitizedEmail = sanitizeInput(data.email).toLowerCase().trim();
  const emailValidation = validateEmail(sanitizedEmail);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error || 'Invalid email format');
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.isValid) {
    const errorMessage = passwordValidation.feedback.length > 0 
      ? passwordValidation.feedback[0] 
      : 'Password does not meet security requirements';
    throw new Error(errorMessage);
  }
  
  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  // Validate terms agreement
  if (!data.agreed) {
    throw new Error('You must agree to the terms and conditions');
  }
  
  // Check password length limits
  if (data.password.length > SECURITY_CONFIG.password.maxLength) {
    throw new Error('Password is too long');
  }
  
  // Additional security checks
  await performAdditionalSecurityChecks(sanitizedEmail, data.password);
  
  return {
    name: sanitizedName,
    email: sanitizedEmail,
    password: data.password, // Don't sanitize password, just validate
    confirmPassword: data.confirmPassword,
    agreed: data.agreed,
  };
}

/**
 * Perform additional security checks
 */
async function performAdditionalSecurityChecks(email: string, password: string): Promise<void> {
  // Check for suspicious email patterns
  const suspiciousEmailPatterns = [
    /tempmail|10minutemail|guerrillamail/i,
    /mailinator|yopmail|throwaway/i,
    /\+test|\+spam|\+fake/i,
  ];
  
  if (suspiciousEmailPatterns.some(pattern => pattern.test(email))) {
    console.warn('⚠️ Suspicious email pattern detected:', email);
    // In production, you might want to flag this for review rather than block
  }
  
  // Check for password reuse (email as password, name as password, etc.)
  const emailParts = email.split('@')[0];
  if (password.toLowerCase().includes(emailParts.toLowerCase()) && emailParts.length > 3) {
    throw new Error('Password cannot contain parts of your email address');
  }
  
  // Check for dictionary words in password (basic check)
  const commonWords = ['password', 'welcome', 'login', 'admin', 'user', 'test'];
  const lowerPassword = password.toLowerCase();
  if (commonWords.some(word => lowerPassword.includes(word))) {
    throw new Error('Password cannot contain common dictionary words');
  }
  
  console.log('✅ Additional security checks passed');
}
