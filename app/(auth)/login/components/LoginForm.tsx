'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransitionRouter } from 'next-view-transitions';
import { memo, useCallback } from 'react';
import { loginSchema, type LoginFormData } from '@/app/schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { FormField } from './FormFields';
import { ActionButtons } from './ActionButtons';
import { SignUpLink } from './SignUpLink';
import { LoginHeader } from './LoginHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { FORM_FIELDS, ACCESSIBILITY, MESSAGES } from '../utils/constants';
import { handleComponentError } from '../utils/errorHandlers';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = memo(function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div 
      className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-4">
        <svg 
          className="w-12 h-12 text-red-400" 
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
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-red-400">
            Something went wrong
          </h2>
          <p className="text-sm text-red-300">
            The login form encountered an error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-red-300 mt-3">
              <summary className="cursor-pointer font-mono">Error details (dev only)</summary>
              <pre className="mt-2 text-left bg-red-500/20 p-2 rounded overflow-auto text-red-200">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});

const LoginFormInner = memo(function LoginFormInner() {
  const router = useTransitionRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
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

  const onSubmit = useCallback(async (data: LoginFormData) => {
    if (isAnyRateLimited) {
      return;
    }

    try {
      await loginUser(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [loginUser, isAnyRateLimited]);

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
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-black/40 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate 
          role="form"
          aria-label={ACCESSIBILITY.ARIA_LABELS.LOGIN_FORM}
          aria-describedby={getFormAriaDescribedBy()}
          data-testid="login-form"
          className="space-y-6"
        >
          <LoginHeader />
          
          {/* Form Fields */}
          <fieldset 
            disabled={isFormDisabled}
            className="space-y-4"
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
            isSubmitting={isSubmitting || isPending}
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
              className="text-yellow-400 text-sm text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
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
                Object.values(errors).map(error => error?.message).filter(Boolean).join(', ')
              }
            </div>
          )}
          
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
      </div>
    </div>
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