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

// Import token and user managers from login utils (reusable)
import { 
  tokenManager, 
  userManager, 
  csrfManager 
} from "@/app/(auth)/login/utils/authHelpers";

// Handle authentication success for signup
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

    // Navigate to profile after successful signup
    setTimeout(() => {
      router.push("/update");
    }, 500);
  } catch (error) {
    console.error("Auth success handling failed:", error);
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

export const checkAuthStatus = (): boolean => {
  return tokenManager.isAuthenticated();
};

// Signup-specific header function (no auth required)
export const getSignupHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};

// // If you need CSRF for signup, use this version instead:
// export const getSignupHeadersWithCSRF = async (): Promise<Record<string, string>> => {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };

//   try {
//     // Only get CSRF token for signup, no auth required
//     const csrfToken = await csrfManager.getCSRFToken();
//     headers["X-CSRF-Token"] = csrfToken;
//   } catch (csrfError) {
//     console.warn("CSRF token not available for signup:", csrfError);
//     // Continue without CSRF for signup if not available
//   }

//   return headers;
// };

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

