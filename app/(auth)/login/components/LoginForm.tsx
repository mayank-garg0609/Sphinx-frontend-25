"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransitionRouter } from "next-view-transitions";
import { loginSchema, LoginFormData } from "../../../schemas/loginSchema";
import { useAuth } from "../hooks/useAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { FormField } from "./FormFields";
import { ActionButtons } from "./ActionButtons";
import { SignUpLink } from "./SignUpLink";
import {
  FORM_FIELDS,
  MOBILE_STYLES,
  FORM_CONTAINER_STYLES,
} from "../utils/constants";
import { LoginHeader } from "./LoginHeader";

export function LoginForm() {
  const router = useTransitionRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { loginUser } = useAuth(router, reset);
  const { isGoogleLoading, googlePopupClosed, handleGoogleLogin } =
    useGoogleAuth(router, clearErrors);

  const emailError = errors.email?.message?.toString();
  const passwordError = errors.password?.message?.toString();
  const isFormDisabled = isSubmitting || isGoogleLoading;

  return (
    <form
      onSubmit={handleSubmit(loginUser)}
      className={MOBILE_STYLES.form}
      style={FORM_CONTAINER_STYLES}
    >
      <LoginHeader />
      <div className="space-y-4 lg:space-y-6 pt-4 lg:pt-6 pb-4 lg:pb-6">
        <FormField
          field={FORM_FIELDS.email}
          register={register}
          error={emailError}
          disabled={isFormDisabled}
        />

        <FormField
          field={FORM_FIELDS.password}
          register={register}
          error={passwordError}
          disabled={isFormDisabled}
        ></FormField>
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
}
