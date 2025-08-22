import { useState, useCallback, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import {
  ProfileData,
  ProfileSchema,
} from "@/app/schemas/profileSchema";
import { useUser } from "@/app/hooks/useUser/useUser";
import { fetchProfileData } from "../utils/api";
import { canMakeRequest } from "../utils/requestTracker";
import { handleApiError } from "../utils/api";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  canRetry: boolean;
  retryCount: number;
  handleRefresh: () => void;
  handleRetry: () => void;
  loadProfile: (showRefreshing?: boolean) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const router = useTransitionRouter();
  // Updated to use the new useUser API structure
  const { user, isLoggedIn, isLoading, auth } = useUser();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [canRetry, setCanRetry] = useState<boolean>(true);

  const loadProfile = useCallback(
    async (showRefreshing: boolean = false): Promise<void> => {
      if (!isLoggedIn || !user) {
        console.log("🚨 User not authenticated or user data not available");
        setError("Please log in to view your profile.");
        setLoading(false);
        setCanRetry(false);
        return;
      }

      try {
        if (showRefreshing) {
          setIsRefreshing(true);
          console.log("🔄 Refreshing profile with enhanced auth...");
        } else {
          setLoading(true);
          console.log("📦 Loading profile with enhanced auth...");
        }

        setError(null);
        setCanRetry(true);

        if (showRefreshing) {
          console.log("🔄 Attempting to refresh session before profile fetch...");
          const sessionValid = await auth.refreshSession();
          if (!sessionValid) {
            throw new Error("Session refresh failed. Please log in again.");
          }
        }

        const data = await fetchProfileData();

        const parsed = ProfileSchema.safeParse(data);
        console.log("🔍 Profile validation result:", parsed.success ? "✅ Valid" : "❌ Invalid");

        if (!parsed.success) {
          console.error("❌ Profile validation error:", parsed.error.format());
          setError("Invalid profile data received from server.");

          if (retryCount < MAX_RETRIES && canMakeRequest()) {
            setRetryCount((prev) => prev + 1);
            toast.info(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => loadProfile(showRefreshing), RETRY_DELAY);
          } else {
            setCanRetry(false);
          }
        } else {
          console.log("✅ Profile loaded and validated successfully with enhanced auth");
          setProfile(parsed.data);
          setRetryCount(0);
          if (showRefreshing) {
            toast.success("Profile refreshed successfully!");
          }
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        console.error("🚨 Profile load error:", error);

        const shouldStopRetrying = handleApiError(
          error,
          router,
          auth.logout, // Updated to use auth.logout
          showRefreshing
        );
        setError(error.message || "Failed to load profile.");

        if (shouldStopRetrying) {
          setCanRetry(false);
        } else if (retryCount < MAX_RETRIES && canMakeRequest()) {
          setRetryCount((prev) => prev + 1);
          toast.info(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => loadProfile(showRefreshing), RETRY_DELAY);
        } else {
          setCanRetry(false);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [router, retryCount, user, isLoggedIn, auth.logout, auth.refreshSession]
  );

  const handleRefresh = useCallback((): void => {
    if (!isRefreshing && canMakeRequest()) {
      console.log("🔄 Manual refresh triggered with enhanced auth");
      setRetryCount(0);
      setCanRetry(true);
      loadProfile(true);
    }
  }, [loadProfile, isRefreshing]);

  const handleRetry = useCallback((): void => {
    if (canMakeRequest()) {
      console.log("🔄 Manual retry triggered with enhanced auth");
      setRetryCount(0);
      setCanRetry(true);
      loadProfile(false);
    }
  }, [loadProfile]);

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && !isLoading && !hasLoadedOnce) {
      console.log("🚀 Initial profile load triggered - User authenticated:", {
        userId: user.sphinx_id,
        userName: user.name,
        isLoggedIn,
        hasLoadedOnce
      });
      loadProfile();
      setHasLoadedOnce(true);
    } else if (!isLoggedIn && hasLoadedOnce) {
      // Reset state when user logs out
      console.log("🔄 User logged out, resetting profile state");
      setProfile(null);
      setError(null);
      setLoading(false);
      setIsRefreshing(false);
      setCanRetry(true);
      setRetryCount(0);
      setHasLoadedOnce(false);
    }
  }, [isLoggedIn, user, isLoading, loadProfile, hasLoadedOnce]);

  useEffect(() => {
    if (!isLoggedIn && profile) {
      console.log("🔄 Authentication lost, clearing profile data");
      setProfile(null);
      setError("Authentication required");
    }
  }, [isLoggedIn, profile]);

  return {
    profile,
    loading,
    error,
    isRefreshing,
    canRetry,
    retryCount,
    handleRefresh,
    handleRetry,
    loadProfile,
  };
};