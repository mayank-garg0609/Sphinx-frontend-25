import { useState, useCallback, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import {
  RegistrationData,
  registrationSchema,
} from "@/app/schemas/registrationSchema";
import { useUser } from "@/app/hooks/useUser/useUser";
import { fetchProfileData } from "../utils/api";
import { getAuthToken, clearAuthData } from "../utils/auth";
import { canMakeRequest } from "../utils/requestTracker";
import { handleApiError } from "../utils/api";
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface UseProfileReturn {
  profile: RegistrationData | null;
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
  const { user, isLoggedIn, isLoading, refreshUserData } = useUser();

  const [profile, setProfile] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [canRetry, setCanRetry] = useState<boolean>(true);

  const loadProfile = useCallback(
    async (showRefreshing: boolean = false): Promise<void> => {
      const token = getAuthToken();

      if (!token || !user) {
        console.log("🚨 No auth token or user data found");
        setError("Please log in to view your profile.");
        setLoading(false);
        setCanRetry(false);
        return;
      }

      if (!canMakeRequest()) {
        setError("Request limit exceeded. Please wait before trying again.");
        setLoading(false);
        setCanRetry(false);
        return;
      }

      try {
        if (showRefreshing) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);
        setCanRetry(true);

        const data = await fetchProfileData(token);

        const parsed = registrationSchema.safeParse(data);
        console.log(parsed);

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
          console.log("✅ Profile loaded and validated successfully");
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
          refreshUserData,
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
    [router, retryCount, user, refreshUserData]
  );

  const handleRefresh = useCallback((): void => {
    if (!isRefreshing && canMakeRequest()) {
      console.log("🔄 Manual refresh triggered");
      setRetryCount(0);
      setCanRetry(true);
      loadProfile(true);
    }
  }, [loadProfile, isRefreshing]);

  const handleRetry = useCallback((): void => {
    if (canMakeRequest()) {
      console.log("🔄 Manual retry triggered");
      setRetryCount(0);
      setCanRetry(true);
      loadProfile(false);
    }
  }, [loadProfile]);

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && !isLoading && !hasLoadedOnce) {
      loadProfile();
      setHasLoadedOnce(true);
    }
  }, [isLoggedIn, user, isLoading, loadProfile, hasLoadedOnce]);

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
