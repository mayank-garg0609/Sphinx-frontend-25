import { UserData, AuthStatus } from "../types/userCache";
import { authManager } from "./authManager";
import { userManager } from "./userManager";

export const getUserData = (): UserData | null => {
  return userManager.getUser();
};

export const getAuthToken = (): string | null => {
  const raw = authManager.getAccessToken();
  console.log("📦 getAuthToken →", raw);
  return raw;
};

export const getValidAuthToken = async (): Promise<string | null> => {
  try {
    const t = await authManager.getValidAccessToken();
    console.log("🔑 getValidAuthToken →", t);
    return t;
  } catch (error) {
    console.error("Failed to get valid auth token:", error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  const hasValidToken = authManager.isAuthenticated();
  const hasUserData = userManager.getUser() !== null;
  const result = hasValidToken && hasUserData;

  console.log("isUserLoggedIn →", result, { hasValidToken, hasUserData });

  return result;
};

export const getAuthStatus = (): AuthStatus => {
  return authManager.getAuthStatus();
};

export const logoutUser = async (): Promise<void> => {
  try {
    authManager.clearTokens();
    userManager.clearUser();

    if (typeof window !== "undefined") {
      sessionStorage.clear(); // ensure all persisted data is wiped
    }

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Failed to logout user:", error);
    throw error;
  }
};

export const refreshUserSession = async (): Promise<boolean> => {
  try {
    const validToken = await authManager.getValidAccessToken();
    if (!validToken) {
      return false;
    }

    // Ensure user data is still available
    const user = userManager.getUser();
    return user !== null;
  } catch (error) {
    console.error("Failed to refresh user session:", error);
    return false;
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const accessToken = await getValidAuthToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.error("Failed to get auth headers:", error);
  }

  return headers;
};
