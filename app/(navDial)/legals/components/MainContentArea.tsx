import React, { memo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { Policy } from '../types/legal';

const PolicyHeader = dynamic(
  () => import('./PolicyHeader').then((mod) => ({ default: mod.PolicyHeader })),
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
  () => import('./PolicyContent').then((mod) => ({ default: mod.PolicyContent })),
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
  readonly legalsBG: any; // StaticImageData from Next.js
}

export const MainContentArea: React.FC<MainContentAreaProps> = memo(({
  currentPolicy,
  isLoaded,
  legalsBG
}) => {
  return (
    <main className="w-full min-h-screen flex justify-center relative">
      {/* Background Image Container */}
      <div className="fixed inset-0 z-0 lg:mt-44 lg:ml-70">
        <Image
          src={legalsBG}
          alt="Legal documents background"
          fill
          className="object-fill opacity-30"
          sizes="80vw"
          priority
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/70" />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pt-48 lg:pt-36 lg:ml-80 relative z-10">
        <PolicyHeader policy={currentPolicy} isLoaded={isLoaded} />
        <PolicyContent content={currentPolicy.content} isLoaded={isLoaded} />
      </div>
    </main>
  );
});

MainContentArea.displayName = 'MainContentArea';