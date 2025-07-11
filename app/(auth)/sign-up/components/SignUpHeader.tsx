import { memo } from "react";
import Image from "next/image";
import logo from "@/public/image/logo.webp";

export const SignUpHeader = memo(function SignUpHeader() {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center gap-3 justify-center">
        <Image
          className="w-5 h-5 lg:w-6 lg:h-6 bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          src={logo}
          alt="Sphinx Logo"
          placeholder="blur"
          blurDataURL={logo.blurDataURL}
          priority
        />
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">
          Sphinx'25
        </h1>
      </div>

      <div className="text-center pt-3 lg:pt-6 flex flex-col space-y-1 lg:space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold text-white">
          Create Your Account
        </h2>
      </div>
    </div>
  );
});