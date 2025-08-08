"use client";
import { Suspense } from "react";
import Link from "next/link";
import PerksSection from "./components/PerksSection";
import ResponsibilitiesSection from "./components/ResponsibilitiesSection";
import AmbassadorsSection from "./components/AmbassadorsSection";
import FAQSection from "./components/FAQSection";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <InteractiveBackground />
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
                <span className="text-yellow-300 font-semibold">Sphinx</span> at
                your campus
              </p>
            </header>

            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
              <section className="bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
                  About the Program
                </h2>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-100">
                  <p>
                    <span className="text-yellow-300 font-semibold">
                      Sphinx
                    </span>
                    , MNIT Jaipur's flagship technical festival, brings together
                    thousands of students from across India. Our Campus
                    Ambassador Program (CAP) is the backbone of this nationwide
                    reach, connecting passionate students who help promote and
                    coordinate fest activities at their respective institutions.
                  </p>
                  <p>
                    As a Campus Ambassador, you'll work directly with Team
                    Sphinx, gaining invaluable experience in event management,
                    marketing, and leadership while building connections that
                    last beyond college.
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
                  Ready to Make an Impact?
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto">
                  Join hundreds of students who are already making a difference
                  at their campuses. Applications are reviewed on a rolling
                  basis, so apply early to secure your spot!
                </p>

                <Link
                  href="/caProgram/register"
                  className="inline-block"
                  prefetch={true}
                >
                  <button
                    type="button"
                    className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                  >
                    Apply Now →
                  </button>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </ReactLenis>
    </div>
  );
}
