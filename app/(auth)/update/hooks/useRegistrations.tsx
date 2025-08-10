import { useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { RegisterFormData } from "../types/registrations";
import { registerUser } from "../services/registrationService";
import { slideInOut } from "@/app/animations/pageTrans";

export const useRegistration = (reset: () => void) => {
  const router = useTransitionRouter();

  const handleRegistration = useCallback(
    async (data: RegisterFormData) => {
      console.log("🚀 Submitting Registration:", data);
      
      const result = await registerUser(data);
      
      if (result.success) {
        console.log("✅ Registration successful:", result.data);
        reset();
        toast.success(result.message);
        
        setTimeout(() => {
          router.push("/" , {onTransitionReady:slideInOut});
        }, 2000);
      } else {
        toast.error(result.message);
      }
    },
    [reset, router]
  );

  return { handleRegistration };
};