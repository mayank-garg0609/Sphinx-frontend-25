import React, { memo } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import type { Policy } from "../types/legal";

const PolicyHeader = dynamic(
  () => import("./PolicyHeader").then((mod) => ({ default: mod.PolicyHeader })),
  {
    loading: () => (
      <div className="mb-12 md:mb-16 text-center animate-pulse">
        <div className="h-16 bg-zinc-900/30 rounded-xl mx-auto w-64 mb-4"></div>
        <div className="h-8 bg-zinc-900/20 rounded-lg mx-auto w-48"></div>
      </div>
    ),
  }
);

const PolicyContent = dynamic(
  () =>
    import("./PolicyContent").then((mod) => ({ default: mod.PolicyContent })),
  {
    loading: () => (
      <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-zinc-900/30 rounded-xl"></div>
        <div className="h-96 bg-zinc-900/30 rounded-xl"></div>
      </div>
    ),
  }
);

interface MainContentAreaProps {
  readonly currentPolicy: Policy;
  readonly isLoaded: boolean;
  readonly legalsBG: StaticImageData;
}

export const MainContentArea: React.FC<MainContentAreaProps> = memo(
  ({ currentPolicy, isLoaded, legalsBG }) => {
    return (
      <main className="w-full min-h-screen flex justify-center relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80 z-0" />

        {/* Background image */}
        <div className="fixed inset-0 z-0 lg:mt-0 lg:ml-[280px]">
          <Image
            src={legalsBG}
            alt="Legal documents background with legal scales and documents"
            fill
            className="object-cover opacity-30"
            sizes="(max-width: 1024px) 100vw, 80vw"
            quality={85}
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
        </div>

        {/* Main content - no extra spacing needed since nav is truly floating */}
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-36 lg:ml-[360px] relative z-10">
          <PolicyHeader policy={currentPolicy} isLoaded={isLoaded} />
          <PolicyContent content={currentPolicy.content} isLoaded={isLoaded} />
        </div>
      </main>
    );
  }
);

MainContentArea.displayName = "MainContentArea";