import { useState, useEffect, useCallback } from "react";
import {
  getUserData,
  isUserLoggedIn,
  getAuthStatus,
  refreshUserSession,
  logoutUser as logoutUserUtil,
} from "./utils/helperFunctions";
import { userManager } from "./utils/userManager";
import { UserData, AuthStatus } from "./types/userCache";

interface UseUserReturn {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
  refreshUserData: () => void;
  logoutUser: () => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => void;
  refreshSession: () => Promise<boolean>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    hasValidToken: false,
    tokenExpiry: null,
  });

  const loadUserData = useCallback(() => {
    try {
      const userData = getUserData();
      const loggedIn = isUserLoggedIn();
      const currentAuthStatus = getAuthStatus();

      setUser(userData);
      setIsLoggedIn(loggedIn);
      setAuthStatus(currentAuthStatus);
    } catch (error) {
      console.error("Failed to load user data:", error);
      setUser(null);
      setIsLoggedIn(false);
      setAuthStatus({
        isAuthenticated: false,
        hasValidToken: false,
        tokenExpiry: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserData = useCallback(() => {
    loadUserData();
  }, [loadUserData]);

  const logoutUser = useCallback(async () => {
    try {
      await logoutUserUtil();
      setUser(null);
      setIsLoggedIn(false);
      setAuthStatus({
        isAuthenticated: false,
        hasValidToken: false,
        tokenExpiry: null,
      });
    } catch (error) {
      console.error("Failed to logout user:", error);
      throw error;
    }
  }, []);

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    try {
      userManager.updateUser(updates);
      const updatedUser = userManager.getUser();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const sessionValid = await refreshUserSession();
      if (sessionValid) {
        refreshUserData();
      } else {
        await logoutUser();
      }
      return sessionValid;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      await logoutUser();
      return false;
    }
  }, [refreshUserData, logoutUser]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const checkTokenExpiry = () => {
      const currentAuthStatus = getAuthStatus();
      setAuthStatus(currentAuthStatus);

      if (currentAuthStatus.tokenExpiry) {
        const timeUntilExpiry = currentAuthStatus.tokenExpiry - Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
          refreshSession();
        }
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn, refreshSession]);

  return {
    user,
    isLoggedIn,
    isLoading,
    authStatus,
    refreshUserData,
    logoutUser,
    updateUserData,
    refreshSession,
  };
};
