import { useCallback, useState } from "react";
import { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { LoginFormData } from "../../../schemas/loginSchema";
import { LoginResponse } from "../types/authTypes";
import { API_BASE_URL, MAX_RETRIES } from "../utils/constants";
import { handleAuthSuccess } from "../utils/authHelpers";
import { handleApiError, handleNetworkError } from "../utils/errorHandlers";

export const useAuth = (router: any, reset: UseFormReset<LoginFormData>) => {
  const [retryCount, setRetryCount] = useState(0);

  const loginUser = useCallback(
    async (data: LoginFormData) => {
      console.log("🔐 Logging in with:", { ...data, password: "[PROTECTED]" });

      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Server returned non-JSON response:", res.status);
          toast.error("Server configuration error. Please try again later.");
          return;
        }

        const result: LoginResponse = await res.json();

        if (res.ok) {
          console.log("✅ Login successful:", {
            ...result,
            user: { ...result.user, password: "[PROTECTED]" },
          });
          
          try {
            handleAuthSuccess(
              result.data?.token || result.token,
              result.data?.user || result.user,
              router
            );
            toast.success("✅ Logged in successfully!");
            reset();
            setRetryCount(0);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Navigation failed");
          }
        } else {
          handleApiError(res, result);
          if (retryCount < MAX_RETRIES) {
            setRetryCount((prev) => prev + 1);
          }
        }
      } catch (err) {
        handleNetworkError(err, retryCount, MAX_RETRIES);
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
        }
      }
    },
    [reset, router, retryCount]
  );

  return { loginUser, retryCount };
};