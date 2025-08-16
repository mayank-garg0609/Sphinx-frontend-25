// app/(auth)/login/components/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransitionRouter } from 'next-view-transitions';
import { memo, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { loginSchema, type LoginFormData } from '@/app/schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { FormField } from './FormFields';
import { ActionButtons } from './ActionButtons';
import { SignUpLink } from './SignUpLink';
import { LoginHeader } from './LoginHeader';
import { FORM_FIELDS, FORM_STYLES, ACCESSIBILITY, MESSAGES } from '../utils/constants';
import { handleComponentError } from '../utils/errorHandlers';

// Error Fallback Component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = memo(function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
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
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-red-500 mb-3">
              <summary className="cursor-pointer font-mono">Error details (dev only)</summary>
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

// Main Login Form Component
const LoginFormInner = memo(function LoginFormInner() {
  const router = useTransitionRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    clearErrors,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { loginUser, retryCount, isPending, isRateLimited } = useAuth(router, reset);
  const { 
    isGoogleLoading, 
    googlePopupClosed, 
    handleGoogleLogin, 
    isRateLimited: isGoogleRateLimited,
    error: googleError 
  } = useGoogleAuth(router, clearErrors);

  const isFormDisabled = isSubmitting || isGoogleLoading || isPending;
  const isAnyRateLimited = isRateLimited || isGoogleRateLimited;

  // Watch form values for additional client-side validation
  const watchedValues = watch();

  // Enhanced form submission handler
  const onSubmit = useCallback(async (data: LoginFormData) => {
    if (isAnyRateLimited) {
      return;
    }

    try {
      await loginUser(data);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is already handled in the useAuth hook
    }
  }, [loginUser, isAnyRateLimited]);

  // Form validation status for accessibility
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={FORM_STYLES.container}
      style={FORM_STYLES.scrollbar}
      noValidate // We handle validation with react-hook-form and zod
      role="form"
      aria-label={ACCESSIBILITY.ARIA_LABELS.LOGIN_FORM}
      aria-describedby={getFormAriaDescribedBy()}
      data-testid="login-form"
    >
      {/* Form Header */}
      <LoginHeader />
      
      {/* Form Fields Section */}
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
      
      {/* Action Buttons */}
      <ActionButtons
        isSubmitting={isSubmitting || isPending}
        onGoogleLogin={handleGoogleLogin}
        isGoogleLoading={isGoogleLoading}
        googlePopupClosed={googlePopupClosed}
        isRateLimited={isAnyRateLimited}
        googleError={googleError}
      />
      
      {/* Sign Up Link */}
      <SignUpLink />
      
      {/* Form Status Messages */}
      {retryCount > 0 && (
        <div 
          className="text-yellow-400 text-xs sm:text-sm text-center"
          role="status"
          aria-live="polite"
        >
          Retry attempt {retryCount}
        </div>
      )}
      
      {/* Form Errors Summary for Screen Readers */}
      {Object.keys(errors).length > 0 && (
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
      )}
      
      {/* Loading Status for Screen Readers */}
      {(isSubmitting || isGoogleLoading || isPending) && (
        <div 
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {isSubmitting || isPending ? MESSAGES.LOADING.PROCESSING : MESSAGES.LOADING.AUTHENTICATING}
        </div>
      )}
    </form>
  );
});

// Exported component with Error Boundary
export const LoginForm = memo(function LoginForm() {
  const handleError = useCallback((error: Error, errorInfo: any) => {
    handleComponentError(error, errorInfo);
  }, []);

  const handleReset = useCallback(() => {
    // Clear any cached state and reload
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[]} // Reset when keys change
    >
      <LoginFormInner />
    </ErrorBoundary>
  );
});