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
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (/(.)\1{2,}/.test(password)) score--; 
  if (/123|abc|qwe/i.test(password)) score--; 
  
  if (score >= 4) return "Strong";
  if (score >= 2) return "Medium";
  return "Weak";
};

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

  getAccessToken(): string | null {
    if (this.accessToken && this.isTokenValid()) {
      return this.accessToken;
    }

    if (typeof window !== "undefined") {
      try {
        const tokenData = sessionStorage.getItem("auth_tokens");
        if (!tokenData) return null;
        
        const parsed = JSON.parse(tokenData);
        if (parsed.accessToken && parsed.tokenExpiry > Date.now()) {
          this.accessToken = parsed.accessToken;
          this.refreshToken = parsed.refreshToken;
          this.tokenExpiry = parsed.tokenExpiry;
          return this.accessToken;
        }
      } catch (error) {
        console.error("Failed to get tokens from session:", error);
      }
    }
    
    return null;
  }

  isTokenValid(): boolean {
    return this.tokenExpiry !== null && this.tokenExpiry > Date.now() + 60000; // 1 minute buffer
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
        is_verified: Boolean(validatedUser.is_verified), // Should be true after OTP verification
        applied_ca: Boolean(validatedUser.applied_ca),
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

  getUser(): UserData | null {
    if (this.userData) {
      return this.userData;
    }

    if (typeof window !== "undefined") {
      try {
        const userData = sessionStorage.getItem("user_data");
        if (userData) {
          const parsed = JSON.parse(userData);
          // Ensure boolean types when retrieving from storage
          this.userData = {
            ...parsed,
            is_verified: Boolean(parsed.is_verified),
            applied_ca: Boolean(parsed.applied_ca),
          };
          return this.userData;
        }
      } catch (error) {
        console.error("Failed to get user data from session:", error);
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

export const tokenManager = new SignupTokenManager();
export const userManager = new SignupUserManager();
export const csrfManager = new SignupCSRFManager();

export async function handleAuthSuccess(
  accessToken: string,
  refreshToken: string | User,
  expiresInOrRouter: number | any,
  userOrRouter?: User | any,
  routerOptional?: any
): Promise<void> {
  try {
    console.log("🔄 Processing authentication success...");
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

    if (
      typeof refreshToken === "string" &&
      typeof expiresInOrRouter === "number" &&
      userOrRouter &&
      typeof userOrRouter === "object" &&
      "sphinx_id" in userOrRouter &&
      routerOptional
    ) {
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
      console.log("📋 Detected 3-parameter pattern");
      finalRefreshToken = "";
      finalExpiresIn = 3600;
      finalUser = refreshToken as User;
      finalRouter = expiresInOrRouter;
    } else if (
      typeof refreshToken === "string" &&
      typeof expiresInOrRouter === "object" &&
      expiresInOrRouter !== null &&
      "sphinx_id" in expiresInOrRouter
    ) {
      console.log("📋 Detected 4-parameter pattern (missing expiresIn)");
      finalRefreshToken = refreshToken;
      finalExpiresIn = 3600;
      finalUser = expiresInOrRouter as User;
      finalRouter = userOrRouter;
    } else {
      console.warn("⚠️ Unrecognized parameter pattern, attempting fallback detection");
      
      const userParam = [refreshToken, expiresInOrRouter, userOrRouter].find(
        param => param && typeof param === "object" && "sphinx_id" in param
      ) as User | undefined;

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

    if (finalRouter && typeof finalRouter.push !== 'function') {
      console.warn("Invalid router object, proceeding without it");
      finalRouter = null;
    }

    if (isNaN(finalExpiresIn) || finalExpiresIn <= 0) {
      finalExpiresIn = 3600;
      console.warn("⚠️ Invalid expiresIn, using default value:", finalExpiresIn);
    }

    console.log("🔑 Final authentication details:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!finalRefreshToken,
      expiresIn: finalExpiresIn,
      userId: finalUser.sphinx_id,
      userName: finalUser.name,
      userEmail: finalUser.email,
      userVerified: finalUser.is_verified,
      hasRouter: !!finalRouter
    });

    // Store tokens
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
      tokenManager.setTokens(accessToken, "", finalExpiresIn);
    }

    // Store user data
    userManager.setUser(finalUser);

    console.log("✅ Authentication setup complete - user is verified and authenticated");

    // Don't navigate automatically - let the component handle navigation
  } catch (error) {
    console.error("❌ Auth success handling failed:", error);
    throw new Error("Account created but setup failed. Please try logging in.");
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

// Signup-specific header functions
export const getSignupHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};

// Get stored email for resend functionality
export const getStoredUserEmail = (): string | null => {
  const userData = userManager.getUser();
  return userData ? userData.email : null;
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

// OTP validation helpers
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const formatOTP = (otp: string): string => {
  return otp.replace(/\D/g, '').slice(0, 6);
};