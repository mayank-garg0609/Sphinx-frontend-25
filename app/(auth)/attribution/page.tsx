"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import logo from "@/public/image/logo.webp";
import caRegister from "@/public/image/caRegister.webp";
import { RegistrationForm } from "./components/RegistrationForm";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useUser } from "@/app/hooks/useUser/useUser";
import { slideInOut } from "@/app/animations/pageTrans";

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen w-full relative bg-black overflow-hidden flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-white">
      <LoadingSpinner />
      <p className="text-lg">Loading registration form...</p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-screen w-full relative bg-black overflow-hidden flex items-center justify-center">
    <div className="text-center text-white max-w-md mx-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-zinc-300 mb-6">
        We encountered an error while loading the registration form.
      </p>
      <button
        onClick={retry}
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Main page component
const RegisterPageContent = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isLoggedIn, isLoading, user } = useUser();
  const router = useTransitionRouter();
  const searchParams = useSearchParams();

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    console.error("Failed to load background image");
    setImageLoaded(true); // Continue even if image fails
  }, []);

  const retry = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      console.log("User not authenticated, redirecting to login");
      const currentPath = window.location.pathname;
      const searchParamsStr = searchParams.toString();
      const redirectUrl = `/login?redirect=${encodeURIComponent(
        currentPath + (searchParamsStr ? `?${searchParamsStr}` : '')
      )}`;
      router.push(redirectUrl);
    }
  }, [isLoading, isLoggedIn, router, searchParams]);

  // Set page metadata
  useEffect(() => {
    document.title = "Complete Your Profile - Sphinx'25";
    
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag("description", "Complete your profile for Sphinx'25 - India's Premier Technical Festival");
    setMetaTag("robots", "noindex, nofollow");

    return () => {
      document.title = "Sphinx'25";
    };
  }, []);

  // Add security event listeners
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === "production") {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Show error fallback if there's an error
  if (error) {
    return <ErrorFallback error={error} retry={retry} />;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Don't render anything if user is not authenticated (redirect is in progress)
  if (!isLoggedIn) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={caRegister}
          alt="" // Decorative image
          fill
          placeholder="blur"
          blurDataURL={caRegister.blurDataURL}
          className={`object-cover lg:object-contain lg:object-left-bottom transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-50"
          }`}
          sizes="100vw"
          priority={false}
          quality={75}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-5 bg-gradient-to-r from-black/70 via-black/40 to-black/60 lg:from-black/50 lg:via-transparent lg:to-black/70" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 lg:justify-end lg:pr-24">
        <div className="w-full max-w-sm sm:max-w-md">
          <RegistrationForm logo={logo} />
        </div>
      </div>

      {/* Skip to main content link for accessibility */}
      <a
        href="#registration-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-lg font-semibold z-50"
      >
        Skip to registration form
      </a>
    </div>
  );
};

// Main page component with Suspense wrapper
export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterPageContent />
    </Suspense>
  );
}