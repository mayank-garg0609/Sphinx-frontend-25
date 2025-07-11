import { toast } from "sonner";

export const handleApiError = (res: Response, result: any): void => {
  console.error("❌ Server error:", result);

  switch (res.status) {
    case 409:
      toast.error("Account already exists. Please try logging in instead.");
      break;
    case 400:
      if (result.error?.includes("email")) {
        toast.error("Invalid email address. Please check and try again.");
      } else if (result.error?.includes("password")) {
        toast.error("Password doesn't meet requirements. Please try again.");
      } else {
        toast.error(result.error || "Invalid input. Please check your details.");
      }
      break;
    case 422:
      toast.error("Validation failed. Please check your input and try again.");
      break;
    case 429:
      toast.error("Too many requests. Please wait a moment and try again.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    case 503:
      toast.error("Service temporarily unavailable. Please try again later.");
      break;
    default:
      toast.error(result.error || "Sign up failed. Please try again.");
  }
};

export const handleGoogleApiError = (res: Response, result: any): void => {
  console.error("❌ Google signup failed:", result);

  switch (res.status) {
    case 400:
      toast.error("Invalid Google authentication code. Please try again.");
      break;
    case 401:
      toast.error("Google authentication expired. Please try again.");
      break;
    case 409:
      toast.error("Account already exists. Please try logging in instead.");
      break;
    case 429:
      toast.error("Too many Google auth requests. Please wait and try again.");
      break;
    case 500:
      toast.error("Failed to authenticate with Google. Please try again.");
      break;
    default:
      toast.error(result.error || "Google authentication failed. Please try again.");
  }
};

export const handleNetworkError = (
  error: unknown,
  retryCount: number,
  maxRetries: number,
  setRetryCount: (fn: (prev: number) => number) => void,
  isGoogleAuth: boolean = false
): void => {
  console.error("🚨 Network error:", error);
  
  if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
    const message = isGoogleAuth 
      ? "Server returned invalid response. Please check if the Google auth endpoint exists."
      : "Server returned invalid response. Please check if the API endpoint exists.";
    toast.error(message);
  } else {
    const message = isGoogleAuth 
      ? "Google authentication failed. Please try again."
      : "Network error. Please check your connection and try again.";
    toast.error(message);
  }

  if (retryCount < maxRetries) {
    setRetryCount((prev) => prev + 1);
    const authType = isGoogleAuth ? "Google auth" : "";
    toast.info(`Retrying ${authType}... (${retryCount + 1}/${maxRetries})`);
  }
};