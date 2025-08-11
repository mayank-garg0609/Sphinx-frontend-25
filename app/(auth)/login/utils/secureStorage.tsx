// app/(auth)/utils/secureStorage.tsx - Enhanced Secure Storage
import { SECURITY_CONFIG } from './security';
import { sanitizeInput } from './validation';

/**
 * Secure token utilities with enhanced validation
 */
export const tokenUtils = {
  /**
   * Save authentication token with validation
   */
  saveAuthToken: (token: string): void => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token');
      }

      // Validate token format (basic JWT structure check)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Check for suspicious content
      if (/<script|javascript:|on\w+=/i.test(token)) {
        throw new Error('Suspicious token content');
      }

      // Store with timestamp for expiry tracking
      const tokenData = {
        token,
        timestamp: Date.now(),
        expires: Date.now() + SECURITY_CONFIG.auth.tokenExpiry,
      };

      localStorage.setItem('auth_token', JSON.stringify(tokenData));
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  },

  /**
   * Get authentication token with validation
   */
  getAuthToken: (): string | null => {
    try {
      const tokenDataStr = localStorage.getItem('auth_token');
      if (!tokenDataStr) return null;

      const tokenData = JSON.parse(tokenDataStr);
      
      // Check expiry
      if (Date.now() > tokenData.expires) {
        localStorage.removeItem('auth_token');
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Failed to get token:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token?: string): boolean => {
    try {
      const tokenDataStr = localStorage.getItem('auth_token');
      if (!tokenDataStr) return true;

      const tokenData = JSON.parse(tokenDataStr);
      return Date.now() > tokenData.expires;
    } catch (error) {
      return true;
    }
  },

  /**
   * Remove authentication token
   */
  removeAuthToken: (): void => {
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },
};

/**
 * Secure user data utilities
 */
export const userDataUtils = {
  /**
   * Save user data with validation
   */
  saveUserData: (user: any): void => {
    try {
      // Validate required fields
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user data');
      }

      if (!user.sphinx_id || !user.email || !user.name) {
        throw new Error('Missing required user fields');
      }

      // Sanitize user data
      const sanitizedUser = {
        ...user,
        name: sanitizeInput(user.name),
        email: sanitizeInput(user.email.toLowerCase()),
      };

      const userData = {
        user: sanitizedUser,
        timestamp: Date.now(),
        expires: Date.now() + SECURITY_CONFIG.auth.maxSessionDuration,
      };

      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw error;
    }
  },

  /**
   * Get user data with validation
   */
  getUserData: (): any | null => {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (!userDataStr) return null;

      const userData = JSON.parse(userDataStr);
      
      // Check expiry
      if (Date.now() > userData.expires) {
        localStorage.removeItem('user_data');
        return null;
      }

      return userData.user;
    } catch (error) {
      console.error('Failed to get user data:', error);
      localStorage.removeItem('user_data');
      return null;
    }
  },

  /**
   * Clear user data
   */
  clearUserData: (): void => {
    try {
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
};