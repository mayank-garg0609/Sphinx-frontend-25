import { memo } from 'react';
import Image from 'next/image';
import logo from '@/public/image/logo.webp';

export const LoginHeader = memo(function LoginHeader() {
  return (
    <header className="flex flex-col gap-2 lg:gap-2">
      <div className="flex items-center gap-3 justify-center">
        <Image
          className="w-5 h-5 lg:w-6 lg:h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          src={logo}
          alt="Sphinx Logo"
          placeholder="blur"
          priority
          width={24}
          height={24}
        />
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">
          Sphinx'25
        </h1>
      </div>

      <div className="text-center pt-4 lg:pt-6 flex flex-col space-y-1 lg:space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="text-xs lg:text-sm text-zinc-400">
          Log in to your account
        </p>
      </div>
    </header>
  );
});