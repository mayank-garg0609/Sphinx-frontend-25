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
    <div className="text-center text-sm text-zinc-400 border-t border-zinc-700 pt-6">
      Don't have an account?{' '}
      <Link
        href="/sign-up"
        onClick={handleSignUpClick}
        className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
});