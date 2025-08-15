import React, { useMemo } from "react";
import { HeroSectionProps } from "../types/aboutUs";

const HeroSection: React.FC<HeroSectionProps> = React.memo(({ isLoaded }) => {
  const titleClasses = useMemo(() =>
    `text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-zinc-200 to-zinc-300 bg-clip-text text-transparent transform transition-all duration-1500 ${
      isLoaded
        ? "translate-y-0 opacity-100 scale-100"
        : "translate-y-20 opacity-0 scale-95"
    }`,
    [isLoaded]
  );

  const underlineClasses = useMemo(() =>
    `w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 mx-auto transform transition-all duration-1000 delay-500 ${
      isLoaded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
    }`,
    [isLoaded]
  );

  return (
    <section className="relative px-6 py-24 pt-40 md:pt-45"> 
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-black/90 to-zinc-900/80"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-zinc-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={titleClasses}>
            About SPHINX
          </h1>
          <div className={underlineClasses}></div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;