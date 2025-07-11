"use client";

import { useMemo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { FormField } from "./components/FormFields";
import { PasswordValidationMessage } from "./components/PasswordValidationMessage";
import { SignUpHeader } from "./components/SignUpHeader";
import { BackgroundImage } from "./components/BackgroundImage";
import { ActionButtons } from "./components/ActionButtons";
import { TermsCheckbox } from "./components/TermsCheckbox";
import { LoginLink } from "./components/LoginLink";
import { useSignUp } from "./hooks/useSignUp";
import { FORM_FIELDS, MOBILE_STYLES, FORM_CONTAINER_STYLES } from "./utils/constants";

export default function SignUpPage() {
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

  const errorMessages = useMemo(
    () => ({
      name: errors.name?.message?.toString(),
      email: errors.email?.message?.toString(),
      password: errors.password?.message?.toString(),
      confirmPassword: errors.confirmPassword?.message?.toString(),
      agreed: errors.agreed?.message?.toString(),
    }),
    [errors]
  );

  const isFormDisabled = isSubmitting || isGoogleLoading;

  return (
    <div className={MOBILE_STYLES.container}>
      <BackgroundImage />

      <div className={MOBILE_STYLES.formWrapper}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={MOBILE_STYLES.form}
          style={FORM_CONTAINER_STYLES}
        >
          <SignUpHeader />

          <div className="space-y-4 lg:space-y-6 pt-3 lg:pt-3 pb-3 lg:pb-3">
            <FormField
              field={FORM_FIELDS.name}
              register={register}
              error={errorMessages.name}
              disabled={isFormDisabled}
            />

            <FormField
              field={FORM_FIELDS.email}
              register={register}
              error={errorMessages.email}
              disabled={isFormDisabled}
            />

            <FormField
              field={FORM_FIELDS.password}
              register={register}
              error={errorMessages.password}
              disabled={isFormDisabled}
            >
              <PasswordValidationMessage
                password={password || ""}
                error={errorMessages.password}
              />
            </FormField>

            <FormField
              field={FORM_FIELDS.confirmPassword}
              register={register}
              error={errorMessages.confirmPassword}
              disabled={isFormDisabled}
            />

            <TermsCheckbox
              register={register}
              error={errorMessages.agreed}
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
      </div>
    </div>
  );
}