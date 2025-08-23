import { getValidAuthToken } from "@/app/hooks/useUser/utils/helperFunctions";
import { API_CONFIG } from "../../login/utils/config";
import { AttributionFormData } from "@/app/schemas/attributionSchema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.baseUrl;

export interface AttributionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class AttributionError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "AttributionError";
    this.code = code;
    this.status = status;
  }
}

const handleApiError = (response: Response, result: any, context: string): never => {
  console.error(`${context} API Error:`, {
    status: response.status,
    statusText: response.statusText,
    error: result?.error || result?.message || "Unknown error",
  });

  let errorMessage: string;
  let errorCode: string = "API_ERROR";

  switch (response.status) {
    case 400:
      errorMessage = result.error || result.message || "Invalid data provided";
      errorCode = "VALIDATION_ERROR";
      break;

    case 401:
      errorMessage = "Authentication required. Please log in again.";
      errorCode = "AUTH_ERROR";
      break;

    case 403:
      if (result.error?.includes("Invalid sphinxID")) {
        errorMessage = "Invalid referral code. Please check and try again.";
        errorCode = "INVALID_REFERRAL_CODE";
      } else if (result.error?.includes("Referral already applied")) {
        errorMessage = "You have already used a referral code.";
        errorCode = "REFERRAL_ALREADY_APPLIED";
      } else {
        errorMessage = "Access denied. Please contact support.";
        errorCode = "AUTH_ERROR";
      }
      break;

    case 429:
      errorMessage = "Too many requests. Please wait a moment before trying again.";
      errorCode = "RATE_LIMIT_ERROR";
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      if (context === "referral") {
        errorMessage = "Failed to apply referral. Please try again later.";
      } else {
        errorMessage = "Failed to submit source information. Please try again later.";
      }
      errorCode = "SERVER_ERROR";
      break;

    default:
      errorMessage = result.error || result.message || `${context} failed. Please try again.`;
      errorCode = "UNKNOWN_ERROR";
  }

  throw new AttributionError(errorMessage, errorCode, response.status);
};

const submitReferral = async (refCode: string): Promise<AttributionResponse> => {
  try {
    const token = await getValidAuthToken();
    if (!token) {
      throw new AttributionError(
        "Authentication required. Please log in again.",
        "AUTH_ERROR",
        401
      );
    }

    const response = await fetch(`${API_BASE_URL}/user/referral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sphinxId: refCode }),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Referral applied successfully!",
        data: result,
      };
    } else {
      handleApiError(response, result, "referral");
      return { success: false, message: "API error occurred", error: "API_ERROR" };
    }
  } catch (error) {
    console.error("❌ Referral submission error:", error);

    if (error instanceof AttributionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      };
    }

    return {
      success: false,
      message: "Failed to apply referral. Please try again.",
      error: "UNKNOWN_ERROR",
    };
  }
};

const submitSource = async (source: string): Promise<AttributionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/source`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Thank you for the source information!",
        data: result,
      };
    } else {
      handleApiError(response, result, "source");
      return { success: false, message: "API error occurred", error: "API_ERROR" };
    }
  } catch (error) {
    console.error("❌ Source submission error:", error);

    if (error instanceof AttributionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      };
    }

    return {
      success: false,
      message: "Failed to submit source information. Please try again.",
      error: "UNKNOWN_ERROR",
    };
  }
};

export const submitAttribution = async (
  data: AttributionFormData
): Promise<AttributionResponse> => {
  try {
    console.log("🚀 Starting attribution submission:", data);

    const results: { referral?: AttributionResponse; source?: AttributionResponse } = {};

    // Submit referral if provided
    if (data.refCode?.trim()) {
      console.log("📤 Submitting referral code:", data.refCode);
      results.referral = await submitReferral(data.refCode.trim());
    }

    // Submit source (required)
    if (data.source?.trim()) {
      console.log("📤 Submitting source:", data.source);
      results.source = await submitSource(data.source.trim());
    } else {
      return {
        success: false,
        message: "Please select how you heard about us.",
        error: "VALIDATION_ERROR",
      };
    }

    const referralSuccess = !results.referral || results.referral.success;
    const sourceSuccess = results.source?.success || false;

    if (referralSuccess && sourceSuccess) {
      let message = "Thank you for the information!";
      
      if (results.referral?.success) {
        message = "Referral applied successfully! Thank you for the information!";
      }

      return {
        success: true,
        message,
        data: { referral: results.referral?.data, source: results.source?.data },
      };
    } else {
      const failedResult = !results.referral?.success ? results.referral : results.source;
      return {
        success: false,
        message: failedResult?.message || "Submission failed. Please try again.",
        error: failedResult?.error || "UNKNOWN_ERROR",
      };
    }
  } catch (error) {
    console.error("❌ Attribution submission error:", error);

    if (error instanceof AttributionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      };
    }

    return {
      success: false,
      message: "Submission failed. Please try again.",
      error: "UNKNOWN_ERROR",
    };
  }
};