// app/(auth)/login/hooks/useAuth.tsx
'use client';

import { useCallback, useState, useTransition } from 'react';
import type { UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import { LoginResponseSchema, type LoginResponse } from '../types/authTypes';
import { API_CONFIG, API_ENDPOINTS, getApiUrl, rateLimiter } from '../utils/config';
import { handleAuthSuccess, getAuthHeaders } from '../utils/authHelpers';
import { handleApiError, handleNetworkError, handleRateLimitError } from '../utils/errorHandlers';

interface UseAuthReturn {
  loginUser: (data: LoginFormData) => Promise<void>;
  retryCount: number;
  isPending: boolean;
  isRateLimited: boolean;
}

export function useAuth(
  router: any,
  reset: UseFormReset<LoginFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Debounced login function to prevent rapid submissions
  const debouncedLogin = useCallback(
    debounce(async (data: LoginFormData) => {
      // Check rate limiting
      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);
        
        // Reset rate limit flag after the timeout
        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        return;
      }

      console.log('🔐 Initiating login process');

      startTransition(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

          // Get auth headers (including CSRF token)
          const headers = await getAuthHeaders();

          const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
            signal: controller.signal,
            credentials: 'include', // Important for CSRF and refresh token cookies
          });

          clearTimeout(timeoutId);

          // Validate content type
          const contentType = response.headers.get('content-type');
          if (!contentType?.includes('application/json')) {
            console.error('❌ Server returned non-JSON response:', response.status);
            toast.error('Server configuration error. Please contact support.');
            return;
          }

          const result = await response.json();

          if (response.ok) {
            console.log('✅ Login successful');
            
            // Validate response structure
            const validatedResult = LoginResponseSchema.parse(result);
            
            // Extract token data (handle both nested and flat response formats)
            const tokenData = validatedResult.data || validatedResult;
            
            await handleAuthSuccess(
              tokenData.accessToken,
              tokenData.refreshToken,
              tokenData.expiresIn,
              tokenData.user,
              router
            );
            
            toast.success('✅ Logged in successfully!');
            reset();
            setRetryCount(0);
          } else {
            handleApiError(response, result);
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount(prev => prev + 1);
            }
          }
        } catch (error) {
          console.error('🚨 Login error:', error);
          
          handleNetworkError(error, retryCount, API_CONFIG.maxRetries, 'login');
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount(prev => prev + 1);
            
            // Exponential backoff for retries
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            setTimeout(() => {
              console.log(`🔄 Retrying login (attempt ${retryCount + 1})`);
            }, retryDelay);
          }
        }
      });
    }, 500), // 500ms debounce
    [reset, router, retryCount]
  );

  const loginUser = useCallback(
    async (data: LoginFormData) => {
      if (isRateLimited) {
        toast.error('Please wait before trying again.');
        return;
      }

      // Basic client-side validation
      if (!data.email?.trim()) {
        toast.error('Email is required.');
        return;
      }

      if (!data.password?.trim()) {
        toast.error('Password is required.');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error('Please enter a valid email address.');
        return;
      }

      await debouncedLogin(data);
    },
    [debouncedLogin, isRateLimited]
  );

  return { 
    loginUser, 
    retryCount, 
    isPending,
    isRateLimited 
  };
}