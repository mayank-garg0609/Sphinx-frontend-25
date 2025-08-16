"use client";

import { useState, useCallback, Suspense } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import logo from "@/public/image/logo.png";
import caRegister from "@/public/image/caRegister.webp";
import { RegistrationForm } from "./components/RegistrationForm";

const typedLogo: StaticImageData = logo;
const typedCaRegister: StaticImageData = caRegister;

function LoadingFallback() {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:justify-end lg:pr-24">
      <div className="bg-black/40 backdrop-blur-md text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] w-full max-w-sm sm:max-w-md border border-white/30 animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={typedCaRegister}
          alt="Campus Ambassador Registration Background"
          fill
          placeholder="blur"
          className={`object-contain lg:object-contain lg:object-left-bottom transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          priority={true}
          quality={75}
          onLoad={handleImageLoad}
        />
      </div>

      <div className="absolute inset-0 z-5 bg-gradient-to-r from-black/60 via-transparent to-black/40 lg:from-black/40 lg:via-transparent lg:to-black/60" />
      
      <Suspense fallback={<LoadingFallback />}>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:justify-end lg:pr-24">
          <RegistrationForm logo={typedLogo} />
        </div>
      </Suspense>
    </div>
  );
}