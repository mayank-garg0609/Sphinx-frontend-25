// Updated authHelpers.tsx with optional CSRF token handling

import { z } from "zod";
import type { UserData, User } from "../types/authTypes";

const TokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.union([z.number().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ),
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

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + expiresIn * 1000;
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
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
    // Skip server-side storage for now - store in memory only
    // Uncomment below if you have the /api/auth/store-refresh-token endpoint
    /*
    try {
      await fetch("/api/auth/store-refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Failed to store refresh token securely:", error);
    }
    */
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    // Skip server-side cleanup for now
    // Uncomment below if you have the /api/auth/logout endpoint  
    /*
    fetch("/api/auth/logout", {
      method: "POST",
    }).catch((error) => {
      console.error("Failed to clear refresh token:", error);
    });
    */
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const tokenManager = new TokenManager();

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

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("user_data", JSON.stringify(this.userData));
      } catch (error) {
        console.error("Failed to store user data in session:", error);
      }
    }
  }

  getUser(): UserData | null {
    if (this.userData) {
      return this.userData;
    }

    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user_data");
        if (stored) {
          this.userData = JSON.parse(stored);
          return this.userData;
        }
      } catch (error) {
        console.error("Failed to restore user data from session:", error);
      }
    }

    return null;
  }

  clearUser(): void {
    this.userData = null;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("user_data");
        sessionStorage.removeItem("user_preferences");
      } catch (error) {
        console.error("Failed to clear user data from session:", error);
      }
    }
  }
}

export const userManager = new UserManager();

class CSRFManager {
  private csrfToken: string | null = null;

  async getCSRFToken(): Promise<string | null> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch("/api/auth/csrf-token", {
        method: "GET",
      });

      if (!response.ok) {
        console.warn("CSRF token endpoint not available:", response.status);
        return null; // Return null instead of throwing
      }

      const { csrfToken } = await response.json();
      this.csrfToken = csrfToken;
      return csrfToken;
    } catch (error) {
      console.warn("CSRF token fetch failed, proceeding without it:", error);
      return null; // Return null instead of throwing
    }
  }

  clearCSRFToken(): void {
    this.csrfToken = null;
  }
}

export const csrfManager = new CSRFManager();

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

    if (
      typeof refreshTokenOrUser === "string" &&
      typeof expiresInOrRouter === "number" &&
      userOrUndefined &&
      routerOrUndefined
    ) {
      refreshToken = refreshTokenOrUser;
      expiresIn = expiresInOrRouter;
      user = userOrUndefined;
      router = routerOrUndefined;
    } else if (
      typeof refreshTokenOrUser === "object" &&
      refreshTokenOrUser !== null
    ) {
      refreshToken = "";
      expiresIn = 3600;
      user = refreshTokenOrUser;
      router = expiresInOrRouter;
    } else {
      throw new Error("Invalid parameters for handleAuthSuccess");
    }

    if (refreshToken) {
      const tokenData = TokenResponseSchema.parse({
        accessToken,
        refreshToken,
        expiresIn,
      });

      tokenManager.setTokens(
        tokenData.accessToken,
        tokenData.refreshToken,
        tokenData.expiresIn
      );
    } else {
      tokenManager.setTokens(accessToken, "", expiresIn);
    }

    userManager.setUser(user);

    setTimeout(() => {
      router.push("/profile");
    }, 500);
  } catch (error) {
    console.error("Auth success handling failed:", error);
    throw new Error("Login successful but setup failed. Please try again.");
  }
}

export const handleLogout = async (router: any): Promise<void> => {
  try {
    tokenManager.clearTokens();
    userManager.clearUser();
    csrfManager.clearCSRFToken();

    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const checkAuthStatus = (): boolean => {
  return tokenManager.isAuthenticated();
};

export const getAuthHeaders = async (
  skipTokenValidation = false
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    if (!skipTokenValidation) {
      const accessToken = await tokenManager.getValidAccessToken();
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    /*
    try {
      const csrfToken = await csrfManager.getCSRFToken();
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }
    } catch (csrfError) {
      console.warn("CSRF token not available, proceeding without it:", csrfError);
    }
    */
  } catch (error) {
    console.error("Failed to get auth headers:", error);

    if (skipTokenValidation) {
      return headers;
    }

    throw error;
  }

  return headers;
};

export const getMinimalAuthHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};