import { toast } from "sonner";

export const handleApiError = (res: Response, result: any): void => {
  console.error("❌ Server error:", result);

  switch (res.status) {
    case 404:
      toast.error("User not found. Please check your email or sign up.");
      break;
    case 400:
      if (result.error?.includes("Google")) {
        toast.error("You signed up using Google. Please log in with Google Auth.");
      } else if (result.error?.includes("email")) {
        toast.error("Invalid email address. Please check and try again.");
      } else if (result.error?.includes("password")) {
        toast.error("Password is incorrect. Please try again.");
      } else {
        toast.error(result.error || "Invalid credentials. Please try again.");
      }
      break;
    case 401:
      toast.error("Invalid password. Please try again.");
      break;
    case 422:
      toast.error("Validation failed. Please check your input and try again.");
      break;
    case 429:
      toast.error("Too many login attempts. Please wait a moment and try again.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    case 503:
      toast.error("Service temporarily unavailable. Please try again later.");
      break;
    default:
      toast.error(result.error || "Login failed. Please try again.");
  }
};

export const handleGoogleApiError = (res: Response, result: any): void => {
  console.error("❌ Google login failed:", result);

  switch (res.status) {
    case 400:
      toast.error("Invalid Google authentication code. Please try again.");
      break;
    case 401:
      toast.error("Google authentication expired. Please try again.");
      break;
    case 404:
      toast.error("Google account not found. Please sign up first.");
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

export const handleNetworkError = (err: any, retryCount: number, maxRetries: number): void => {
  console.error("🚨 Network error:", err);
  
  if (err instanceof SyntaxError && err.message.includes("Unexpected token")) {
    toast.error("Server returned invalid response. Please check if the API endpoint exists.");
  } else {
    toast.error("Network error. Please check your connection and try again.");
  }

  if (retryCount < maxRetries) {
    toast.info(`Retrying... (${retryCount + 1}/${maxRetries})`);
  }
};

export const handleGoogleNetworkError = (err: any, retryCount: number, maxRetries: number): void => {
  console.error("🚨 Google Auth error:", err);
  
  if (err instanceof SyntaxError && err.message.includes("Unexpected token")) {
    toast.error("Server returned invalid response. Please check if the Google auth endpoint exists.");
  } else {
    toast.error("Google authentication failed. Please try again.");
  }

  if (retryCount < maxRetries) {
    toast.info(`Retrying Google auth... (${retryCount + 1}/${maxRetries})`);
  }
};