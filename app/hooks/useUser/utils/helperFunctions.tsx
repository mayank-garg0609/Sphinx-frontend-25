import { UserData, User, AuthStatus } from "../types/userCache";
import { authManager } from "./authManager";
import { userManager } from "./userManager";

export const getUserData = (): UserData | null => {
  return userManager.getUser();
};

export const getAuthToken = (): string | null => {
  const token = authManager.getAccessToken();
  console.log("📦 getAuthToken →", !!token);
  return token;
};

export const getValidAuthToken = async (): Promise<string | null> => {
  try {
    const token = await authManager.getValidAccessToken();
    console.log("🔑 getValidAuthToken →", !!token);
    return token;
  } catch (error) {
    console.error("Failed to get valid auth token:", error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  const hasValidToken = authManager.isAuthenticated();
  const hasUserData = userManager.getUser() !== null;
  const result = hasValidToken && hasUserData;

  console.log("🔍 isUserLoggedIn →", result, { hasValidToken, hasUserData });
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
      // Clear all auth-related storage
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = "/login";
    }

    console.log("✅ User logged out successfully");
  } catch (error) {
    console.error("❌ Failed to logout user:", error);
    throw error;
  }
};

export const refreshUserSession = async (): Promise<boolean> => {
  try {
    const validToken = await authManager.getValidAccessToken();
    if (!validToken) {
      console.log("❌ Token refresh failed");
      return false;
    }

    // Ensure user data is still available
    const user = userManager.getUser();
    const success = user !== null;
    
    console.log("🔄 Session refresh:", { success, hasUser: !!user });
    return success;
  } catch (error) {
    console.error("❌ Failed to refresh user session:", error);
    return false;
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
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

// Utility function to check if user needs to be redirected
export const checkAuthRedirect = (currentPath: string): string | null => {
  const isLoggedIn = isUserLoggedIn();
  const isAuthPage = ['/login', '/signup'].includes(currentPath);
  
  if (isLoggedIn && isAuthPage) {
    return '/profile'; // Redirect logged-in users away from auth pages
  }
  
  if (!isLoggedIn && !isAuthPage && currentPath !== '/') {
    return '/login'; // Redirect non-logged-in users to login (except home page)
  }
  
  return null; // No redirect needed
};

// Helper to set user data (for use after successful auth)
export const setUserData = (user: User): void => {
  userManager.setUser(user);
};

// Helper to update specific user fields
export const updateUserData = (updates: Partial<UserData>): void => {
  userManager.updateUser(updates);
};

// Helper to get user by specific field
export const getUserByField = <K extends keyof UserData>(
  field: K, 
  value: UserData[K]
): UserData | null => {
  const user = getUserData();
  return user && user[field] === value ? user : null;
};

// Helper to check user permissions
export const hasPermission = (permission: string): boolean => {
  const user = getUserData();
  if (!user) return false;
  
  // Add your permission logic here based on user role
  switch (user.role.toLowerCase()) {
    case 'admin':
      return true; // Admin has all permissions
    case 'moderator':
      return ['read', 'write', 'moderate'].includes(permission);
    case 'user':
      return ['read'].includes(permission);
    default:
      return false;
  }
};

// Helper to check if user can perform specific actions
export const canPerformAction = (action: string): boolean => {
  const user = getUserData();
  if (!user) return false;

  switch (action) {
    case 'apply_ca':
      return user.is_verified && !user.applied_ca;
    case 'access_dashboard':
      return user.is_verified;
    case 'edit_profile':
      return true; // All users can edit their profile
    default:
      return false;
  }
};