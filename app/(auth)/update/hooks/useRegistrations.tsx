import { useCallback, useState, useTransition } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { RegisterFormData } from "../types/registrations";
import { registerUser, checkRegistrationStatus } from "../services/registrationService";
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
            
            // Reset form and retry count
            reset();
            setRetryCount(0);

            // Show success message
            toast.success(result.message || "Profile updated successfully!");

            // Refresh user data to get updated profile
            refreshUserData();

            // Redirect after success
            setTimeout(() => {
              router.push("/", { onTransitionReady: slideInOut });
            }, 2000);
          } else {
            console.error("❌ Registration failed:", result.message);
            
            // Handle specific error cases
            if (result.error === 'AUTH_ERROR') {
              toast.error("Session expired. Redirecting to login...");
              setTimeout(() => {
                router.push("/login");
              }, 1500);
              return;
            }

            if (result.error === 'VALIDATION_ERROR') {
              toast.error(result.message);
              return;
            }

            // Show error message
            toast.error(result.message);

            // Increment retry count for retryable errors
            if (result.error === 'NETWORK_ERROR' || result.error === 'TIMEOUT_ERROR') {
              if (retryCount < 3) {
                setRetryCount(prev => prev + 1);
                
                // Show retry message
                const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
                toast.info(`Retrying in ${retryDelay / 1000}s... (${retryCount + 1}/3)`);
                
                // Auto-retry after delay
                setTimeout(() => {
                  console.log(`🔄 Auto-retry attempt ${retryCount + 1}`);
                  handleRegistration(data);
                }, retryDelay);
              } else {
                toast.error("Multiple attempts failed. Please try again later.");
                setRetryCount(0);
              }
            }
          }
        } catch (error) {
          console.error("💥 Unexpected registration error:", error);
          toast.error("An unexpected error occurred. Please try again.");
          
          // Increment retry count for unexpected errors
          if (retryCount < 2) {
            setRetryCount(prev => prev + 1);
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
          router.push("/", { onTransitionReady: slideInOut });
        }, 1500);
      } else if (status.missingFields && status.missingFields.length > 0) {
        console.log("Missing fields:", status.missingFields);
        toast.info(`Please complete: ${status.missingFields.join(', ')}`);
      }
    } catch (error) {
      console.error("Failed to check registration status:", error);
      // Don't show error toast for status check failures
    } finally {
      setIsCheckingStatus(false);
    }
  }, [router]);

  return { 
    handleRegistration, 
    isSubmitting, 
    retryCount, 
    checkStatus, 
    isCheckingStatus 
  };
};