import { useCallback, useState, useTransition } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
// import { RegisterFormData } from "../types/registrations";
import { submitAttribution } from "../services/registrationService";
import { slideInOut } from "@/app/animations/pageTrans";
import { attributionSchema,AttributionFormData } from "@/app/schemas/attributionSchema";

interface UseAttributionReturn {
  handleSubmission: (data: AttributionFormData) => Promise<void>;
  isSubmitting: boolean;
  retryCount: number;
}

export const useAttribution = (reset: () => void): UseAttributionReturn => {
  const router = useTransitionRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, startTransition] = useTransition();

  const handleSubmission = useCallback(
    async (data: AttributionFormData) => {
      console.log("🚀 Submitting Attribution:", data);

      startTransition(async () => {
        try {
          const result = await submitAttribution(data);

          if (result.success) {
            console.log("✅ Attribution successful:", result.data);

            reset();
            setRetryCount(0);

            toast.success(result.message || "Thank you for the information!");
            setTimeout(() => {
              router.push("/", { onTransitionReady: slideInOut });
            }, 1500);
          } else {
            console.error("❌ Attribution failed:", result.message);

            if (result.error === "AUTH_ERROR") {
              toast.error("Session expired. Redirecting to login...");
              setTimeout(() => {
                router.push("/login");
              }, 1500);
              return;
            }

            if (result.error === "INVALID_REFERRAL_CODE") {
              toast.error(result.message);
              return;
            }

            if (result.error === "REFERRAL_ALREADY_APPLIED") {
              toast.warning(result.message);
              setTimeout(() => {
                router.push("/", { onTransitionReady: slideInOut });
              }, 2000);
              return;
            }

            if (result.error === "VALIDATION_ERROR") {
              toast.error(result.message);
              return;
            }

            toast.error(result.message);

            if (
              result.error === "NETWORK_ERROR" ||
              result.error === "TIMEOUT_ERROR" ||
              result.error === "SERVER_ERROR"
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
                  handleSubmission(data);
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
          console.error("💥 Unexpected attribution error:", error);
          toast.error("An unexpected error occurred. Please try again.");

          if (retryCount < 2) {
            setRetryCount((prev) => prev + 1);
          }
        }
      });
    },
    [reset, router, retryCount]
  );

  return {
    handleSubmission,
    isSubmitting,
    retryCount,
  };
};
