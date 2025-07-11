import { useState, useEffect } from "react";
import { getUserData, isUserLoggedIn } from "./utils/helperFunctions";
import { UserData } from "./types/userCache";

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = getUserData();
        const loggedIn = isUserLoggedIn();

        setUser(userData);
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const refreshUserData = () => {
    const userData = getUserData();
    const loggedIn = isUserLoggedIn();

    setUser(userData);
    setIsLoggedIn(loggedIn);
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    refreshUserData,
  };
};
