import { useState, useEffect, useCallback, useMemo } from 'react';
import { DESKTOP_BREAKPOINT } from '../utils/constants';

const useThrottledResize = (callback: () => void, delay: number = 150) => {
  const throttledCallback = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }, [callback, delay]);

  useEffect(() => {
    window.addEventListener('resize', throttledCallback, { passive: true });
    return () => {
      window.removeEventListener('resize', throttledCallback);
    };
  }, [throttledCallback]);
};

export const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const checkIsDesktop = useCallback((): boolean => {
    return typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT;
  }, []);

  const handleResize = useCallback(() => {
    setIsDesktop(checkIsDesktop());
  }, [checkIsDesktop]);

  useThrottledResize(handleResize);

  useEffect(() => {
    setIsClient(true);
    setIsDesktop(checkIsDesktop());
  }, [checkIsDesktop]);

  return useMemo(() => ({ isDesktop, isClient }), [isDesktop, isClient]);
};