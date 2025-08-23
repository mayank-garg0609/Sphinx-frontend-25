import { memo } from 'react';
import Image from 'next/image';
import logo from '@/public/image/logo.webp';

export const LoginHeader = memo(function LoginHeader() {
  return (
    <header className="flex flex-col items-center gap-3 text-center mb-2">
      {/* Logo and Title */}
      <div className="flex items-center gap-2 justify-center">
        <Image
          className="w-6 h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          src={logo}
          alt="Sphinx Logo"
          placeholder="blur"
          priority
          width={24}
          height={24}
        />
        <h1 className="text-xl font-bold text-white tracking-wide">
          Sphinx'25
        </h1>
      </div>

      {/* Welcome Back Section */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-zinc-300">
          Log in to continue your journey
        </p>
      </div>
    </header>
  );
});