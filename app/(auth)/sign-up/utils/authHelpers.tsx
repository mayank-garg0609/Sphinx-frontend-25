import { toast } from "sonner";
import { slideInOut } from "@/app/animations/pageTrans";
import {
  User,
  UserCache,
  UserPreferences,
  PasswordStrength,
} from "../types/authTypes";

export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem("auth_token", token);
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
};

export const saveUserData = (user: User): void => {
  try {
    const userCache: UserCache = {
      sphinx_id: user.sphinx_id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      applied_ca: user.applied_ca,
      created_at: user.created_at,
      last_login: new Date().toISOString(),
    };

    localStorage.setItem("user_data", JSON.stringify(userCache));

    const userPreferences: UserPreferences = {
      theme: "dark",
      notifications: true,
      language: "en",
    };

    localStorage.setItem("user_preferences", JSON.stringify(userPreferences));
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
};

export const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  if (!password) return "";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length < 8) {
    return "Weak";
  } else if (hasUpper && hasLower && hasNumber && hasSpecial) {
    return "Strong";
  } else {
    return "Medium";
  }
};

export const handleAuthSuccess = (
  token: string,
  user: User,
  router: any
): void => {
  try {
    saveAuthToken(token);
    saveUserData(user);
    toast.success("✅ Account created successfully!");

    setTimeout(() => {
      router.push(`/update?redirectedFrom=/sign-up`, {
        onTransitionReady: slideInOut,
      });
    }, 500);
  } catch (error) {
    console.error("Auth success handling failed:", error);
    toast.error(
      "Account created but navigation failed. Please refresh the page."
    );
  }
};
