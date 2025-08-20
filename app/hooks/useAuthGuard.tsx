"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser/useUser";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    redirectTo = "/login",
    requireAuth = true,
    redirectAuthenticatedTo = "/profile"
  } = options;

  const { isLoggedIn, isLoading, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (requireAuth && !isLoggedIn) {
      console.log("🚪 Redirecting unauthenticated user to:", redirectTo);
      router.push(redirectTo);
    } else if (!requireAuth && isLoggedIn && redirectAuthenticatedTo) {
      console.log("🚪 Redirecting authenticated user to:", redirectAuthenticatedTo);
      router.push(redirectAuthenticatedTo);
    }
  }, [isLoggedIn, isLoading, requireAuth, redirectTo, redirectAuthenticatedTo, router]);

  return {
    isLoggedIn,
    isLoading,
    user,
    isAuthorized: requireAuth ? isLoggedIn : true,
  };
};