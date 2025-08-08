'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import { useTransitionRouter } from 'next-view-transitions';

export const SignUpLink = memo(function SignUpLink() {
  const router = useTransitionRouter();

  const handleSignUpClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push('/sign-up');
    },
    [router]
  );

  return (
    <div className="text-center text-xs lg:text-sm text-zinc-400 mt-2 lg:mt-2">
      Don't have an account?{' '}
      <Link
        href="/sign-up"
        onClick={handleSignUpClick}
        className="text-blue-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded"
      >
        Sign Up
      </Link>
    </div>
  );
});