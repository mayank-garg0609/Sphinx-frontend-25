'use client';

import { useCallback, useState, useRef, useEffect, useTransition } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import type { LoginResponse } from '../types/authTypes';
import { API_CONFIG, rateLimiter } from '../utils/config';
import { handleAuthSuccess } from '../utils/authHelpers';
import { handleGoogleApiError, handleGoogleNetworkError, handleRateLimitError } from '../utils/errorHandlers';

interface UseGoogleAuthReturn {
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  handleGoogleLogin: () => void;
  isRateLimited: boolean;
  error: string | null;
}

export function useGoogleAuth(
  router: any,
  clearErrors: () => void
): UseGoogleAuthReturn {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGoogleAuth = useCallback(
    async (authResult: { code: string }) => {
      console.log('🔍 Google Auth initiated');
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);
      setError(null);

      // Check rate limiting
      if (!rateLimiter.canMakeRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilNextRequest();
        setIsRateLimited(true);
        handleRateLimitError(timeUntilReset);
        
        // Reset rate limit flag after the timeout
        setTimeout(() => setIsRateLimited(false), timeUntilReset);
        setIsGoogleLoading(false);
        return;
      }

      startTransition(async () => {
        try {
          const { code } = authResult;

          if (!code) {
            throw new Error('Google Auth code is missing');
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

          const response = await fetch(`${API_CONFIG.baseUrl}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
            signal: controller.signal,
            credentials: 'include',
          });

          clearTimeout(timeoutId);

          const contentType = response.headers.get('content-type');
          if (!contentType?.includes('application/json')) {
            console.error('❌ Server returned non-JSON response:', response.status);
            setError('Server configuration error. Please try again later.');
            toast.error('Server configuration error. Please try again later.');
            return;
          }

          const result: LoginResponse = await response.json();

          if (response.ok) {
            console.log('✅ Google login successful');
            
            // Extract token data with proper type checking
            let accessToken: string;
            let refreshToken: string;
            let expiresIn: number;
            let user: any;

            if (result.data) {
              // Nested structure
              accessToken = result.data.accessToken;
              refreshToken = result.data.refreshToken;
              expiresIn = result.data.expiresIn;
              user = result.data.user;
            } else {
              // Flat structure
              accessToken = result.accessToken!;
              refreshToken = result.refreshToken!;
              expiresIn = result.expiresIn!;
              user = result.user!;
            }
            
            await handleAuthSuccess(
              accessToken,
              refreshToken,
              expiresIn,
              user,
              router
            );
            
            toast.success('✅ Logged in successfully with Google!');
            setRetryCount(0);
            setError(null);
          } else {
            handleGoogleApiError(response, result);
            setError(result.error || 'Google authentication failed');
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount(prev => prev + 1);
            }
          }
        } catch (error) {
          console.error('🚨 Google Auth Error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
          setError(errorMessage);
          handleGoogleNetworkError(error, retryCount, API_CONFIG.maxRetries);
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount(prev => prev + 1);
          }
        } finally {
          setIsGoogleLoading(false);
        }
      });
    },
    [router, retryCount]
  );

  const handleGoogleAuthError = useCallback((error: any) => {
    console.error('🚨 Google Auth Error:', error);
    const errorMessage = 'Google authentication was cancelled or failed. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: 'auth-code',
  });

  const handleGoogleLogin = useCallback(() => {
    if (isRateLimited) {
      toast.error('Please wait before trying Google login again.');
      return;
    }

    console.log('🔍 Google login clicked');
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
    setError(null);
    clearErrors();

    try {
      timeoutRef.current = setTimeout(() => {
        if (isGoogleLoading) {
          setGooglePopupClosed(true);
          setIsGoogleLoading(false);
        }
      }, API_CONFIG.googlePopupTimeout);

      googleLogin();
    } catch (error) {
      console.error('🚨 Error initiating Google login:', error);
      const errorMessage = 'Failed to initiate Google login. Please try again.';
      setError(errorMessage);
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error(errorMessage);
    }
  }, [googleLogin, isGoogleLoading, clearErrors, isRateLimited]);

  return {
    isGoogleLoading: isGoogleLoading || isPending,
    googlePopupClosed,
    handleGoogleLogin,
    isRateLimited,
    error,
  };
}