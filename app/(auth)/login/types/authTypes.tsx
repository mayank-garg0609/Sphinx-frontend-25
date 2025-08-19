import { z } from 'zod';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number | string;
    user: User;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number | string;
  user?: User;
}

export interface RefreshTokenResponse extends ApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | string;
}

export interface CSRFResponse extends ApiResponse {
  csrfToken: string;
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

// Zod schemas for runtime validation - made more flexible
export const ApiResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const UserSchema = z.object({
  sphinx_id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  is_verified: z.boolean(),
  applied_ca: z.boolean(),
  created_at: z.string().optional(),
  _id: z.string().optional(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresIn: z.union([z.number().positive(), z.string()]).transform(val => 
      typeof val === 'string' ? parseInt(val, 10) : val
    ),
    user: UserSchema,
  }).optional(),
  accessToken: z.string().min(1).optional(),
  refreshToken: z.string().min(1).optional(),
  expiresIn: z.union([z.number().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ).optional(),
  user: UserSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
}).transform(data => {
  // Normalize the response format
  if (data.data) {
    return {
      ...data,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      expiresIn: data.data.expiresIn,
      user: data.data.user,
    };
  }
  return data;
}).refine((data) => {
  return data.accessToken && data.refreshToken && data.expiresIn && data.user;
}, {
  message: "Required authentication data is missing",
});

export const RefreshTokenResponseSchema = z.object({
  success: z.boolean().optional(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.union([z.number().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ),
});

export const CSRFResponseSchema = z.object({
  success: z.boolean().optional(),
  csrfToken: z.string().min(1),
});

export interface AuthError extends Error {
  code: string;
  status?: number;
}

export class AuthenticationError extends Error implements AuthError {
  code = 'AUTHENTICATION_ERROR';
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = status;
  }
}

export class TokenExpiredError extends Error implements AuthError {
  code = 'TOKEN_EXPIRED';
  status = 401;

  constructor(message = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class NetworkError extends Error implements AuthError {
  code = 'NETWORK_ERROR';
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

export class ValidationError extends Error implements AuthError {
  code = 'VALIDATION_ERROR';
  status = 422;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}