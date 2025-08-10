import type { UserData, UserPreferences, User } from '../types/authTypes';
import { tokenUtils, userDataUtils } from '../../utils/secureStorage';
import { validateEmail, validateName } from '../../utils/validation';

/**
 * Enhanced auth token saving with validation
 */
export const saveAuthToken = (token: string): void => {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token provided');
    }
    
    // Use secure storage utilities
    tokenUtils.saveAuthToken(token);
    
    console.log('✅ Auth token saved securely');
  } catch (error) {
    console.error('Failed to save auth token:', error);
    throw new Error('Token storage failed. Please try again.');
  }
};

/**
 * Enhanced user data saving with validation and sanitization
 */
export const saveUserData = (user: User): void => {
  try {
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user data provided');
    }
    
    // Validate required fields
    if (!user.sphinx_id || !user.email || !user.name) {
      throw new Error('Missing required user fields');
    }
    
    // Validate email format
    const emailValidation = validateEmail(user.email);
    if (!emailValidation.isValid) {
      throw new Error(`Invalid email: ${emailValidation.error}`);
    }
    
    // Validate name format
    const nameValidation = validateName(user.name);
    if (!nameValidation.isValid) {
      throw new Error(`Invalid name: ${nameValidation.error}`);
    }
    
    // Use secure storage utilities
    userDataUtils.saveUserData(user);
    
    console.log('✅ User data saved securely');
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw new Error('User data storage failed. Please try again.');
  }
};

/**
 * Enhanced authentication success handler with comprehensive security
 */
export const handleAuthSuccess = (token: string, user: User, router: any): void => {
  try {
    console.log('🔐 Processing authentication success...');
    
    // Validate inputs
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    if (!user) {
      throw new Error('User data is missing');
    }
    
    if (!router) {
      throw new Error('Router is not available');
    }
    
    // Check if token is already expired
    if (tokenUtils.isTokenExpired(token)) {
      throw new Error('Received expired authentication token');
    }
    
    // Save authentication data securely
    saveAuthToken(token);
    saveUserData(user);
    
    // Log successful authentication (without sensitive data)
    console.log('✅ Authentication processed successfully', {
      userId: user.sphinx_id,
      email: user.email?.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      timestamp: new Date().toISOString(),
    });
    
    // Navigate after short delay to ensure data is saved
    setTimeout(() => {
      try {
        router.push('/');
      } catch (navError) {
        console.error('Navigation failed:', navError);
        // Fallback navigation
        window.location.href = '/';
      }
    }, 500);
    
  } catch (error) {
    console.error('Auth success handling failed:', error);
    
    // Clean up any partially saved data
    try {
      tokenUtils.removeAuthToken();
      userDataUtils.clearUserData();
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
    
    throw new Error('Authentication processing failed. Please try logging in again.');
  }
};

/**
 * Secure session validation
 */
export const validateSession = (): { isValid: boolean; user?: any; token?: string } => {
  try {
    const token = tokenUtils.getAuthToken();
    const user = userDataUtils.getUserData();
    
    if (!token || !user) {
      return { isValid: false };
    }
    
    // Check token expiration
    if (tokenUtils.isTokenExpired(token)) {
      console.log('Session expired due to token expiration');
      tokenUtils.removeAuthToken();
      userDataUtils.clearUserData();
      return { isValid: false };
    }
    
    // Validate user data integrity
    if (!user.sphinx_id || !user.email) {
      console.log('Session invalid due to corrupted user data');
      userDataUtils.clearUserData();
      return { isValid: false };
    }
    
    return { isValid: true, user, token };
  } catch (error) {
    console.error('Session validation failed:', error);
    return { isValid: false };
  }
};

/**
 * Secure logout with cleanup
 */
export const handleLogout = async (): Promise<void> => {
  try {
    console.log('🚪 Processing secure logout...');
    
    // Clear all authentication data
    tokenUtils.removeAuthToken();
    userDataUtils.clearUserData();
    
    // Clear any cached data
    if (typeof window !== 'undefined') {
      // Clear any session-related data
      sessionStorage.clear();
      
      // Clear specific localStorage items if needed
      const keysToRemove = ['temp_data', 'form_cache', 'user_preferences'];
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore individual failures
        }
      });
    }
    
    console.log('✅ Logout completed successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout processing failed');
  }
};