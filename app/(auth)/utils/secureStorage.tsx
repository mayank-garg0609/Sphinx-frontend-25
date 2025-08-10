// app/(auth)/utils/secureStorage.tsx
import { SECURITY_CONFIG } from './security';

/**
 * Simple encryption/decryption utilities for sensitive data
 */
class SimpleEncryption {
  private key: string;
  
  constructor() {
    // Generate a consistent key from session data
    this.key = this.generateKey();
  }
  
  private generateKey(): string {
    // Use browser fingerprint for consistent key generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security key generation', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  }
  
  encrypt(text: string): string {
    try {
      // Simple XOR encryption (for demo purposes - use proper encryption in production)
      let encrypted = '';
      for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(
          text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
        );
      }
      return btoa(encrypted);
    } catch (error) {
      console.warn('Encryption failed, storing as plain text');
      return text;
    }
  }
  
  decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.warn('Decryption failed, returning as is');
      return encryptedText;
    }
  }
}

/**
 * Secure storage wrapper with encryption and expiration
 */
class SecureStorage {
  private encryption: SimpleEncryption;
  private prefix: string;
  
  constructor() {
    this.encryption = new SimpleEncryption();
    this.prefix = SECURITY_CONFIG.storage.useSecurePrefix ? 'sphinx_secure_' : '';
    
    // Setup periodic cleanup
    if (SECURITY_CONFIG.storage.autoCleanup) {
      this.setupCleanup();
    }
  }
  
  private setupCleanup(): void {
    setInterval(() => {
      this.cleanupExpired();
    }, SECURITY_CONFIG.storage.expirationCheck);
  }
  
  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }
  
  private createStorageValue(data: any, expiresAt?: number): string {
    const storageObject = {
      data,
      timestamp: Date.now(),
      expiresAt,
      version: '1.0',
    };
    
    const serialized = JSON.stringify(storageObject);
    
    if (SECURITY_CONFIG.storage.encryptSensitiveData) {
      return this.encryption.encrypt(serialized);
    }
    
    return serialized;
  }
  
  private parseStorageValue(value: string): { data: any; isExpired: boolean } | null {
    try {
      let parsed;
      
      if (SECURITY_CONFIG.storage.encryptSensitiveData) {
        const decrypted = this.encryption.decrypt(value);
        parsed = JSON.parse(decrypted);
      } else {
        parsed = JSON.parse(value);
      }
      
      const isExpired = parsed.expiresAt && Date.now() > parsed.expiresAt;
      
      return { data: parsed.data, isExpired };
    } catch (error) {
      console.warn('Failed to parse storage value:', error);
      return null;
    }
  }
  
  setItem(key: string, value: any, expirationMs?: number): void {
    try {
      const expiresAt = expirationMs ? Date.now() + expirationMs : undefined;
      const storageValue = this.createStorageValue(value, expiresAt);
      localStorage.setItem(this.getStorageKey(key), storageValue);
    } catch (error) {
      console.error('Failed to set storage item:', error);
    }
  }
  
  getItem(key: string): any | null {
    try {
      const storageValue = localStorage.getItem(this.getStorageKey(key));
      if (!storageValue) return null;
      
      const parsed = this.parseStorageValue(storageValue);
      if (!parsed) return null;
      
      if (parsed.isExpired) {
        this.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return null;
    }
  }
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error('Failed to remove storage item:', error);
    }
  }
  
  cleanupExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = this.parseStorageValue(value);
            if (parsed?.isExpired) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to cleanup expired items:', error);
    }
  }
  
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const secureStorage = new SecureStorage();

/**
 * Token utilities with security enhancements
 */
export const tokenUtils = {
  saveAuthToken: (token: string): void => {
    try {
      // Validate token format (basic JWT structure check)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Store with expiration based on security config
      secureStorage.setItem('auth_token', token, SECURITY_CONFIG.session.maxAge);
      
      // Set token refresh reminder
      secureStorage.setItem(
        'token_refresh_due', 
        Date.now() + SECURITY_CONFIG.session.refreshThreshold,
        SECURITY_CONFIG.session.maxAge
      );
    } catch (error) {
      console.error('Failed to save auth token:', error);
      throw new Error('Token storage failed');
    }
  },
  
  getAuthToken: (): string | null => {
    try {
      const token = secureStorage.getItem('auth_token');
      if (!token) return null;
      
      // Check if token needs refresh
      const refreshDue = secureStorage.getItem('token_refresh_due');
      if (refreshDue && Date.now() > refreshDue) {
        console.info('Token refresh recommended');
        // Could trigger token refresh here
      }
      
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  },
  
  removeAuthToken: (): void => {
    try {
      secureStorage.removeItem('auth_token');
      secureStorage.removeItem('token_refresh_due');
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true; // Treat invalid tokens as expired
    }
  },
};

/**
 * User data utilities with enhanced security
 */
export const userDataUtils = {
  saveUserData: (user: any): void => {
    try {
      // Sanitize user data before storage
      const sanitizedUser = {
        sphinx_id: user.sphinx_id,
        name: user.name?.substring(0, 100), // Limit length
        email: user.email?.toLowerCase(),
        role: user.role,
        is_verified: Boolean(user.is_verified),
        applied_ca: Boolean(user.applied_ca),
        created_at: user.created_at,
        last_login: new Date().toISOString(),
      };
      
      // Store with session expiration
      secureStorage.setItem('user_data', sanitizedUser, SECURITY_CONFIG.session.maxAge);
      
      // Store user preferences if not exists
      const existingPrefs = secureStorage.getItem('user_preferences');
      if (!existingPrefs) {
        const defaultPrefs = {
          theme: 'dark',
          notifications: true,
          language: 'en',
          security_notifications: true,
        };
        secureStorage.setItem('user_preferences', defaultPrefs, SECURITY_CONFIG.session.maxAge);
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw new Error('User data storage failed');
    }
  },
  
  getUserData: (): any | null => {
    try {
      return secureStorage.getItem('user_data');
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },
  
  clearUserData: (): void => {
    try {
      secureStorage.removeItem('user_data');
      secureStorage.removeItem('user_preferences');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
};