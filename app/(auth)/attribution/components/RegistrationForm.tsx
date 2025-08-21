"use client";

import { memo, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { RegisterFormData, registerSchema } from "@/app/schemas/registerSchema";
import { FORM_FIELDS } from "../utils/constants";
import { formClasses, buttonClasses } from "../utils/constants";
import { useRegistration } from "../hooks/useRegistrations";
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
  const redirectedFrom = searchParams.get("redirectedFrom");
  const { user, isLoggedIn, isLoading: userLoading } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      phone_no: "",
      college_name: "",
      city: "",
      state: "",
      college_id: "",
      college_branch: "",
      gender: "other",
    },
  });

  const { 
    handleRegistration, 
    isSubmitting, 
    retryCount, 
    checkStatus, 
    isCheckingStatus 
  } = useRegistration(reset);

  // Check if user is logged in
  useEffect(() => {
    if (!userLoading && !isLoggedIn) {
      console.log("User not logged in, redirecting to login");
      router.push("/login");
      return;
    }

    if (!userLoading && user) {
      console.log("User data loaded:", user);
      // Check registration status on component mount
      checkStatus();
    }
  }, [userLoading, isLoggedIn, user, router, checkStatus]);

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

  const onSubmit = async (data: RegisterFormData) => {
    // Clear any existing errors
    clearErrors();

    try {
      await handleRegistration(data);
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
  if (userLoading || isCheckingStatus) {
    return (
      <div className={formClasses}>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-zinc-300">
              {userLoading ? "Loading..." : "Checking profile status..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render form if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  const isFormDisabled = isSubmitting || isCheckingStatus;

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
      aria-label="Registration form"
      data-testid="registration-form"
    >
      <div className="flex flex-col gap-3 mt-2">
        <FormHeader logo={logo} />

        {/* User info display */}
        {user && (
          <div className="text-center text-sm text-zinc-400 pb-2">
            Completing profile for: <span className="text-white font-medium">{user.name}</span>
          </div>
        )}

        <fieldset 
          disabled={isFormDisabled}
          className="space-y-4 pt-1"
        >
          <legend className="sr-only">Profile information</legend>
          {memoizedFormFields}
        </fieldset>

        <div className="space-y-3 pt-6">
          <button
            type="submit"
            disabled={isFormDisabled || !isValid}
            className={`${buttonClasses} ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-describedby="submit-button-help"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                {retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Updating Profile..."}
              </span>
            ) : (
              "Update Your Profile"
            )}
          </button>

          {/* Form validation helper text */}
          <div id="submit-button-help" className="sr-only">
            {!isValid && "Please fill in all required fields correctly"}
          </div>

          {/* Skip button */}
          {redirectedFrom === "/sign-up" && (
            <button
              type="button"
              disabled={isFormDisabled}
              className="w-full mt-2 text-md text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
              onClick={handleSkip}
              aria-label="Skip profile completion for now"
            >
              Skip for now
            </button>
          )}

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
            ? `Retrying profile update, attempt ${retryCount} of 3` 
            : "Updating your profile, please wait"
          }
        </div>
      )}
    </form>
  );
});

RegistrationForm.displayName = "RegistrationForm";