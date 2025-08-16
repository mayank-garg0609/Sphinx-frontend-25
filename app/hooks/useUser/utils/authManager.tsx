import { AuthStatus } from "../types/userCache";

class AuthManagerSingleton {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + expiresIn * 1000;
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
    return Date.now() >= this.tokenExpiry - 300000;
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.isTokenExpired() && this.accessToken) {
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      this.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );

      return data.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
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
      tokenExpiry: this.tokenExpiry,
    };
  }
}

export const authManager = new AuthManagerSingleton();