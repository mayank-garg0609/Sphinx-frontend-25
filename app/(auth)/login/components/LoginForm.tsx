'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransitionRouter } from 'next-view-transitions';
import { memo, useEffect } from 'react';
import { loginSchema, type LoginFormData } from '@/app/schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { FormField } from './FormFields';
import { ActionButtons } from './ActionButtons';
import { SignUpLink } from './SignUpLink';
import { LoginHeader } from './LoginHeader';
import { FORM_FIELDS, FORM_STYLES } from '../utils/constants';

export const LoginForm = memo(function LoginForm() {
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

  const { loginUser, isLocked } = useAuth(router, reset);
  const { 
    isGoogleLoading, 
    googlePopupClosed, 
    handleGoogleLogin, 
    isLocked: isGoogleLocked 
  } = useGoogleAuth(router, clearErrors);

  const isFormDisabled = isSubmitting || isGoogleLoading;

  // Security: Clear form on component unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Security: Auto-clear errors after timeout
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 30000); // Clear errors after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [errors, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(loginUser)}
      className={FORM_STYLES.container}
      style={FORM_STYLES.scrollbar}
      noValidate // Use custom validation instead of browser validation
    >
      <LoginHeader />
      
      <div className="space-y-4 lg:space-y-6 pt-4 lg:pt-6 pb-4 lg:pb-6">
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
      </div>
      
      <ActionButtons
        isSubmitting={isSubmitting}
        onGoogleLogin={handleGoogleLogin}
        isGoogleLoading={isGoogleLoading}
        googlePopupClosed={googlePopupClosed}
        isLocked={isLocked}
        isGoogleLocked={isGoogleLocked}
      />
      
      <SignUpLink />
    </form>
  );
});