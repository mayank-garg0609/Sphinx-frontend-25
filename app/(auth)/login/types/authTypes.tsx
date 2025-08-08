export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse extends ApiResponse {
  token: string;
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
}

export interface UserData {
  sphinx_id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  applied_ca: boolean;
  created_at?: string;
  last_login?: string;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  language: string;
}

export interface User {
  readonly sphinx_id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly is_verified: boolean;
  readonly applied_ca: boolean;
  readonly created_at?: string;
  readonly _id?: string;
}