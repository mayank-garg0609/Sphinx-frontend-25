import { API_CONFIG } from "../utils/config";

export interface OTPSendResponse {
  message: string;
}

export interface OTPVerifyResponse {
  message: string;
}

export interface OTPError {
  error: string;
}

export const sendOTP = async (token: string): Promise<OTPSendResponse> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/user/sendOTP`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${response.status}`);
  }

  const result = await response.json();
  console.log(result)

  if (!response.ok) {
    const error: OTPError = result;

    switch (response.status) {
      case 404:
        throw new Error("User not found");
      case 401:
        throw new Error("User already verified");
      case 402:
        throw new Error("User details not complete");
      case 500:
        throw new Error("Failed to resend OTP");
      default:
        throw new Error(error.error || "Failed to send OTP");
    }
  }

  return result as OTPSendResponse;
};

export const verifyOTP = async (
  token: string,
  otp: string
): Promise<OTPVerifyResponse> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be a 6-digit number");
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/user/verifyOTP`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${response.status}`);
  }

  const result = await response.json();

  if (!response.ok) {
    const error: OTPError = result;

    switch (response.status) {
      case 404:
        throw new Error("User not found");
      case 400:
        throw new Error("Invalid or expired OTP");
      case 500:
        throw new Error("Failed to verify OTP");
      default:
        throw new Error(error.error || "Failed to verify OTP");
    }
  }

  return result as OTPVerifyResponse;
};
