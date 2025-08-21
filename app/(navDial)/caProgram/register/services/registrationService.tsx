import { CARegisterFormData } from "@/app/schemas/CARegisterSchema";
import { getValidAuthToken } from "@/app/hooks/useUser/utils/helperFunctions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const registerCAUser = async (
  data: CARegisterFormData
): Promise<RegistrationResponse> => {
  try {
    const token = await getValidAuthToken();
    console.log("🔑 registerCAUser → token:", token);

    if (!token) {
      throw new Error("No valid access token found. Please login again.");
    }

    const formData = new FormData();
    formData.append("q1", data.how_did_you_find_us);
    formData.append("q2", data.why_should_we_choose_you);
    formData.append("q3", data.past_experience);
    formData.append("q4", data.your_strengths);
    formData.append("q5", data.your_expectations);
    formData.append("q5", data.your_expectations);

    // Fixed: removed duplicate q6 mapping

    if (data.resume && data.resume[0]) {
      console.log("📎 Adding file:", data.resume[0].name, data.resume[0].type);
      formData.append("file", data.resume[0]);
    }

    console.log("🚀 Making request to:", `${API_BASE_URL}/ca/form`);

    const response = await fetch(`${API_BASE_URL}/ca/form`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser handle it for FormData
      },
      body: formData,
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response headers:", response.headers.get("content-type"));

    // Read response body ONCE and store it
    let responseData: any;
    let responseText: string;

    try {
      // Try to read as JSON first
      responseData = await response.json();
      responseText = JSON.stringify(responseData);
      console.log("📥 Response data (JSON):", responseData);
    } catch (jsonError) {
      // If JSON fails, the response might be text or empty
      console.log("⚠️ JSON parse failed, response might be text or empty");
      try {
        // We can't read the response again since it's already consumed
        // So we'll work with what we have
        responseText = "Unable to read response body";
        responseData = {};
      } catch (textError) {
        console.log("❌ Could not read response at all:", textError);
        responseText = "Response read error";
        responseData = {};
      }
    }

    if (!response.ok) {
      let errorMessage = `Registration failed with status ${response.status}`;

      // Use the parsed response data for error message
      if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData && responseData.error) {
        errorMessage = responseData.error;
      }

      // Handle specific status codes with better messages
      switch (response.status) {
        case 400:
          errorMessage =
            responseData.message ||
            "Invalid form data. Please check all fields and try again.";
          break;
        case 401:
          errorMessage = "Your session has expired. Please login again.";
          break;
        case 402:
          errorMessage =
            responseData.message ||
            "You may have already applied for the Campus Ambassador program. If you believe this is an error, please contact support.";
          break;
        case 403:
          errorMessage =
            "Access denied. You may not have permission to apply for this program.";
          break;
        case 409:
          errorMessage =
            "You have already submitted an application for the Campus Ambassador program.";
          break;
        case 413:
          errorMessage =
            "The uploaded file is too large. Please upload a file smaller than 5MB.";
          break;
        case 415:
          errorMessage =
            "Unsupported file type. Please upload a PDF file only.";
          break;
        case 429:
          errorMessage =
            "Too many requests. Please wait a few minutes and try again.";
          break;
        case 500:
        case 502:
        case 503:
          errorMessage =
            "Server error. Please try again in a few minutes or contact support.";
          break;
        default:
          errorMessage =
            responseData.message ||
            `Unexpected error (${response.status}). Please try again or contact support.`;
      }

      console.log("❌ Registration failed:", errorMessage);
      throw new Error(errorMessage);
    }

    // Success case
    console.log("✅ Registration successful!");
    return {
      success: true,
      message:
        "Your Campus Ambassador application has been submitted successfully! You'll receive a confirmation email shortly.",
      data: responseData,
    };
  } catch (error) {
    console.error("❌ CA Registration error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Registration failed due to an unexpected error. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
