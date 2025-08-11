'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransitionRouter } from 'next-view-transitions';
import { memo } from 'react';
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

  const { loginUser } = useAuth(router, reset);
  const { isGoogleLoading, googlePopupClosed, handleGoogleLogin } = useGoogleAuth(router, clearErrors);

  const isFormDisabled = isSubmitting || isGoogleLoading;

  return (
    <form
      onSubmit={handleSubmit(loginUser)}
      className="bg-black/40 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl border border-white/30 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 font-sans lg:mr-8 xl:mr-16 2xl:mr-24 mx-auto h-auto lg:h-auto xl:h-auto 2xl:h-auto max-h-[90vh] sm:max-h-[85vh] md:max-h-[85vh] lg:max-h-[85vh] xl:max-h-[90vh] 2xl:max-h-[90vh] overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #2d2d2d',
      }}
    >
      <LoginHeader />
      
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7 2xl:pb-8">
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
      />
      
      <SignUpLink />
    </form>
  );
});