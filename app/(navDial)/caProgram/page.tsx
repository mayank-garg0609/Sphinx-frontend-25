"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import PerksSection from "./components/PerksSection";
import ResponsibilitiesSection from "./components/ResponsibilitiesSection";
import AmbassadorsSection from "./components/AmbassadorsSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { ReactLenis } from "@studio-freight/react-lenis";
import bgOverlay from "@/public/image/logo.png";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
import { useUser } from "@/app/hooks/useUser/useUser";
import { fetchProfileData } from "../profile/utils/api";

const typedBgOverlay: StaticImageData = bgOverlay;

function SectionSkeleton() {
  return (
    <div className="animate-pulse bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 mb-6">
      <div className="h-6 bg-yellow-300/20 rounded w-1/3 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300/20 rounded w-full" />
        <div className="h-4 bg-gray-300/20 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function CAProgramPage() {
  const lenisRef = useRef(null);
  const [overlayLoaded, setOverlayLoaded] = useState(false);
  const [isCA, setIsCA] = useState<boolean>(false);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);
  const router = useTransitionRouter();
  const { user, isLoggedIn, isLoading } = useUser();

  const handleOverlayLoad = useCallback(() => {
    setOverlayLoaded(true);
  }, []);

  // Function to check user role from API
  const checkUserRole = useCallback(async () => {
    if (!isLoggedIn || !user || isLoading) {
      setRoleLoading(false);
      return;
    }

    try {
      console.log("🔍 Checking user role...");
      const profileData = await fetchProfileData();

      const userRole = profileData.role || profileData.role || "";
      const isCAUser =
        userRole.toLowerCase().includes("ca") ||
        userRole.toLowerCase().includes("campus") ||
        userRole.toLowerCase().includes("ambassador");

      console.log("👤 User role:", userRole, "Is CA:", isCAUser);
      setIsCA(isCAUser);
    } catch (error) {
      console.error("❌ Error checking user role:", error);
      // On error, assume not a CA
      setIsCA(false);
    } finally {
      setRoleLoading(false);
    }
  }, [isLoggedIn, user, isLoading]);

  // Check role when component mounts and when user state changes
  useEffect(() => {
    if (!isLoading) {
      checkUserRole();
    }
  }, [checkUserRole, isLoading]);

  const handleApplyClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push("/caProgram/register", { onTransitionReady: slideInOut });
    },
    [router]
  );

  const handleDashboardClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.push("/caProgram/dashboard", { onTransitionReady: slideInOut });
    },
    [router]
  );

  const renderActionButton = () => {
    // Show loading state while checking role
    if (roleLoading) {
      return (
        <button
          type="button"
          disabled
          className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gray-600 text-gray-300 font-bold rounded-lg cursor-not-allowed transition-all duration-200 shadow-lg text-sm sm:text-base border border-gray-500"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </div>
        </button>
      );
    }

    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
      return (
        <Link
          href="/login"
          className="inline-block"
          prefetch={true}
          onClick={(e) => {
            e.preventDefault();
            router.push("/login", { onTransitionReady: slideInOut });
          }}
        >
          <button
            type="button"
            className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-400 hover:to-blue-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          >
            Login to Apply →
          </button>
        </Link>
      );
    }

    // If user is CA, show dashboard button
    if (isCA) {
      return (
        <Link
          href="/caProgram/dashboard"
          className="inline-block"
          prefetch={true}
          onClick={handleDashboardClick}
        >
          <button
            type="button"
            className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-400 hover:to-green-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Go to Dashboard →
          </button>
        </Link>
      );
    }

    // Default: show apply button
    return (
      <Link
        href="/caProgram/register"
        className="inline-block"
        prefetch={true}
        onClick={handleApplyClick}
      >
        <button
          type="button"
          className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
        >
          Apply Now →
        </button>
      </Link>
    );
  };

  return (
    <>
      <style jsx global>{`
        .blinking-bg-overlay {
          animation: blinkFade 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes blinkFade {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.45;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blinking-bg-overlay {
            animation: none;
            opacity: 0.25;
          }
        }
      `}</style>

      <div className="relative min-h-screen w-full overflow-hidden">
        <InteractiveBackground />

        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[5] w-[60vw] h-[60vh] sm:w-[50vw] sm:h-[50vh] lg:w-[40vw] lg:h-[40vh]">
          <Image
            src={typedBgOverlay}
            alt=""
            fill
            className={`object-cover rounded-lg transition-opacity duration-700 ${
              overlayLoaded ? "opacity-100 blinking-bg-overlay" : "opacity-0"
            }`}
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 50vw, 40vw"
            priority={false}
            quality={85}
            onLoad={handleOverlayLoad}
            role="presentation"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        <ReactLenis root ref={lenisRef}>
          <div className="relative z-10 min-h-screen">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
              <header className="text-center mb-8 sm:mb-12 lg:mb-16">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide leading-tight text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow-2xl px-2">
                  Campus Ambassador Program
                </h1>
                <p className="text-gray-100 text-sm xs:text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto drop-shadow-lg px-2">
                  Join our nationwide network of student leaders and become the
                  voice of{" "}
                  <span className="text-yellow-300 font-semibold">Sphinx</span>{" "}
                  at your campus
                </p>
              </header>

              <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
                <section className="bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
                    About the Program
                  </h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-100">
                    <p>
                      Sphinx, Rajasthan's largest techno-management fest and
                      MNIT Jaipur's flagship event, brings together thousands of
                      students from across India. Our Campus Ambassador Program
                      (CAP) is the backbone of this nationwide reach, connecting
                      passionate students who help promote and coordinate fest
                      activities at their respective institutions.
                    </p>
                    <p>
                      As a Campus Ambassador, you'll work directly with Team
                      Sphinx, becoming the official representative in your
                      college—creating buzz, driving participation, and
                      showcasing your leadership. Along the way, you'll gain
                      recognition, exclusive perks, and the opportunity to
                      sharpen your marketing and networking skills on a national
                      stage.
                    </p>
                  </div>
                </section>

                <Suspense fallback={<SectionSkeleton />}>
                  <PerksSection />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <ResponsibilitiesSection />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <AmbassadorsSection />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <FAQSection />
                </Suspense>

                <section className="bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl text-center border border-yellow-300/20">
                  <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 drop-shadow-lg">
                    {isCA
                      ? "Welcome Back, Ambassador!"
                      : "Ready to Make an Impact?"}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto">
                    {isCA
                      ? "Access your Campus Ambassador dashboard to track your progress, view tasks, and manage your activities."
                      : "Join hundreds of students who are already making a difference at their campuses. Applications are reviewed on a rolling basis, so apply early to secure your spot!"}
                  </p>

                  {renderActionButton()}
                </section>

                <Suspense fallback={<SectionSkeleton />}>
                  <ContactSection />
                </Suspense>
              </div>
            </div>
          </div>
        </ReactLenis>
      </div>
    </>
  );
}
