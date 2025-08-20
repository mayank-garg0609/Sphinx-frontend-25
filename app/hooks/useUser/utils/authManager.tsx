import { AuthStatus } from "../types/userCache";

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

          console.log("AuthManager initialized with:", { accessToken, refreshToken });
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
        if (stored) {
          const { refreshToken } = JSON.parse(stored);
          this.refreshToken = refreshToken;
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
    if (this.accessToken) {
      return this.accessToken;
    }

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
      throw new Error("No refresh token available");
    }

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
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Expect backend to return { accessToken, refreshToken }
      this.setTokens(data.accessToken, data.refreshToken);

      return data.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_tokens");
    }

    fetch("/api/auth/logout", { method: "POST" }).catch((error) => {
      console.error("Failed to clear refresh token:", error);
    });
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  getAuthStatus(): AuthStatus {
    return {
      isAuthenticated: this.isAuthenticated(),
      hasValidToken: this.accessToken !== null,
      tokenExpiry: null, // no expiry tracking
    };
  }
}

export const authManager = new AuthManagerSingleton();
