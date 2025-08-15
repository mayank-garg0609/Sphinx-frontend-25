"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FloatingCursor } from "./components/FloatingCursor";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { CustomStyles } from "./components/CustomStyles";
import { useMouseTracker } from "./hooks/useMouseTracker";
import { POLICIES } from "./utils/constants";
import type { PolicyKey } from "./types/legal";
import { ReactLenis } from "@studio-freight/react-lenis";
import legalsBG from "@/public/image/legalsBG.png";

const SidebarNavigation = dynamic(
  () =>
    import("./components/SidebarNavigation").then((mod) => ({
      default: mod.SidebarNavigation,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="hidden lg:block fixed left-10 top-20 bottom-0 w-80 bg-zinc-900/30 animate-pulse" />
    ),
  }
);

const MobilePolicySelector = dynamic(
  () =>
    import("./components/MobilePolicySelector").then((mod) => ({
      default: mod.MobilePolicySelector,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="lg:hidden fixed top-20 left-0 right-0 z-40 h-16 bg-black/90 animate-pulse" />
    ),
  }
);

// Import the new MainContentArea component
const MainContentArea = dynamic(
  () =>
    import("./components/MainContentArea").then((mod) => ({
      default: mod.MainContentArea,
    })),
  {
    loading: () => (
      <main className="w-full min-h-screen flex justify-center">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pt-48 lg:pt-36 lg:ml-80 animate-pulse">
          <div className="h-32 bg-zinc-900/30 rounded-xl mb-12"></div>
          <div className="space-y-8">
            <div className="h-24 bg-zinc-900/30 rounded-xl"></div>
            <div className="h-96 bg-zinc-900/30 rounded-xl"></div>
          </div>
        </div>
      </main>
    ),
  }
);

const Footer = dynamic(
  () => import("./components/Footer").then((mod) => ({ default: mod.Footer })),
  {
    ssr: true,
  }
);

const SEO_DATA = {
  title: "Legal Documents - Privacy Policy, Terms of Service & Cookie Policy",
  description:
    "Review our comprehensive legal documentation including privacy policy, terms of service, and cookie policy. Updated for 2024 compliance.",
  keywords:
    "privacy policy, terms of service, cookie policy, legal documents, data protection, GDPR compliance",
} as const;

export default function LegalsPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyKey>("privacy");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const lenisRef = useRef(null);

  const mousePosition = useMouseTracker();

  const handlePolicySelect = useCallback((policyKey: PolicyKey) => {
    setSelectedPolicy(policyKey);
  }, []);

  const currentPolicy = useMemo(
    () => POLICIES[selectedPolicy],
    [selectedPolicy]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preloadPolicies = () => {
      Object.keys(POLICIES).forEach((key) => {
        if (key !== selectedPolicy) {
          // Preload policy data - already in memory due to constants
        }
      });
    };

    const timer = setTimeout(preloadPolicies, 1000);
    return () => clearTimeout(timer);
  }, [selectedPolicy]);

  return (
    <>
      <Head>
        <title>{SEO_DATA.title}</title>
        <meta name="description" content={SEO_DATA.description} />
        <meta name="keywords" content={SEO_DATA.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_DATA.title} />
        <meta property="og:description" content={SEO_DATA.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SEO_DATA.title} />
        <meta name="twitter:description" content={SEO_DATA.description} />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        <ReactLenis root ref={lenisRef}>
          <FloatingCursor position={mousePosition} />
          <BackgroundEffects />

          <div className="flex min-h-screen relative z-10">
            <SidebarNavigation
              policies={POLICIES}
              selectedPolicy={selectedPolicy}
              onPolicySelect={handlePolicySelect}
            />
            <MobilePolicySelector
              policies={POLICIES}
              selectedPolicy={selectedPolicy}
              onPolicySelect={handlePolicySelect}
            />
            
            {/* Use the new MainContentArea component */}
            <MainContentArea
              currentPolicy={currentPolicy}
              isLoaded={isLoaded}
              legalsBG={legalsBG}
            />
          </div>

          <Footer />
          <CustomStyles />
        </ReactLenis>
      </div>
    </>
  );
}