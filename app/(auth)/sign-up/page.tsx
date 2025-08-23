"use client";

import { memo, useCallback, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { FormField } from "./components/FormFields";
import { PasswordValidationMessage } from "./components/PasswordValidationMessage";
import { SignUpHeader } from "./components/SignUpHeader";
import { BackgroundImage } from "./components/BackgroundImage";
import { ActionButtons } from "./components/ActionButtons";
import { TermsCheckbox } from "./components/TermsCheckbox";
import { LoginLink } from "./components/LoginLink";
import { OTPVerification } from "./components/OTPVerification";
import { ErrorBoundary } from "../login/components/ErrorBoundary";
import { useSignUpWithOTP, SignUpStep } from "./hooks/useSignUp";
import { FORM_FIELDS, FORM_STYLES, MOBILE_STYLES, ACCESSIBILITY, MESSAGES } from "./utils/constants";
import { handleComponentError } from "./utils/errorHandlers";
import { ErrorFallback } from "./components/ErrorFallback";

// Success completion step
const SignUpSuccess = memo(function SignUpSuccess() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Account Created Successfully!
          </h3>
          <p className="text-zinc-300">
            Your account has been created and verified. Redirecting to complete your profile...
          </p>
        </div>
      </div>
      
      <div className="animate-spin mx-auto w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
    </div>
  );
});

const SignUpFormInner = memo(function SignUpFormInner() {
  const router = useTransitionRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    handleGoogleSignup,
    isGoogleLoading,
    googlePopupClosed,
    retryCount,
    isRateLimited,
    isGoogleRateLimited,
    googleError,
    currentStep,
    userEmail,
    goBackToForm,
    handleOTPVerificationSuccess,
    resendOTP,
  } = useSignUpWithOTP(router);

  const password = watch("password");
  const isFormDisabled = isSubmitting || isGoogleLoading;
  const isAnyRateLimited = isRateLimited || isGoogleRateLimited;

  const getErrorMessages = useCallback(() => {
    return Object.values(errors)
      .map(error => {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          return error.message as string;
        }
        return null;
      })
      .filter(Boolean) as string[];
  }, [errors]);

  const getFormAriaDescribedBy = useCallback(() => {
    const describedBy = [];
    if (Object.keys(errors).length > 0) {
      describedBy.push('form-errors');
    }
    if (isAnyRateLimited) {
      describedBy.push('rate-limit-message');
    }
    return describedBy.length > 0 ? describedBy.join(' ') : undefined;
  }, [errors, isAnyRateLimited]);

  // Render based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case SignUpStep.OTP_VERIFICATION:
        return (
          <div className="space-y-6">
            <SignUpHeader />
            <OTPVerification
              email={userEmail}
              onVerificationSuccess={handleOTPVerificationSuccess}
              onBack={goBackToForm}
              onResend={resendOTP}
              disabled={isFormDisabled}
            />
          </div>
        );
        
      case SignUpStep.COMPLETE:
        return (
          <div className="space-y-6">
            <SignUpHeader />
            <SignUpSuccess />
          </div>
        );
        
      case SignUpStep.FORM:
      default:
        return (
          <>
            <SignUpHeader />
            
            <fieldset 
              disabled={isFormDisabled}
              className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7 2xl:pb-8"
            >
              <legend className="sr-only">Sign up credentials</legend>
              
              <FormField
                field={FORM_FIELDS.name}
                register={register}
                error={errors.name?.message?.toString()}
                disabled={isFormDisabled}
              />

              <FormField
                field={FORM_FIELDS.email}
                register={register}
                error={errors.email?.message?.toString()}
                disabled={isFormDisabled}
              />

              <FormField
                field={FORM_FIELDS.password}
                register={register}
                error={errors.password?.message?.toString()}
                disabled={isFormDisabled}
              >
                <PasswordValidationMessage
                  password={password || ""}
                  error={errors.password?.message?.toString()}
                />
              </FormField>

              <FormField
                field={FORM_FIELDS.confirmPassword}
                register={register}
                error={errors.confirmPassword?.message?.toString()}
                disabled={isFormDisabled}
              />

              <TermsCheckbox
                register={register}
                error={errors.agreed?.message?.toString()}
                disabled={isFormDisabled}
              />
            </fieldset>
            
            <ActionButtons
              isSubmitting={isSubmitting}
              onGoogleSignup={handleGoogleSignup}
              isGoogleLoading={isGoogleLoading}
              googlePopupClosed={googlePopupClosed}
              isRateLimited={isRateLimited}
              isGoogleRateLimited={isGoogleRateLimited}
              googleError={googleError}
            />
            
            <LoginLink />
            
            {retryCount > 0 && (
              <div 
                className="text-yellow-400 text-xs sm:text-sm text-center"
                role="status"
                aria-live="polite"
              >
                Retry attempt {retryCount}
              </div>
            )}
            
            {Object.keys(errors).length > 0 && (
              <div 
                id="form-errors"
                className="sr-only"
                role="alert"
                aria-live="assertive"
              >
                Form has {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}: {
                  getErrorMessages().join(', ')
                }
              </div>
            )}
            
            {(isSubmitting || isGoogleLoading) && (
              <div 
                className="sr-only"
                role="status"
                aria-live="polite"
              >
                {isSubmitting ? "Sending OTP to your email..." : MESSAGES.LOADING.AUTHENTICATING}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div
      className={FORM_STYLES.container}
      style={FORM_STYLES.scrollbar}
      role="main"
      aria-label={ACCESSIBILITY.ARIA_LABELS.SIGNUP_FORM}
      aria-describedby={getFormAriaDescribedBy()}
      data-testid="signup-container"
    >
      {currentStep === SignUpStep.FORM ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate 
          role="form"
          data-testid="signup-form"
        >
          {renderStepContent()}
        </form>
      ) : (
        <div>
          {renderStepContent()}
        </div>
      )}
    </div>
  );
});

const SignUpForm = memo(function SignUpForm() {
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
      <SignUpFormInner />
    </ErrorBoundary>
  );
});

export default function SignUpPage() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === "production") {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.title = "Sign Up - Sphinx'25";

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag("referrer", "strict-origin-when-cross-origin");
    setMetaTag("robots", "noindex, nofollow"); // Don't index auth pages

    const setViewportMeta = () => {
      let viewport = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement("meta");
        viewport.name = "viewport";
        document.head.appendChild(viewport);
      }
      viewport.content =
        "width=device-width, initial-scale=1.0, shrink-to-fit=no";
    };

    setViewportMeta();
  }, []);

  return (
    <main className={MOBILE_STYLES.container} role="main">
      <section aria-hidden="true" className="absolute inset-0 ">
        <BackgroundImage />
        <div className="absolute inset-0 bg-black/20 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-transparent" />
      </section>

      <section
        className={MOBILE_STYLES.formWrapper}
        aria-labelledby="signup-heading"
      >
        <div id="signup-form">
          <SignUpForm />
        </div>
      </section>
    </main>
  );
}