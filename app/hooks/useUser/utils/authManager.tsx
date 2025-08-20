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

  constructor() {
    if (typeof window !== "undefined") {
      this.restoreTokens();
      this.setupTokenWatcher();
    }
  }

  // Watch for tokens being cleared and log what's doing it
  private setupTokenWatcher(): void {
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;

    Storage.prototype.removeItem = function(key: string) {
      if (key === 'auth_tokens') {
        console.log("🚨 TOKENS BEING REMOVED!");
        console.trace("Token removal stack trace:");
      }
      return originalRemoveItem.call(this, key);
    };

    Storage.prototype.clear = function() {
      console.log("🚨 SESSION STORAGE BEING CLEARED!");
      console.trace("Storage clear stack trace:");
      return originalClear.call(this);
    };

    // Also watch for direct access to sessionStorage
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        return originalSessionStorage;
      },
      set(value) {
        console.log("🚨 SessionStorage being replaced!");
        console.trace();
        return value;
      }
    });
  }

  private restoreTokens(): void {
    try {
      const stored = sessionStorage.getItem("auth_tokens");
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

        console.log("💾 Storing tokens in sessionStorage...");
        sessionStorage.setItem("auth_tokens", JSON.stringify(tokenData));
        
        // Immediately verify they were stored
        setTimeout(() => {
          const verification = sessionStorage.getItem("auth_tokens");
          if (verification) {
            console.log("✅ Tokens verified in storage after 100ms");
          } else {
            console.log("🚨 TOKENS DISAPPEARED FROM STORAGE WITHIN 100MS!");
          }
        }, 100);

        setTimeout(() => {
          const verification = sessionStorage.getItem("auth_tokens");
          if (verification) {
            console.log("✅ Tokens still in storage after 1s");
          } else {
            console.log("🚨 TOKENS DISAPPEARED FROM STORAGE WITHIN 1 SECOND!");
          }
        }, 1000);

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
      
      // Try different possible refresh endpoints
      const possibleEndpoints = [
        `${API_BASE_URL}/auth/refresh`,
        `${API_BASE_URL}/auth/refresh-token`,
        `${API_BASE_URL}/api/auth/refresh`,
        `${API_BASE_URL}/user/refresh`
      ];

      let lastError: Error | null = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log("🔄 Trying refresh endpoint:", endpoint);
          
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.refreshToken}`,
            },
            body: JSON.stringify({
              refreshToken: this.refreshToken,
              refresh_token: this.refreshToken,
              token: this.refreshToken,
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

            console.log("✅ Token refresh successful with endpoint:", endpoint);
            return accessToken;
          } else if (response.status === 401 || response.status === 403) {
            console.log("🔄 Refresh token is invalid or expired at:", endpoint);
            lastError = new Error("Refresh token expired. Please log in again.");
          } else {
            console.log("❌ Refresh failed at endpoint:", endpoint, "Status:", response.status);
            lastError = new Error(`Token refresh failed: ${response.status}`);
          }
        } catch (fetchError) {
          console.log("❌ Network error with endpoint:", endpoint, fetchError);
          lastError = fetchError as Error;
        }
      }

      // If we get here, all endpoints failed
      console.error("❌ All refresh endpoints failed");
      this.clearTokens();
      throw lastError || new Error("All token refresh endpoints failed");

    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      this.clearTokens();
      throw error;
    }
  }

  clearTokens(): void {
    console.log("🧹 AuthManager clearTokens() called");
    console.trace("Clear tokens stack trace:");

    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("auth_tokens");
        console.log("🧹 Removed auth_tokens from sessionStorage");
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