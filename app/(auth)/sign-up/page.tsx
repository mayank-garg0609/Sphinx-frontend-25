"use client";

import { memo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { FormField } from "./components/FormFields";
import { PasswordValidationMessage } from "./components/PasswordValidationMessage";
import { SignUpHeader } from "./components/SignUpHeader";
import { BackgroundImage } from "./components/BackgroundImage";
import { ActionButtons } from "./components/ActionButtons";
import { TermsCheckbox } from "./components/TermsCheckbox";
import { LoginLink } from "./components/LoginLink";
import { useSignUp } from "./hooks/useSignUp";
import { FORM_FIELDS } from "./utils/constants";

const SignUpForm = memo(function SignUpForm() {
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
  } = useSignUp(router);

  const password = watch("password");
  const isFormDisabled = isSubmitting || isGoogleLoading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-black/40 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl border border-white/30 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 font-sans lg:mr-8 xl:mr-16 2xl:mr-24 mx-auto h-auto lg:h-auto xl:h-auto 2xl:h-auto max-h-[90vh] sm:max-h-[85vh] md:max-h-[85vh] lg:max-h-[85vh] xl:max-h-[90vh] 2xl:max-h-[90vh] overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #2d2d2d',
      }}
    >
      <SignUpHeader />
      
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 xl:pb-7 2xl:pb-8">
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
      </div>
      
      <ActionButtons
        isSubmitting={isSubmitting}
        onGoogleSignup={handleGoogleSignup}
        isGoogleLoading={isGoogleLoading}
        googlePopupClosed={googlePopupClosed}
      />
      
      <LoginLink />
    </form>
  );
});

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat lg:px-4 px-6">
      <BackgroundImage />
      <div className="relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-8 lg:py-0">
        <SignUpForm />
      </div>
    </div>
  );
}