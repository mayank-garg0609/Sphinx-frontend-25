import { CARegisterFormData } from "@/app/schemas/CARegisterSchema";
import { getAuthToken } from "@/app/hooks/useUser/utils/helperFunctions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const token = getAuthToken();

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const registerCAUser = async (
  data: CARegisterFormData
): Promise<RegistrationResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add text fields
    formData.append("how_did_you_find_us", data.how_did_you_find_us);
    formData.append("why_should_we_choose_you", data.why_should_we_choose_you);
    formData.append("past_experience", data.past_experience);
    formData.append("your_strengths", data.your_strengths);
    formData.append("your_expectations", data.your_expectations);
    formData.append("resume", data.resume[0]);

    const response = await fetch(`${API_BASE_URL}/ca/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Registration failed with status ${response.status}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: "CA Registration successful!",
      data: result,
    };
  } catch (error) {
    console.error("❌ CA Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
    };
  }
};