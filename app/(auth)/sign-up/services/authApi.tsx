import { SignUpFormData } from "@/app/schemas/signupSchema";
import { SignUpResponse } from "../types/authTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const signUpUser = async (data: SignUpFormData): Promise<SignUpResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${res.status}`);
  }

  const result: SignUpResponse = await res.json();
  
  if (!res.ok) {
    throw { response: res, data: result };
  }

  return result;
};

export const signUpWithGoogle = async (code: string): Promise<SignUpResponse> => {
  if (!code) {
    throw new Error("Google Auth code is missing");
  }

  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server returned non-JSON response: ${res.status}`);
  }

  const result: SignUpResponse = await res.json();
  
  if (!res.ok) {
    throw { response: res, data: result };
  }

  return result;
};