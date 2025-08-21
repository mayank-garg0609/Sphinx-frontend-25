import { useCallback, useState, useTransition } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { RegisterFormData } from "../types/registrations";
import {
  registerUser,
  checkRegistrationStatus,
} from "../services/registrationService";
import { slideInOut } from "@/app/animations/pageTrans";
import { useUser } from "@/app/hooks/useUser/useUser";

interface UseRegistrationReturn {
  handleRegistration: (data: RegisterFormData) => Promise<void>;
  isSubmitting: boolean;
  retryCount: number;
  checkStatus: () => Promise<void>;
  isCheckingStatus: boolean;
}

export const useRegistration = (reset: () => void): UseRegistrationReturn => {
  const router = useTransitionRouter();
  const { refreshUserData } = useUser();
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, startTransition] = useTransition();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const handleRegistration = useCallback(
    async (data: RegisterFormData) => {
      console.log("🚀 Submitting Registration:", data);

      startTransition(async () => {
        try {
          const result = await registerUser(data);

          if (result.success) {
            console.log("✅ Registration successful:", result.data);

            reset();
            setRetryCount(0);

            toast.success(result.message || "Profile updated successfully!");

            refreshUserData();

            setTimeout(() => {
              router.push("/profile", { onTransitionReady: slideInOut });
            }, 500);
          } else {
            console.error("❌ Registration failed:", result.message);

            if (result.error === "AUTH_ERROR") {
              toast.error("Session expired. Redirecting to login...");
              setTimeout(() => {
                router.push("/login");
              }, 500);
              return;
            }

            if (result.error === "VALIDATION_ERROR") {
              toast.error(result.message);
              return;
            }

            toast.error(result.message);

            if (
              result.error === "NETWORK_ERROR" ||
              result.error === "TIMEOUT_ERROR"
            ) {
              if (retryCount < 3) {
                setRetryCount((prev) => prev + 1);

                const retryDelay = Math.min(
                  1000 * Math.pow(2, retryCount),
                  5000
                );
                toast.info(
                  `Retrying in ${retryDelay / 1000}s... (${retryCount + 1}/3)`
                );

                setTimeout(() => {
                  console.log(`🔄 Auto-retry attempt ${retryCount + 1}`);
                  handleRegistration(data);
                }, retryDelay);
              } else {
                toast.error(
                  "Multiple attempts failed. Please try again later."
                );
                setRetryCount(0);
              }
            }
          }
        } catch (error) {
          console.error("💥 Unexpected registration error:", error);
          toast.error("An unexpected error occurred. Please try again.");

          if (retryCount < 2) {
            setRetryCount((prev) => prev + 1);
          }
        }
      });
    },
    [reset, router, refreshUserData, retryCount]
  );

  const checkStatus = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      const status = await checkRegistrationStatus();

      if (status.isComplete) {
        toast.info("Your profile is already complete!");
        setTimeout(() => {
          router.push("/profilw", { onTransitionReady: slideInOut });
        }, 500);
      } else if (status.missingFields && status.missingFields.length > 0) {
        console.log("Missing fields:", status.missingFields);
        toast.info(`Please complete: ${status.missingFields.join(", ")}`);
      }
    } catch (error) {
      console.error("Failed to check registration status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [router]);

  return {
    handleRegistration,
    isSubmitting,
    retryCount,
    checkStatus,
    isCheckingStatus,
  };
};
