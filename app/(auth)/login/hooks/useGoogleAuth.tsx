'use client';

import { useCallback, useState, useRef, useEffect, useTransition } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import type { LoginResponse } from '../types/authTypes';
import { API_CONFIG } from '../utils/config';
import { handleAuthSuccess } from '../utils/authHelpers';
import { handleGoogleApiError, handleGoogleNetworkError } from '../utils/errorHandlers';

interface UseGoogleAuthReturn {
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  handleGoogleLogin: () => void;
}

export function useGoogleAuth(
  router: any,
  clearErrors: () => void
): UseGoogleAuthReturn {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

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
          });

          clearTimeout(timeoutId);

          const contentType = response.headers.get('content-type');
          if (!contentType?.includes('application/json')) {
            console.error('❌ Server returned non-JSON response:', response.status);
            toast.error('Server configuration error. Please try again later.');
            return;
          }

          const result: LoginResponse = await response.json();

          if (response.ok) {
            console.log('✅ Google login successful');
            
            handleAuthSuccess(
              result.data?.token || result.token,
              result.data?.user || result.user,
              router
            );
            
            toast.success('✅ Logged in successfully!');
            setRetryCount(0);
          } else {
            handleGoogleApiError(response, result);
            if (retryCount < API_CONFIG.maxRetries) {
              setRetryCount(prev => prev + 1);
            }
          }
        } catch (error) {
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
    toast.error('Google authentication was cancelled or failed. Please try again.');
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: 'auth-code',
  });

  const handleGoogleLogin = useCallback(() => {
    console.log('🔍 Google login clicked');
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
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
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error('Failed to initiate Google login. Please try again.');
    }
  }, [googleLogin, isGoogleLoading, clearErrors]);

  return {
    isGoogleLoading: isGoogleLoading || isPending,
    googlePopupClosed,
    handleGoogleLogin,
  };
}