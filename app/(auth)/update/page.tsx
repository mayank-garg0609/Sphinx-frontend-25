"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import logo from "@/public/image/logo.webp";
import caRegister from "@/public/image/caRegister.webp";
import { RegistrationForm } from "./components/RegistrationForm";
import { Suspense } from "react";

export default function RegisterPage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={caRegister}
          alt="Campus Ambassador Registration Background"
          width={1200}
          height={800}
          placeholder="blur"
          blurDataURL={caRegister.blurDataURL}
          className={`h-full w-full object-contain lg:object-contain lg:object-left-bottom transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 1024px) 100vw, 1200px"
          priority={false}
          quality={75}
          onLoad={handleImageLoad}
        />
      </div>

      <div className="absolute inset-0 z-5 bg-gradient-to-r from-black/60 via-transparent to-black/40 lg:from-black/40 lg:via-transparent lg:to-black/60" />
      <Suspense fallback={<div>Loading form...</div>}>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:justify-end lg:pr-24">
          <RegistrationForm logo={logo} />
        </div>
      </Suspense>
    </div>
  );
}
