import { API_CONFIG } from "../utils/config";

export interface OTPSendResponse {
  message: string;
}

export interface OTPVerifyResponse {
  message: string;
  verificationToken?: string; // For signup flow
}

export interface OTPError {
  error: string;
}

export const sendOTP = async (email: string): Promise<OTPSendResponse> => {
  if (!email) {
    throw new Error("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/user/sendOTP`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${response.status}`);
  }

  const result = await response.json();
  console.log("Send OTP result:", result);

  if (!response.ok) {
    const error: OTPError = result;

    switch (response.status) {
      case 400:
        throw new Error("Invalid email format");
      case 429:
        throw new Error(
          "Too many OTP requests. Please wait before trying again."
        );
      case 500:
        throw new Error("Failed to send OTP");
      default:
        throw new Error(error.error || "Failed to send OTP");
    }
  }

  return result as OTPSendResponse;
};

export const verifyOTP = async (
  otp: string,
  email?: string,
  token?: string
): Promise<OTPVerifyResponse> => {
  if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be a 6-digit number");
  }

  if (!email && !token) {
    throw new Error("Either email or authentication token is required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const body: any = { otp };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (email) {
    body.email = email;
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/user/verifyOTP`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${response.status}`);
  }

  const result = await response.json();
  console.log("Verify OTP result:", result);

  if (!response.ok) {
    const error: OTPError = result;

    switch (response.status) {
      case 404:
        if (email) {
          throw new Error(
            "Email not found in OTP records. Please request a new OTP."
          );
        } else {
          throw new Error("User not found");
        }
      case 400:
        throw new Error("Invalid or expired OTP");
      case 401:
        throw new Error("User already verified");
      case 500:
        throw new Error("Failed to verify OTP");
      default:
        throw new Error(error.error || "Failed to verify OTP");
    }
  }

  return result as OTPVerifyResponse;
};

// NEW: Verify OTP specifically for signup flow
export const verifyOTPForSignup = async (
  email: string,
  otp: string
): Promise<OTPVerifyResponse> => {
  return verifyOTP(otp, email);
};

// NEW: Verify OTP for existing user flow
export const verifyOTPForUser = async (
  token: string,
  otp: string
): Promise<OTPVerifyResponse> => {
  return verifyOTP(otp, undefined, token);
};
