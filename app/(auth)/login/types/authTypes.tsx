import { z } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
  };
  // Flat structure fallback for backward compatibility
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: User;
}

export interface RefreshTokenResponse extends ApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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

// Zod schemas for runtime validation
export const ApiResponseSchema = z.object({
  success: z.boolean(),
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

// Updated schema to handle both nested and flat response structures
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  // Nested data structure (preferred)
  data: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresIn: z.number().positive(),
    user: UserSchema,
  }).optional(),
  // Flat structure fallback
  accessToken: z.string().min(1).optional(),
  refreshToken: z.string().min(1).optional(),
  expiresIn: z.number().positive().optional(),
  user: UserSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
}).refine((data) => {
  // Ensure either nested data or flat structure is present
  const hasNestedData = data.data && 
    data.data.accessToken && 
    data.data.refreshToken && 
    data.data.expiresIn && 
    data.data.user;
  
  const hasFlatData = data.accessToken && 
    data.refreshToken && 
    data.expiresIn && 
    data.user;

  return hasNestedData || hasFlatData;
}, {
  message: "Either nested data object or flat structure must be provided",
});

export const RefreshTokenResponseSchema = z.object({
  success: z.boolean(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.number().positive(),
});

export const CSRFResponseSchema = z.object({
  success: z.boolean(),
  csrfToken: z.string().min(1),
});

// Error types
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