// app/(auth)/login/hooks/useAuth.tsx - UPDATED VERSION
'use client';

import { useCallback, useState, useTransition } from 'react';
import type { UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { LoginResponse } from '../types/authTypes';
import { handleAuthSuccess } from '../utils/authHelpers';
import { authApi, type SecureApiError } from '../../utils/secureApiClient';
import { validateEmail, sanitizeInput } from '../../utils/validation';
import { SECURITY_CONFIG } from '../../utils/security';

interface UseAuthReturn {
  loginUser: (data: LoginFormData) => Promise<void>;
  retryCount: number;
  isPending: boolean;
}

/**
 * Enhanced authentication hook with comprehensive security measures
 */
export function useAuth(
  router: any,
  reset: UseFormReset<LoginFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const loginUser = useCallback(
    async (data: LoginFormData) => {
      console.log('🔐 Starting secure login process');

      startTransition(async () => {
        try {
          // Enhanced input validation and sanitization
          const sanitizedEmail = sanitizeInput(data.email.toLowerCase().trim());
          const sanitizedPassword = data.password; // Don't sanitize passwords, just validate length
          
          // Validate email format
          const emailValidation = validateEmail(sanitizedEmail);
          if (!emailValidation.isValid) {
            toast.error(emailValidation.error || 'Invalid email format');
            return;
          }
          
          // Validate password length (don't log password)
          if (!sanitizedPassword || sanitizedPassword.length < 1) {
            toast.error('Password is required');
            return;
          }
          
          if (sanitizedPassword.length > SECURITY_CONFIG.password.maxLength) {
            toast.error('Password is too long');
            return;
          }
          
          // Prepare sanitized credentials
          const credentials = {
            email: sanitizedEmail,
            password: sanitizedPassword,
          };
          
          console.log('📧 Attempting login for:', sanitizedEmail.replace(/(.{2}).*(@.*)/, '$1***$2'));
          
          // Use secure API client
          const result = await authApi.login(credentials);
          
          console.log('✅ Login successful');
          
          // Handle successful authentication
          handleAuthSuccess(
            result.data?.token || result.token,
            result.data?.user || result.user,
            router
          );
          
          toast.success('✅ Logged in successfully!');
          reset();
          setRetryCount(0);
          
        } catch (error: any) {
          console.error('❌ Login failed:', error);
          
          // Handle different types of errors
          if (error.response && error.data) {
            // Server error with structured response
            handleApiError(error.response, error.data, error.security);
          } else if (error.message) {
            // Client-side or network error
            if (error.message.includes('Rate limited') || error.message.includes('Too many attempts')) {
              toast.error(error.message);
            } else if (error.message.includes('timeout')) {
              toast.error('Request timed out. Please check your connection and try again.');
            } else if (error.message.includes('Network')) {
              toast.error('Network error. Please check your connection and try again.');
            } else {
              toast.error('Login failed. Please try again.');
            }
          } else {
            toast.error('An unexpected error occurred. Please try again.');
          }
          
          // Increment retry count for tracking
          if (retryCount < SECURITY_CONFIG.api.maxRetries) {
            setRetryCount(prev => prev + 1);
          }
        }
      });
    },
    [reset, router, retryCount]
  );

  return { loginUser, retryCount, isPending };
}

/**
 * Enhanced API error handler with security context
 */
function handleApiError(response: Response, result: any, security?: any): void {
  console.error('❌ Server error:', {
    status: response.status,
    error: result.error,
    security,
  });

  // Security-aware error messages
  const securityContext = security ? ` (${security.rateLimitRemaining} attempts remaining)` : '';

  switch (response.status) {
    case 401:
      if (result.error?.toLowerCase().includes('password')) {
        toast.error('Incorrect password. Please try again.');
      } else if (result.error?.toLowerCase().includes('email')) {
        toast.error('Email not found. Please check your email or sign up.');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      break;
      
    case 404:
      toast.error('Account not found. Please check your email or sign up.');
      break;
      
    case 400:
      if (result.error?.toLowerCase().includes('google')) {
        toast.error('You signed up using Google. Please use Google Sign-In.');
      } else if (result.error?.toLowerCase().includes('email')) {
        toast.error('Invalid email format. Please check and try again.');
      } else if (result.error?.toLowerCase().includes('password')) {
        toast.error('Password format is invalid. Please try again.');
      } else {
        toast.error(result.error || 'Invalid input. Please check your details.');
      }
      break;
      
    case 422:
      toast.error('Invalid input format. Please check your details and try again.');
      break;
      
    case 429:
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? `${retryAfter} seconds` : 'a moment';
      toast.error(`Too many login attempts. Please wait ${waitTime} and try again.${securityContext}`);
      break;
      
    case 500:
      toast.error('Server error. Please try again later.');
      break;
      
    case 503:
      toast.error('Service temporarily unavailable. Please try again later.');
      break;
      
    default:
      const errorMessage = result.error || 'Login failed. Please try again.';
      toast.error(`${errorMessage}${securityContext}`);
  }
}