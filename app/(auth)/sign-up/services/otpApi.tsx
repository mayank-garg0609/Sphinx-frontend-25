import { API_CONFIG } from "../utils/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.baseUrl;

export interface SendOTPResponse {
  message: string;
}

export interface VerifyOTPResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    sphinx_id: string;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
    applied_ca: boolean;
    created_at?: string;
    _id?: string;
  };
  expiresIn: number;
}

export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  try {
    console.log("📧 Sending OTP to:", email);

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Server returned non-JSON response: ${response.status}`);
    }

    const result = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 404:
          if (result.error === "User already exists") {
            throw new Error(
              "An account with this email already exists. Please log in instead."
            );
          }
          break;
        case 500:
          throw new Error(
            result.error || "Failed to send OTP. Please try again later."
          );
        default:
          throw new Error(
            result.error || `HTTP ${response.status}: Failed to send OTP`
          );
      }
    }

    console.log("✅ OTP sent successfully");
    return result;
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send OTP. Please try again.");
  }
};

export const verifyOTPForSignup = async (
  name: string,
  email: string,
  otp: string,
  password: string
): Promise<VerifyOTPResponse> => {
  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  if (!email || !email.trim()) {
    throw new Error("Email is required");
  }

  if (!otp || !otp.trim() || !/^\d{6}$/.test(otp)) {
    throw new Error("Valid 6-digit OTP is required");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  try {
    console.log("🔍 Verifying OTP and creating user for:", email);

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        password: password,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Server returned non-JSON response: ${response.status}`);
    }

    const result = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 401:
          if (result.error === "User already exist") {
            throw new Error(
              "An account with this email already exists. Please log in instead."
            );
          }
          break;
        case 400:
          if (result.error === "Invalid or expired OTP") {
            throw new Error(
              "Invalid or expired OTP. Please try again or request a new OTP."
            );
          }
          break;
        case 500:
          throw new Error(
            result.error || "Failed to verify user. Please try again later."
          );
        default:
          throw new Error(
            result.error || `HTTP ${response.status}: Failed to verify OTP`
          );
      }
    }

    if (!result.accessToken || !result.refreshToken || !result.user) {
      throw new Error(
        "Invalid response from server. Missing required authentication data."
      );
    }

    console.log("✅ OTP verified and user created successfully");
    return result;
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to verify OTP. Please try again.");
  }
};

export const resendOTP = async (email: string): Promise<SendOTPResponse> => {
  return sendOTP(email);
};
