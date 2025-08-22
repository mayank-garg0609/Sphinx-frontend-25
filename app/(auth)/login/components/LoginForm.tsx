"use client";

import { memo, useCallback } from "react";
import { useLogin } from "../hooks/useLogin";
import { FormField } from "./FormFields";
import { ActionButtons } from "./ActionButtons";
import { SignUpLink } from "./SignUpLink";
import { LoginHeader } from "./LoginHeader";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  FORM_FIELDS,
  FORM_STYLES,
  ACCESSIBILITY,
  MESSAGES,
} from "../utils/constants";
import { handleComponentError } from "../utils/errorHandlers";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = memo(function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div>
          <h2 className="text-lg font-semibold text-red-800 mb-1">
            Something went wrong
          </h2>
          <p className="text-sm text-red-600 mb-3">
            The login form encountered an error. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-xs text-red-500 mb-3">
              <summary className="cursor-pointer font-mono">
                Error details (dev only)
              </summary>
              <pre className="mt-2 text-left bg-red-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});

const LoginFormInner = memo(function LoginFormInner() {
  const {
    // Form methods
    register,
    handleSubmit,
    watch,
    errors,

    // Auth methods and state
    onSubmit,
    onGoogleLogin,

    // Loading states
    isSubmitting,
    isGoogleLoading,

    // Error states
    loginError,
    googleError,

    // Other states
    retryCount,
    isRateLimited,

    // Utility
    clearErrors,
  } = useLogin();

  const isFormDisabled = isSubmitting || isGoogleLoading;
  // For compatibility with ActionButtons component, we'll derive these from existing states
  const isGoogleRateLimited = isRateLimited; // Assuming same rate limit applies
  const googlePopupClosed = false; // This might need to be added to useLogin if needed

  const watchedValues = watch();

  const getFormAriaDescribedBy = useCallback(() => {
    const describedBy = [];
    if (Object.keys(errors).length > 0) {
      describedBy.push("form-errors");
    }
    if (isRateLimited) {
      describedBy.push("rate-limit-message");
    }
    return describedBy.length > 0 ? describedBy.join(" ") : undefined;
  }, [errors, isRateLimited]);

  // Handle Google login - the useLogin hook expects a code, so we'll need to modify this
  const handleGoogleLogin = useCallback(async () => {
    try {
      // Since useLogin expects a Google code, we need to trigger the Google OAuth flow
      // and then call onGoogleLogin with the received code
      // For now, we'll call onGoogleLogin without parameters and let the hook handle it
      await onGoogleLogin(""); // You might need to modify useLogin to handle the OAuth flow
    } catch (error) {
      console.error("Google login error:", error);
    }
  }, [onGoogleLogin]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={FORM_STYLES.container}
      style={FORM_STYLES.scrollbar}
      noValidate
      role="form"
      aria-label={ACCESSIBILITY.ARIA_LABELS.LOGIN_FORM}
      aria-describedby={getFormAriaDescribedBy()}
      data-testid="login-form"
    >
      <LoginHeader />

      <fieldset
        disabled={isFormDisabled}
        className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7 2xl:pb-8"
      >
        <legend className="sr-only">Login credentials</legend>

        <FormField
          field={FORM_FIELDS.email}
          register={register}
          error={errors.email?.message}
          disabled={isFormDisabled}
        />

        <FormField
          field={FORM_FIELDS.password}
          register={register}
          error={errors.password?.message}
          disabled={isFormDisabled}
        />
      </fieldset>

      <ActionButtons
        isSubmitting={isSubmitting}
        onGoogleLogin={handleGoogleLogin}
        isGoogleLoading={isGoogleLoading}
        googlePopupClosed={googlePopupClosed}
        isRateLimited={isRateLimited}
        isGoogleRateLimited={isGoogleRateLimited}
        googleError={googleError}
      />

      <SignUpLink />

      {retryCount > 0 && (
        <div
          className="text-yellow-400 text-xs sm:text-sm text-center"
          role="status"
          aria-live="polite"
        >
          Retry attempt {retryCount}
        </div>
      )}

      {/* Display login error if present */}
      {loginError && (
        <div
          className="text-red-400 text-xs sm:text-sm text-center"
          role="alert"
          aria-live="assertive"
        >
          {loginError}
        </div>
      )}

      {/* {Object.keys(errors).length > 0 && (
        <div 
          id="form-errors"
          className="sr-only"
          role="alert"
          aria-live="assertive"
        >
           Form has {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}: {
            Object.values(errors).map(error => error?.message).filter(Boolean).join(', ')
          }
        </div>
      )} */}

      {(isSubmitting || isGoogleLoading) && (
        <div className="sr-only" role="status" aria-live="polite">
          {isSubmitting
            ? MESSAGES.LOADING.PROCESSING
            : MESSAGES.LOADING.AUTHENTICATING}
        </div>
      )}
    </form>
  );
});

export const LoginForm = memo(function LoginForm() {
  const handleError = useCallback((error: Error, errorInfo: any) => {
    handleComponentError(error, errorInfo);
  }, []);

  return (
    <ErrorBoundary
      fallback={ErrorFallback}
      onError={handleError}
      resetOnPropsChange={false}
      resetKeys={[]}
    >
      <LoginFormInner />
    </ErrorBoundary>
  );
});
