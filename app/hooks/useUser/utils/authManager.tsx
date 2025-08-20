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
    }
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
          tokenExpiry
        });
      }
    } catch (error) {
      console.error("Failed to restore auth tokens:", error);
      this.clearTokens();
    }
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "auth_tokens",
          JSON.stringify({
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            tokenExpiry: this.tokenExpiry,
          })
        );
      } catch (error) {
        console.error("Failed to store auth tokens:", error);
      }
    }

    console.log("🔑 AuthManager set tokens:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiresIn,
      tokenExpiry: this.tokenExpiry
    });
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
    return Date.now() >= (this.tokenExpiry - 300000);
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

    console.log("🔄 Refreshing access token");

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid refresh response format");
      }

      // Update tokens
      this.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn || 3600
      );

      console.log("✅ Token refresh successful");
      return data.accessToken;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      this.clearTokens();
      throw error;
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("auth_tokens");
        
        // Also clear from storage in other components that might be using it
        sessionStorage.removeItem("user_data");
        sessionStorage.removeItem("user_preferences");
      } catch (error) {
        console.error("Failed to clear auth tokens:", error);
      }
    }

    // Optionally notify server about logout
    fetch("/api/auth/logout", { method: "POST" }).catch((error) => {
      console.error("Failed to notify server about logout:", error);
    });

    console.log("🔑 AuthManager cleared tokens");
  }

  isAuthenticated(): boolean {
    const hasValidToken = this.getAccessToken() !== null;
    console.log("🔍 isAuthenticated:", hasValidToken);
    return hasValidToken;
  }

  getAuthStatus(): AuthStatus {
    const hasValidToken = this.getAccessToken() !== null;
    return {
      isAuthenticated: hasValidToken,
      hasValidToken,
      tokenExpiry: this.tokenExpiry,
    };
  }

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiry(): number {
    if (!this.tokenExpiry) return 0;
    return Math.max(0, this.tokenExpiry - Date.now());
  }

  // Check if token needs refresh soon (within 5 minutes)
  needsRefresh(): boolean {
    if (!this.tokenExpiry) return false;
    const fiveMinutes = 5 * 60 * 1000;
    return this.getTimeUntilExpiry() < fiveMinutes;
  }
}

export const authManager = new AuthManagerSingleton();