export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  sphinx_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  applied_ca: boolean;
  password?: string;
  created_at?: string;
  _id?: string;
}

export interface SignUpResponse extends ApiResponse {
  token: string;
  user: User;
}

export interface UserCache {
  sphinx_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  applied_ca: boolean;
  created_at?: string;
  last_login: string;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  language: string;
}

export type PasswordStrength = "Weak" | "Medium" | "Strong" | "";