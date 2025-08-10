// app/(auth)/login/hooks/useGoogleAuth.tsx - UPDATED VERSION
'use client';

import { useCallback, useState, useRef, useEffect, useTransition } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import type { LoginResponse } from '../types/authTypes';
import { handleAuthSuccess } from '../utils/authHelpers';
import { authApi, type SecureApiError } from '../../utils/secureApiClient';
import { SECURITY_CONFIG } from '../../utils/security';

interface UseGoogleAuthReturn {
  isGoogleLoading: boolean;
  googlePopupClosed: boolean;
  handleGoogleLogin: () => void;
}

/**
 * Enhanced Google authentication hook with comprehensive security measures
 */
export function useGoogleAuth(
  router: any,
  clearErrors: () => void
): UseGoogleAuthReturn {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupClosed, setGooglePopupClosed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleGoogleAuth = useCallback(
    async (authResult: { code: string }) => {
      const requestId = generateRequestId();
      requestIdRef.current = requestId;
      
      console.log(`🔍 [${requestId}] Google Auth initiated`);
      setIsGoogleLoading(true);
      setGooglePopupClosed(false);

      startTransition(async () => {
        try {
          // Validate auth code
          if (!authResult?.code || typeof authResult.code !== 'string') {
            throw new Error('Invalid Google authentication code received');
          }
          
          // Validate code format (basic validation)
          if (authResult.code.length < 10 || authResult.code.length > 2048) {
            throw new Error('Google authentication code format is invalid');
          }
          
          // Check for suspicious patterns in auth code
          if (/<script|javascript:|on\w+=/i.test(authResult.code)) {
            throw new Error('Suspicious authentication code detected');
          }
          
          console.log(`🔍 [${requestId}] Processing Google auth code`);
          
          // Use secure API client
          const result = await authApi.googleAuth(authResult.code);
          
          console.log(`✅ [${requestId}] Google login successful`);
          
          // Handle successful authentication
          handleAuthSuccess(
            result.data?.token || result.token,
            result.data?.user || result.user,
            router
          );
          
          toast.success('✅ Logged in successfully with Google!');
          setRetryCount(0);
          
        } catch (error: any) {
          console.error(`❌ [${requestId}] Google auth failed:`, error);
          
          // Handle different types of errors
          if (error.response && error.data) {
            // Server error with structured response
            handleGoogleApiError(error.response, error.data, error.security, requestId);
          } else if (error.message) {
            // Client-side or network error
            if (error.message.includes('Rate limited') || error.message.includes('Too many attempts')) {
              toast.error(`Google Auth: ${error.message}`);
            } else if (error.message.includes('timeout')) {
              toast.error('Google authentication timed out. Please try again.');
            } else if (error.message.includes('Invalid') || error.message.includes('Suspicious')) {
              toast.error('Google authentication failed. Please try again.');
            } else {
              toast.error('Google authentication error. Please try again.');
            }
          } else {
            toast.error('Google authentication failed. Please try again.');
          }
          
          // Increment retry count for tracking
          if (retryCount < SECURITY_CONFIG.api.maxRetries) {
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
    const requestId = requestIdRef.current || generateRequestId();
    console.error(`🚨 [${requestId}] Google Auth Error:`, error);
    
    // Categorize Google OAuth errors
    if (error?.error === 'popup_closed_by_user') {
      toast.error('Google sign-in was cancelled. Please try again.');
    } else if (error?.error === 'access_denied') {
      toast.error('Google access denied. Please grant necessary permissions.');
    } else if (error?.error === 'popup_blocked') {
      toast.error('Popup blocked. Please allow popups for this site and try again.');
    } else {
      toast.error('Google authentication failed. Please try again.');
    }
    
    setIsGoogleLoading(false);
    setGooglePopupClosed(true);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    onError: handleGoogleAuthError,
    flow: 'auth-code',
    // Additional security options
    ux_mode: 'popup',
    select_account: true, // Force account selection for security
  });

  const handleGoogleLogin = useCallback(() => {
    const requestId = generateRequestId();
    requestIdRef.current = requestId;
    
    console.log(`🔍 [${requestId}] Google login initiated`);
    setIsGoogleLoading(true);
    setGooglePopupClosed(false);
    clearErrors();

    try {
      // Set timeout for popup detection
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (isGoogleLoading) {
          console.log(`⏰ [${requestId}] Google popup timeout detected`);
          setGooglePopupClosed(true);
          setIsGoogleLoading(false);
          toast.info('Google sign-in window closed. Please try again if needed.');
        }
      }, SECURITY_CONFIG.api.timeout);

      // Initiate Google login
      googleLogin();
      
    } catch (error) {
      console.error(`🚨 [${requestId}] Error initiating Google login:`, error);
      setIsGoogleLoading(false);
      setGooglePopupClosed(true);
      toast.error('Failed to open Google sign-in. Please try again.');
    }
  }, [googleLogin, isGoogleLoading, clearErrors]);

  return {
    isGoogleLoading: isGoogleLoading || isPending,
    googlePopupClosed,
    handleGoogleLogin,
  };
}

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
  return `gauth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Enhanced Google API error handler with security context
 */
function handleGoogleApiError(
  response: Response, 
  result: any, 
  security?: any,
  requestId?: string
): void {
  const logPrefix = requestId ? `[${requestId}]` : '';
  console.error(`❌ ${logPrefix} Google API error:`, {
    status: response.status,
    error: result.error,
    security,
  });

  const securityContext = security ? ` (${security.rateLimitRemaining} attempts remaining)` : '';

  switch (response.status) {
    case 400:
      if (result.error?.toLowerCase().includes('code')) {
        toast.error('Invalid Google authentication. Please try again.');
      } else {
        toast.error(result.error || 'Google authentication failed. Please try again.');
      }
      break;
      
    case 401:
      toast.error('Google authentication expired. Please try again.');
      break;
      
    case 404:
      toast.error('Google account not found. Please sign up first or try a different account.');
      break;
      
    case 409:
      toast.error('Account already exists. Please try logging in instead.');
      break;
      
    case 429:
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? `${retryAfter} seconds` : 'a moment';
      toast.error(`Too many Google auth attempts. Please wait ${waitTime} and try again.${securityContext}`);
      break;
      
    case 500:
      toast.error('Google authentication server error. Please try again later.');
      break;
      
    case 503:
      toast.error('Google authentication service unavailable. Please try again later.');
      break;
      
    default:
      const errorMessage = result.error || 'Google authentication failed. Please try again.';
      toast.error(`${errorMessage}${securityContext}`);
  }
}