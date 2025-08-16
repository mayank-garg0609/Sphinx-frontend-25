// app/(auth)/login/utils/authHelpers.tsx
import { z } from 'zod';
import type { UserData, User } from '../types/authTypes';

// Validation schemas
const TokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.number().positive(),
});

const UserSchema = z.object({
  sphinx_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  is_verified: z.boolean(),
  applied_ca: z.boolean(),
  created_at: z.string().optional(),
  _id: z.string().optional(),
});

// In-memory token storage
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
    // Store refresh token in httpOnly cookie via API call
    this.storeRefreshTokenSecurely(refreshToken);
  }

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      return null;
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    // Check if token expires in next 5 minutes
    return Date.now() >= (this.tokenExpiry - 300000);
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.isTokenExpired() && this.accessToken) {
      return this.accessToken;
    }

    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshAccessToken();
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include httpOnly refresh token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const validatedData = TokenResponseSchema.parse(data);

      this.setTokens(
        validatedData.accessToken,
        validatedData.refreshToken,
        validatedData.expiresIn
      );

      return validatedData.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private async storeRefreshTokenSecurely(refreshToken: string): Promise<void> {
    try {
      await fetch('/api/auth/store-refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Failed to store refresh token securely:', error);
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    // Clear refresh token cookie
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(error => {
      console.error('Failed to clear refresh token:', error);
    });
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

// Singleton instance
export const tokenManager = new TokenManager();

// User data storage (non-sensitive data can stay in memory/sessionStorage)
class UserManager {
  private userData: UserData | null = null;

  setUser(user: User): void {
    const validatedUser = UserSchema.parse(user);
    
    this.userData = {
      sphinx_id: validatedUser.sphinx_id,
      name: validatedUser.name,
      email: validatedUser.email,
      role: validatedUser.role,
      is_verified: validatedUser.is_verified,
      applied_ca: validatedUser.applied_ca,
      last_login: new Date().toISOString(),
      created_at: validatedUser.created_at,
    };

    // Store non-sensitive user data in sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('user_data', JSON.stringify(this.userData));
      } catch (error) {
        console.error('Failed to store user data in session:', error);
      }
    }
  }

  getUser(): UserData | null {
    if (this.userData) {
      return this.userData;
    }

    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('user_data');
        if (stored) {
          this.userData = JSON.parse(stored);
          return this.userData;
        }
      } catch (error) {
        console.error('Failed to restore user data from session:', error);
      }
    }

    return null;
  }

  clearUser(): void {
    this.userData = null;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('user_data');
        sessionStorage.removeItem('user_preferences');
      } catch (error) {
        console.error('Failed to clear user data from session:', error);
      }
    }
  }
}

export const userManager = new UserManager();

// CSRF Token management
class CSRFManager {
  private csrfToken: string | null = null;

  async getCSRFToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch('/api/auth/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const { csrfToken } = await response.json();
      this.csrfToken = csrfToken;
      return csrfToken;
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
      throw error;
    }
  }

  clearCSRFToken(): void {
    this.csrfToken = null;
  }
}

export const csrfManager = new CSRFManager();

// Overloaded handleAuthSuccess function to handle both parameter patterns
export async function handleAuthSuccess(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  user: User,
  router: any
): Promise<void>;

export async function handleAuthSuccess(
  accessToken: string,
  user: User,
  router: any
): Promise<void>;

export async function handleAuthSuccess(
  accessToken: string,
  refreshTokenOrUser: string | User,
  expiresInOrRouter: number | any,
  userOrUndefined?: User,
  routerOrUndefined?: any
): Promise<void> {
  try {
    let refreshToken: string;
    let expiresIn: number;
    let user: User;
    let router: any;

    // Determine which overload is being used
    if (typeof refreshTokenOrUser === 'string' && typeof expiresInOrRouter === 'number' && userOrUndefined && routerOrUndefined) {
      // Full parameter version: (accessToken, refreshToken, expiresIn, user, router)
      refreshToken = refreshTokenOrUser;
      expiresIn = expiresInOrRouter;
      user = userOrUndefined;
      router = routerOrUndefined;
    } else if (typeof refreshTokenOrUser === 'object' && refreshTokenOrUser !== null) {
      // Simplified version: (accessToken, user, router) - for Google auth
      refreshToken = ''; // Google auth might not provide refresh token
      expiresIn = 3600; // Default 1 hour
      user = refreshTokenOrUser;
      router = expiresInOrRouter;
    } else {
      throw new Error('Invalid parameters for handleAuthSuccess');
    }

    // Validate tokens only if we have them
    if (refreshToken) {
      const tokenData = TokenResponseSchema.parse({
        accessToken,
        refreshToken,
        expiresIn,
      });

      // Store tokens securely
      tokenManager.setTokens(
        tokenData.accessToken,
        tokenData.refreshToken,
        tokenData.expiresIn
      );
    } else {
      // For Google auth without refresh token, just store access token
      tokenManager.setTokens(accessToken, '', expiresIn);
    }

    // Store user data
    userManager.setUser(user);

    // Navigate after successful auth
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  } catch (error) {
    console.error('Auth success handling failed:', error);
    throw new Error('Login successful but setup failed. Please try again.');
  }
}

// Logout handler
export const handleLogout = async (router: any): Promise<void> => {
  try {
    // Clear all auth data
    tokenManager.clearTokens();
    userManager.clearUser();
    csrfManager.clearCSRFToken();

    // Navigate to login
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Auth check helper
export const checkAuthStatus = (): boolean => {
  return tokenManager.isAuthenticated();
};

// Get authenticated API headers
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    // Add access token
    const accessToken = await tokenManager.getValidAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Add CSRF token
    const csrfToken = await csrfManager.getCSRFToken();
    headers['X-CSRF-Token'] = csrfToken;
  } catch (error) {
    console.error('Failed to get auth headers:', error);
    throw error;
  }

  return headers;
};