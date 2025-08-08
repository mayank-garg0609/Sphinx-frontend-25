'use client';

import { useCallback, useState, useTransition } from 'react';
import type { UseFormReset } from 'react-hook-form';
import { toast } from 'sonner';
import type { LoginFormData } from '@/app/schemas/loginSchema';
import type { LoginResponse } from '../types/authTypes';
import { API_CONFIG } from '../utils/config';
import { handleAuthSuccess } from '../utils/authHelpers';
import { handleApiError, handleNetworkError } from '../utils/errorHandlers';

interface UseAuthReturn {
  loginUser: (data: LoginFormData) => Promise<void>;
  retryCount: number;
  isPending: boolean;
}

export function useAuth(
  router: any,
  reset: UseFormReset<LoginFormData>
): UseAuthReturn {
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const loginUser = useCallback(
    async (data: LoginFormData) => {
      console.log('🔐 Logging in with:', { ...data, password: '[PROTECTED]' });

      startTransition(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

          const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
            console.log('✅ Login successful');
            
            handleAuthSuccess(
              result.data?.token || result.token,
              result.data?.user || result.user,
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
          handleNetworkError(error, retryCount, API_CONFIG.maxRetries);
          if (retryCount < API_CONFIG.maxRetries) {
            setRetryCount(prev => prev + 1);
          }
        }
      });
    },
    [reset, router, retryCount]
  );

  return { loginUser, retryCount, isPending };
}