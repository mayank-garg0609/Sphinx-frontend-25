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
    formData.append("q6", data.your_expectations);

    if (data.resume && data.resume[0]) {
      formData.append("file", data.resume[0]);
    }

    const response = await fetch(`${API_BASE_URL}/ca/form`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: formData, 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
