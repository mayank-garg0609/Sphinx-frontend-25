import { memo } from 'react';
import Image from 'next/image';
import logo from '@/public/image/logo.webp';

export const SignUpHeader = memo(function SignUpHeader() {
  return (
    <header className="text-center space-y-4 py-4">
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          <Image
            className="w-8 h-8 bg-white rounded-full shadow-lg shadow-white/20"
            src={logo}
            alt="Sphinx Logo"
            placeholder="blur"
            priority
            width={32}
            height={32}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent tracking-wide">
          Sphinx'25
        </h1>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white">
          Create Your Account
        </h2>
        <p className="text-white/70 text-sm">
          Join us for an amazing experience
        </p>
      </div>

      {/* Decorative line */}
      <div className="flex items-center justify-center">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </header>
  );
});