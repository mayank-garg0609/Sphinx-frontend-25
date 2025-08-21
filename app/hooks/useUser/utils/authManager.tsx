import { AuthStatus } from "../types/userCache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthManagerSingleton {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("auth_tokens");
        if (stored) {
          const { accessToken, refreshToken } = JSON.parse(stored);
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;

          console.log("AuthManager initialized with tokens:", { 
            hasAccessToken: !!accessToken, 
            hasRefreshToken: !!refreshToken 
          });
        }
      } catch (error) {
        console.error("Failed to restore auth tokens:", error);
      }
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "auth_tokens",
          JSON.stringify({
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
          })
        );
        console.log("🔐 Tokens stored successfully");
      } catch (error) {
        console.error("Failed to store auth tokens:", error);
      }
    }
  }

  getAccessToken(): string | null {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("auth_tokens");
        if (stored) {
          const { accessToken } = JSON.parse(stored);
          this.accessToken = accessToken;
          return accessToken;
        }
      }
      return this.accessToken;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("auth_tokens");
        console.log("🔍 Raw stored tokens:", stored); // Debug log
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("🔍 Parsed tokens:", parsed); // Debug log
          const { refreshToken } = parsed;
          this.refreshToken = refreshToken;
          console.log("🔍 Extracted refresh token:", refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'); // Debug log
          return refreshToken;
        }
      }
      return this.refreshToken;
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  }

  async getValidAccessToken(): Promise<string | null> {
    const currentToken = this.getAccessToken();
    
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp > currentTime + 60) {
          console.log("🔑 Using existing valid token");
          return currentToken;
        }
        
        console.log("⏰ Token is expired or expiring soon, refreshing...");
      } catch (e) {
        console.log("⚠️ Could not decode token, attempting refresh...");
      }
    }

    if (this.refreshPromise) {
      console.log("⏳ Waiting for ongoing token refresh...");
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshAccessToken();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      
      if (error instanceof Error && 
          (error.message.includes('expired') || 
           error.message.includes('invalid') ||
           error.message.includes('No refresh token'))) {
        console.log("🗑️ Clearing tokens due to permanent auth failure");
        this.clearTokens();
      }
      
      return null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(retryCount = 0): Promise<string> {
    const MAX_RETRIES = 2;
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log(`🔄 Attempting to refresh access token... (attempt ${retryCount + 1})`);
    console.log(`🔍 Using refresh token: ${refreshToken.substring(0, 20)}...`); // Debug log

    try {
      const requestBody = {
        refreshToken: refreshToken, // ✅ Correct field name for your backend
      };
      
      console.log(`📤 Request body:`, requestBody); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Token refresh failed:", response.status, errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Refresh token expired or invalid");
        }
        
        if (response.status === 400) {
          if (errorData.message?.includes('required') && retryCount < MAX_RETRIES) {
            console.log(`⏳ Retrying token refresh after delay... (${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return this.refreshAccessToken(retryCount + 1);
          }
          throw new Error("Refresh token validation failed");
        }
        
        throw new Error(`Token refresh failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Token refresh successful, response data:", data);

      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token || refreshToken;

      if (!newAccessToken) {
        throw new Error("No access token in refresh response");
      }

      this.setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;

    } catch (error) {
      console.error("❌ Token refresh error:", error);
      
      if (retryCount < MAX_RETRIES && 
          error instanceof Error && 
          !error.message.includes('expired') && 
          !error.message.includes('invalid')) {
        
        console.log(`⏳ Retrying token refresh... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return this.refreshAccessToken(retryCount + 1);
      }
      
      throw error;
    }
  }

  clearTokens(): void {
    console.log("🗑️ Clearing all tokens");
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("auth_tokens");
        sessionStorage.removeItem("user_data");
      } catch (error) {
        console.error("Failed to clear tokens from storage:", error);
      }
    }

    // Optional: Inform backend to invalidate refresh token
    fetch(`${API_BASE_URL}/auth/logout`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).catch((error) => {
      console.error("Failed to notify backend of logout:", error);
    });
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null && this.getRefreshToken() !== null;
  }

  getAuthStatus(): AuthStatus {
    const accessToken = this.getAccessToken();
    let tokenExpiry: number | null = null;

    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        tokenExpiry = payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
      } catch (e) {
        console.error("Failed to decode token for expiry:", e);
      }
    }

    return {
      isAuthenticated: this.isAuthenticated(),
      hasValidToken: accessToken !== null,
      tokenExpiry,
    };
  }
}

export const authManager = new AuthManagerSingleton();