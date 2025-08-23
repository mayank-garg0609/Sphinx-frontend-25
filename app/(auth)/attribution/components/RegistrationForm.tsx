"use client";

import { memo, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
// import { RegisterFormData } from "../types/registrations";
import { attributionSchema,AttributionFormData } from "@/app/schemas/attributionSchema";
import { FORM_FIELDS } from "../utils/constants";
import { formClasses, buttonClasses } from "../utils/constants";
import { useAttribution } from "../hooks/useAttribution";
import { useUser } from "@/app/hooks/useUser/useUser";
import { FormField } from "./FormField";
import { LoadingSpinner } from "./LoadingSpinner";
import { FormHeader } from "./FormHeader";
import { slideInOut } from "@/app/animations/pageTrans";

interface RegistrationFormProps {
  logo: any;
}

export const RegistrationForm = memo<RegistrationFormProps>(({ logo }) => {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, isLoading: userLoading } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    clearErrors,
  } = useForm<AttributionFormData>({
    resolver: zodResolver(attributionSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      refCode: "",
      source: "",
    },
  });

  const { 
    handleSubmission, 
    isSubmitting, 
    retryCount
  } = useAttribution(reset);

  // Check if user is logged in (optional for attribution page)
  useEffect(() => {
    if (!userLoading && user) {
      console.log("User data loaded:", user);
    }
  }, [userLoading, user]);

  // Watch form values for better UX feedback
  const watchedValues = watch();
  const hasFormData = Object.values(watchedValues).some(value => value?.trim());

  const memoizedFormFields = useMemo(
    () =>
      FORM_FIELDS.map((field) => (
        <FormField
          key={field.key}
          field={field}
          register={register}
          error={errors[field.key]}
        />
      )),
    [register, errors]
  );

  const onSubmit = async (data: AttributionFormData) => {
    // Clear any existing errors
    clearErrors();

    try {
      await handleSubmission(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleSkip = () => {
    if (hasFormData) {
      const confirmed = window.confirm(
        "Are you sure you want to skip? Your entered data will be lost."
      );
      if (!confirmed) return;
    }
    
    router.push("/", { onTransitionReady: slideInOut });
  };

  // Show loading state while checking user authentication
  if (userLoading) {
    return (
      <div className={formClasses}>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-zinc-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const isFormDisabled = isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={formClasses}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #2d2d2d",
        position: "relative",
        zIndex: 10,
        isolation: "isolate",
      }}
      noValidate
      role="form"
      aria-label="Attribution form"
      data-testid="attribution-form"
    >
      <div className="flex flex-col gap-3 mt-2">
        <FormHeader logo={logo} />

        {/* User info display (if logged in) */}
        {user && (
          <div className="text-center text-sm text-zinc-400 pb-2">
            Welcome: <span className="text-white font-medium">{user.name}</span>
          </div>
        )}

        <fieldset 
          disabled={isFormDisabled}
          className="space-y-4 pt-1"
        >
          <legend className="sr-only">Attribution information</legend>
          {memoizedFormFields}
        </fieldset>

        <div className="space-y-3 pt-6">
          {/* Submit and Skip buttons side by side */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isFormDisabled || !isValid}
              className={`flex-1 ${buttonClasses} ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-describedby="submit-button-help"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  {retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Submitting..."}
                </span>
              ) : (
                "Submit"
              )}
            </button>

            <button
              type="button"
              disabled={isFormDisabled}
              className="flex-1 bg-transparent text-white font-semibold py-3 sm:py-3 rounded-lg border border-white/50 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] text-sm sm:text-base min-h-[48px] sm:min-h-[44px]"
              onClick={handleSkip}
              aria-label="Skip attribution form"
            >
              Skip
            </button>
          </div>

          {/* Form validation helper text */}
          <div id="submit-button-help" className="sr-only">
            {!isValid && "Please fill in all required fields correctly"}
          </div>

          {/* Retry count indicator */}
          {retryCount > 0 && (
            <div className="text-center text-sm text-yellow-400">
              Retry attempt: {retryCount}/3
            </div>
          )}

          {/* Form validation status */}
          {Object.keys(errors).length > 0 && (
            <div className="text-center text-sm text-red-400" role="alert">
              Please correct {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above
            </div>
          )}
        </div>
      </div>

      {/* Screen reader announcements */}
      {isSubmitting && (
        <div className="sr-only" role="status" aria-live="polite">
          {retryCount > 0 
            ? `Retrying submission, attempt ${retryCount} of 3` 
            : "Submitting your information, please wait"
          }
        </div>
      )}
    </form>
  );
});

RegistrationForm.displayName = "RegistrationForm";