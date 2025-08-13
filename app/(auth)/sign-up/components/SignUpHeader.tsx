import { memo } from 'react';
import Image from 'next/image';
import logo from '@/public/image/logo.webp';

export const SignUpHeader = memo(function SignUpHeader() {
  return (
    <header className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2.5 2xl:gap-3">
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-3.5 2xl:gap-4 justify-center">
        <Image
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          src={logo}
          alt="Sphinx Logo"
          placeholder="blur"
          priority
          width={32}
          height={32}
        />
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white tracking-wide">
          Sphinx'25
        </h1>
      </div>

      <div className="text-center pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 flex flex-col space-y-0.5 sm:space-y-1 md:space-y-1 lg:space-y-2 xl:space-y-2 2xl:space-y-3">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white">
          Create Your Account
        </h2>

      </div>
    </header>
  );
});