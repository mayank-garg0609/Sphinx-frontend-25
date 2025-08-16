import { UserData, AuthStatus } from "../types/userCache";
import { authManager } from "./authManager";
import { userManager } from "./userManager";

export const getUserData = (): UserData | null => {
  return userManager.getUser();
};

export const getAuthToken = (): string | null => {
  return authManager.getAccessToken();
};

export const getValidAuthToken = async (): Promise<string | null> => {
  try {
    return await authManager.getValidAccessToken();
  } catch (error) {
    console.error("Failed to get valid auth token:", error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  return authManager.isAuthenticated() && userManager.getUser() !== null;
};

export const getAuthStatus = (): AuthStatus => {
  return authManager.getAuthStatus();
};

export const logoutUser = async (): Promise<void> => {
  try {
    authManager.clearTokens();
    userManager.clearUser();
    
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Failed to logout user:", error);
    throw error;
  }
};

export const refreshUserSession = async (): Promise<boolean> => {
  try {
    const validToken = await authManager.getValidAccessToken();
    return validToken !== null;
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