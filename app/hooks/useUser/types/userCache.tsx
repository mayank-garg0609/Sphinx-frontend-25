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

export interface AuthStatus {
  isAuthenticated: boolean;
  hasValidToken: boolean;
  tokenExpiry: number | null;
}