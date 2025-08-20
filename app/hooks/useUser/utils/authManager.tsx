// Fixed authManager.tsx
import { AuthStatus } from "../types/userCache";

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthManagerSingleton {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;
  private storageKey = 'auth_tokens_v2'; // Changed key to avoid conflicts

  constructor() {
    if (typeof window !== "undefined") {
      this.restoreTokens();
    }
  }

  private restoreTokens(): void {
    try {
      // Try localStorage first (more persistent), then sessionStorage
      let stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        stored = sessionStorage.getItem(this.storageKey);
      }
      
      if (stored) {
        const { accessToken, refreshToken, tokenExpiry } = JSON.parse(stored);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiry = tokenExpiry;

        console.log("🔑 AuthManager restored tokens:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenExpiry,
          isExpired: this.isTokenExpired(),
          expiryDate: new Date(tokenExpiry).toISOString()
        });
      }
    } catch (error) {
      console.error("Failed to restore auth tokens:", error);
      this.clearTokens();
    }
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    console.log("🔑 AuthManager setting tokens:", {
      accessTokenPreview: accessToken.substring(0, 20) + "...",
      refreshTokenPreview: refreshToken.substring(0, 20) + "...",
      expiresIn,
      expiryDate: new Date(Date.now() + (expiresIn * 1000)).toISOString()
    });

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);

    if (typeof window !== "undefined") {
      try {
        const tokenData = {
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          tokenExpiry: this.tokenExpiry,
        };

        const tokenString = JSON.stringify(tokenData);
        
        // Store in both localStorage and sessionStorage for maximum reliability
        localStorage.setItem(this.storageKey, tokenString);
        sessionStorage.setItem(this.storageKey, tokenString);
        
        console.log("💾 Tokens stored in both localStorage and sessionStorage");
      } catch (error) {
        console.error("Failed to store auth tokens:", error);
      }
    }

    console.log("🔑 AuthManager tokens set successfully");
  }

  getAccessToken(): string | null {
    // Check if token is expired
    if (this.isTokenExpired()) {
      console.log("🔑 Access token is expired");
      return null;
    }
    
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    // Consider token expired 5 minutes early for safety
    const isExpired = Date.now() >= (this.tokenExpiry - 300000);
    
    if (isExpired) {
      console.log("⏰ Token expiry check:", {
        tokenExpiry: this.tokenExpiry,
        tokenExpiryDate: new Date(this.tokenExpiry).toISOString(),
        currentTime: Date.now(),
        currentDate: new Date().toISOString(),
        timeDiff: this.tokenExpiry - Date.now(),
        isExpired
      });
    }
    
    return isExpired;
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.isTokenExpired() && this.accessToken) {
      return this.accessToken;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      try {
        return await this.refreshPromise;
      } catch (error) {
        console.error("Failed to wait for token refresh:", error);
        return null;
      }
    }

    // Start token refresh
    this.refreshPromise = this.refreshAccessToken();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Refreshing access token with refresh token:", this.refreshToken.substring(0, 20) + "...");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      console.log("🔄 Refresh response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("🔄 Refresh response data:", data);

        // Handle different response formats
        let accessToken, refreshToken, expiresIn;

        if (data.data) {
          accessToken = data.data.accessToken || data.data.access_token;
          refreshToken = data.data.refreshToken || data.data.refresh_token;
          expiresIn = data.data.expiresIn || data.data.expires_in;
        } else {
          accessToken = data.accessToken || data.access_token;
          refreshToken = data.refreshToken || data.refresh_token || this.refreshToken;
          expiresIn = data.expiresIn || data.expires_in;
        }

        if (!accessToken) {
          throw new Error("No access token in refresh response");
        }

        // Update tokens
        this.setTokens(
          accessToken,
          refreshToken,
          expiresIn || 3600
        );

        console.log("✅ Token refresh successful");
        return accessToken;
      } else if (response.status === 401 || response.status === 403) {
        console.log("🔄 Refresh token is invalid or expired");
        this.clearTokens();
        throw new Error("Refresh token expired. Please log in again.");
      } else {
        console.log("❌ Refresh failed. Status:", response.status);
        throw new Error(`Token refresh failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      this.clearTokens();
      throw error;
    }
  }

  clearTokens(): void {
    console.log("🧹 AuthManager clearTokens() called");

    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.storageKey);
        // Also remove old storage keys if they exist
        localStorage.removeItem("auth_tokens");
        sessionStorage.removeItem("auth_tokens");
        console.log("🧹 Removed auth tokens from both storage types");
      } catch (error) {
        console.error("Failed to clear auth tokens:", error);
      }
    }

    console.log("🔑 AuthManager cleared tokens");
  }

  isAuthenticated(): boolean {
    // If we have a refresh token, we can potentially authenticate
    if (this.refreshToken && !this.getAccessToken()) {
      console.log("🔍 Has refresh token but access token expired - can refresh");
      return true;
    }
    
    const hasValidToken = this.getAccessToken() !== null;
    console.log("🔍 isAuthenticated:", hasValidToken, {
      hasAccessToken: !!this.accessToken,
      hasRefreshToken: !!this.refreshToken,
      isExpired: this.isTokenExpired()
    });
    return hasValidToken;
  }

  getAuthStatus(): AuthStatus {
    const hasValidToken = this.getAccessToken() !== null;
    const canRefresh = !!this.refreshToken;
    
    return {
      isAuthenticated: hasValidToken || canRefresh,
      hasValidToken,
      tokenExpiry: this.tokenExpiry,
    };
  }

  canAttemptAuth(): boolean {
    return !!this.refreshToken;
  }

  getTimeUntilExpiry(): number {
    if (!this.tokenExpiry) return 0;
    return Math.max(0, this.tokenExpiry - Date.now());
  }

  needsRefresh(): boolean {
    if (!this.tokenExpiry) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return this.getTimeUntilExpiry() < fiveMinutes;
  }
}

export const authManager = new AuthManagerSingleton();