'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import { useTransitionRouter } from 'next-view-transitions';

export const LoginLink = memo(function LoginLink() {
  const router = useTransitionRouter();

  const handleLoginClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push('/login');
    },
    [router]
  );

  return (
    <div className="text-center text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg text-zinc-400 mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-2.5 2xl:mt-3">
      Already have an account?{' '}
      <Link
        href="/login"
        onClick={handleLoginClick}
        className="text-blue-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded"
      >
        Log In
      </Link>
    </div>
  );
});