import { SECURITY_CONFIG } from './security';
import { sanitizeInput } from './validation';

export interface SecureApiError extends Error {
  response?: Response;
  data?: any;
  security?: {
    rateLimitRemaining: number;
    rateLimitReset: number;
  };
}

/**
 * Rate limiting implementation
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.api.rateLimitWindow;
    
    const userAttempts = this.attempts.get(identifier) || [];
    const recentAttempts = userAttempts.filter(timestamp => timestamp > windowStart);
    
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length >= SECURITY_CONFIG.api.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    userAttempts.push(now);
    this.attempts.set(identifier, userAttempts);
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.api.rateLimitWindow;
    
    const userAttempts = this.attempts.get(identifier) || [];
    const recentAttempts = userAttempts.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, SECURITY_CONFIG.api.maxAttempts - recentAttempts.length);
  }
}

const rateLimiter = new RateLimiter();

/**
 * Secure API client with comprehensive protection
 */
class SecureApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.timeout = SECURITY_CONFIG.api.timeout;
  }

  /**
   * Create secure request with CSRF and rate limiting protection
   */
  private async secureRequest(
    endpoint: string,
    options: RequestInit = {},
    identifier?: string
  ): Promise<any> {
    // Rate limiting check
    if (identifier && rateLimiter.isRateLimited(identifier)) {
      const error = new Error('Rate limited. Too many attempts. Please wait and try again.') as SecureApiError;
      error.security = {
        rateLimitRemaining: rateLimiter.getRemainingAttempts(identifier),
        rateLimitReset: Date.now() + SECURITY_CONFIG.api.rateLimitWindow,
      };
      throw error;
    }

    // Record attempt for rate limiting
    if (identifier) {
      rateLimiter.recordAttempt(identifier);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Ensure HTTPS in production
      const url = `${this.baseUrl}${endpoint}`;
      if (process.env.NODE_ENV === 'production' && !url.startsWith('https://')) {
        throw new Error('HTTPS required in production');
      }

      // Secure headers - using Record<string, string> for type safety
      const secureHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        'Cache-Control': 'no-cache',
      };

      // Add existing headers if provided
      if (options.headers) {
        const existingHeaders = options.headers as Record<string, string>;
        Object.assign(secureHeaders, existingHeaders);
      }

      // Add CSRF token if available
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        secureHeaders['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(url, {
        ...options,
        headers: secureHeaders,
        signal: controller.signal,
        credentials: 'same-origin', // CSRF protection
      });

      clearTimeout(timeoutId);

      // Parse response
      let result: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        
        // Validate JSON response for XSS
        if (/<script|javascript:|on\w+=/i.test(text)) {
          throw new Error('Suspicious response content detected');
        }
        
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON response from server');
        }
      } else {
        result = { error: 'Invalid response format' };
      }

      if (!response.ok) {
        const error = new Error(result.error || `HTTP ${response.status}`) as SecureApiError;
        error.response = response;
        error.data = result;
        
        if (identifier) {
          error.security = {
            rateLimitRemaining: rateLimiter.getRemainingAttempts(identifier),
            rateLimitReset: Date.now() + SECURITY_CONFIG.api.rateLimitWindow,
          };
        }
        
        throw error;
      }

      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout. Please check your connection and try again.') as SecureApiError;
        if (identifier) {
          timeoutError.security = {
            rateLimitRemaining: rateLimiter.getRemainingAttempts(identifier),
            rateLimitReset: Date.now() + SECURITY_CONFIG.api.rateLimitWindow,
          };
        }
        throw timeoutError;
      }

      // Re-throw SecureApiError instances
      if (error.response || error.data || error.security) {
        throw error;
      }

      // Wrap other errors
      const wrappedError = new Error(error.message || 'Network error occurred') as SecureApiError;
      if (identifier) {
        wrappedError.security = {
          rateLimitRemaining: rateLimiter.getRemainingAttempts(identifier),
          rateLimitReset: Date.now() + SECURITY_CONFIG.api.rateLimitWindow,
        };
      }
      throw wrappedError;
    }
  }

  /**
   * Get CSRF token (implement based on your CSRF strategy)
   */
  private getCSRFToken(): string | null {
    try {
      // Get CSRF token from meta tag, cookie, or localStorage
      const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (metaToken) return metaToken;

      // Fallback to cookie or other storage
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrf_token') {
          return decodeURIComponent(value);
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return null;
    }
  }

  /**
   * Secure login endpoint
   */
  async login(credentials: { email: string; password: string }): Promise<any> {
    // Sanitize inputs
    const sanitizedCredentials = {
      email: sanitizeInput(credentials.email.toLowerCase().trim()),
      password: credentials.password, // Don't sanitize password, just validate
    };

    // Validate inputs
    if (!sanitizedCredentials.email || !sanitizedCredentials.password) {
      throw new Error('Email and password are required');
    }

    return this.secureRequest(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(sanitizedCredentials),
      },
      sanitizedCredentials.email // Use email as rate limiting identifier
    );
  }

  /**
   * Secure Google authentication endpoint
   */
  async googleAuth(code: string): Promise<any> {
    // Validate code
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid Google authentication code');
    }

    // Check for suspicious patterns
    if (/<script|javascript:|on\w+=/i.test(code)) {
      throw new Error('Suspicious authentication code detected');
    }

    return this.secureRequest(
      '/api/auth/google',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      },
      'google_auth' // Generic identifier for Google auth rate limiting
    );
  }
}

export const authApi = new SecureApiClient();