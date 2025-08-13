import { memo } from "react";
import { calculatePasswordStrength } from "../utils/authHelpers";

interface PasswordValidationMessageProps {
  password: string;
  error?: string;
}

export const PasswordValidationMessage = memo(function PasswordValidationMessage({
  password,
  error,
}: PasswordValidationMessageProps) {
  if (error) {
    return null; // Error is handled by FormField component
  }

  if (!password) return null;

  const strength = calculatePasswordStrength(password);
  const isShort = password.length < 8;

  const colorClass = isShort
    ? "text-red-400"
    : strength === "Strong"
    ? "text-green-400"
    : strength === "Medium"
    ? "text-yellow-400"
    : "text-red-400";

  const message = isShort
    ? "Password is too short (minimum 8 characters)"
    : `Password Strength: ${strength}`;

  return <span className={`${colorClass}`}>{message}</span>;
});