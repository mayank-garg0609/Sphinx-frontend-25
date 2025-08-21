import { z } from "zod";
import type { UserData, User, PasswordStrength } from "../types/authTypes";

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

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return "";
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Common patterns penalty
  if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score--; // Sequential patterns
  
  if (score >= 4) return "Strong";
  if (score >= 2) return "Medium";
  return "Weak";
};

// Simple token manager for signup (no refresh logic)
class SignupTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + expiresIn * 1000;

    // Save to sessionStorage
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
        console.log("✅ Tokens stored successfully");
      } catch (error) {
        console.error("Failed to store tokens in session:", error);
      }
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("auth_tokens");
      } catch (error) {
        console.error("Failed to clear tokens from session:", error);
      }
    }
  }
}

// Simple user manager for signup
class SignupUserManager {
  private userData: UserData | null = null;

  setUser(user: User): void {
    try {
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
          console.log("✅ User data stored successfully");
        } catch (error) {
          console.error("Failed to store user data in session:", error);
        }
      }
    } catch (error) {
      console.error("User validation failed:", error);
      throw new Error("Invalid user data received");
    }
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

// Simple CSRF manager for signup
class SignupCSRFManager {
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
        return null;
      }

      const { csrfToken } = await response.json();
      this.csrfToken = csrfToken;
      return csrfToken;
    } catch (error) {
      console.warn("CSRF token fetch failed, proceeding without it:", error);
      return null;
    }
  }

  clearCSRFToken(): void {
    this.csrfToken = null;
  }
}

// Export signup-specific managers
export const tokenManager = new SignupTokenManager();
export const userManager = new SignupUserManager();
export const csrfManager = new SignupCSRFManager();

// Fixed handleAuthSuccess function with proper parameter handling
export async function handleAuthSuccess(
  accessToken: string,
  refreshToken: string | User,
  expiresInOrRouter: number | any,
  userOrRouter?: User | any,
  routerOptional?: any
): Promise<void> {
  try {
    console.log("🔄 Processing signup authentication success...");
    console.log("📥 Parameters received:", {
      accessToken: typeof accessToken,
      refreshToken: typeof refreshToken,
      expiresInOrRouter: typeof expiresInOrRouter,
      userOrRouter: typeof userOrRouter,
      routerOptional: typeof routerOptional
    });

    let finalRefreshToken: string;
    let finalExpiresIn: number;
    let finalUser: User;
    let finalRouter: any;

    // Detect parameter pattern based on types and properties
    if (
      typeof refreshToken === "string" &&
      typeof expiresInOrRouter === "number" &&
      userOrRouter &&
      typeof userOrRouter === "object" &&
      "sphinx_id" in userOrRouter &&
      routerOptional
    ) {
      // Pattern 1: (accessToken: string, refreshToken: string, expiresIn: number, user: User, router: any)
      console.log("📋 Detected 5-parameter pattern");
      finalRefreshToken = refreshToken;
      finalExpiresIn = expiresInOrRouter;
      finalUser = userOrRouter as User;
      finalRouter = routerOptional;
    } else if (
      typeof refreshToken === "object" &&
      refreshToken !== null &&
      "sphinx_id" in refreshToken &&
      typeof expiresInOrRouter === "object" &&
      expiresInOrRouter !== null
    ) {
      // Pattern 2: (accessToken: string, user: User, router: any) - userOrRouter and routerOptional are undefined
      console.log("📋 Detected 3-parameter pattern");
      finalRefreshToken = ""; // No refresh token provided
      finalExpiresIn = 3600; // Default 1 hour
      finalUser = refreshToken as User;
      finalRouter = expiresInOrRouter;
    } else if (
      typeof refreshToken === "string" &&
      typeof expiresInOrRouter === "object" &&
      expiresInOrRouter !== null &&
      "sphinx_id" in expiresInOrRouter
    ) {
      // Pattern 3: (accessToken: string, refreshToken: string, user: User, router: any) - missing expiresIn
      console.log("📋 Detected 4-parameter pattern (missing expiresIn)");
      finalRefreshToken = refreshToken;
      finalExpiresIn = 3600; // Default 1 hour
      finalUser = expiresInOrRouter as User;
      finalRouter = userOrRouter;
    } else {
      // Try to handle any other patterns or provide fallback
      console.warn("⚠️ Unrecognized parameter pattern, attempting fallback detection");
      
      // Look for user object in any of the parameters
      const userParam = [refreshToken, expiresInOrRouter, userOrRouter].find(
        param => param && typeof param === "object" && "sphinx_id" in param
      ) as User | undefined;

      // Look for router object (usually has push method)
      const routerParam = [expiresInOrRouter, userOrRouter, routerOptional].find(
        param => param && typeof param === "object" && typeof param.push === "function"
      );

      if (!userParam) {
        throw new Error("Could not identify user parameter");
      }

      if (!routerParam) {
        throw new Error("Could not identify router parameter");
      }

      finalRefreshToken = typeof refreshToken === "string" ? refreshToken : "";
      finalExpiresIn = typeof expiresInOrRouter === "number" ? expiresInOrRouter : 3600;
      finalUser = userParam;
      finalRouter = routerParam;
      
      console.log("📋 Used fallback parameter detection");
    }

    // Validate required parameters
    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error("Invalid access token");
    }

    if (!finalUser || typeof finalUser !== 'object' || !finalUser.sphinx_id) {
      throw new Error("Invalid user data");
    }

    if (!finalRouter || typeof finalRouter.push !== 'function') {
      throw new Error("Invalid router object");
    }

    // Ensure expiresIn is valid
    if (isNaN(finalExpiresIn) || finalExpiresIn <= 0) {
      finalExpiresIn = 3600; // Default to 1 hour
      console.warn("⚠️ Invalid expiresIn, using default value:", finalExpiresIn);
    }

    console.log("🔑 Final authentication details:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!finalRefreshToken,
      expiresIn: finalExpiresIn,
      userId: finalUser.sphinx_id,
      userName: finalUser.name,
      hasRouter: !!finalRouter
    });

    // Store tokens using simple signup token manager
    if (finalRefreshToken) {
      const tokenData = TokenResponseSchema.parse({
        accessToken,
        refreshToken: finalRefreshToken,
        expiresIn: finalExpiresIn,
      });

      tokenManager.setTokens(
        tokenData.accessToken,
        tokenData.refreshToken,
        tokenData.expiresIn
      );
    } else {
      // For cases where we only have access token
      tokenManager.setTokens(accessToken, "", finalExpiresIn);
    }

    // Store user data
    userManager.setUser(finalUser);

    console.log("✅ Signup authentication setup complete, redirecting to profile update");

    // Navigate to profile update page after successful signup
    setTimeout(() => {
      finalRouter.push("/update");
    }, 500);
  } catch (error) {
    console.error("❌ Signup auth success handling failed:", error);
    throw new Error("Sign up successful but setup failed. Please try again.");
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

// Signup-specific header function (no auth required)
export const getSignupHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};

// Validation helpers specific to signup
export const validateSignUpData = (data: any): boolean => {
  if (!data.name?.trim() || data.name.length < 2) {
    return false;
  }

  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return false;
  }

  if (!data.password?.trim() || data.password.length < 8) {
    return false;
  }

  if (data.password !== data.confirmPassword) {
    return false;
  }

  if (!data.agreed) {
    return false;
  }

  return true;
};

export const sanitizeSignUpData = (data: any) => {
  return {
    name: data.name?.trim(),
    email: data.email?.trim().toLowerCase(),
    password: data.password,
    confirmPassword: data.confirmPassword,
    agreed: Boolean(data.agreed),
  };
};