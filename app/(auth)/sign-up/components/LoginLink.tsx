'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import { useTransitionRouter } from 'next-view-transitions';
import { slideInOut } from '@/app/animations/pageTrans';

export const LoginLink = memo(function LoginLink() {
  const router = useTransitionRouter();

  const handleLoginClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push('/login' , { onTransitionReady: slideInOut });
    },
    [router]
  );

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center gap-2 text-white/70 text-xs">
        <span>Already have an account?</span>
        <Link
          href="/login"
          onClick={handleLoginClick}
          className="
            text-blue-400 hover:text-blue-300 font-semibold
            underline underline-offset-2 decoration-blue-400/60 hover:decoration-blue-300
            focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:rounded
            transition-all duration-200
          "
        >
          Sign In
        </Link>
      </div>
    </div>
  );
});