"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SKILLS_DATA, STATS_DATA } from "./types/aboutUs";
import { ReactLenis } from "@studio-freight/react-lenis";

const HeroSection = dynamic(() => import("./components/HeroSection"));
const AboutSection = dynamic(() => import("./components/AboutSection"));
const SkillsSection = dynamic(() => import("./components/SkillsSection"));
const CTASection = dynamic(() => import("./components/CTASection"));
const Footer = dynamic(() => import("./components/Footer"));

export default function AboutUsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root ref={lenisRef}>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-x-hidden">
        <HeroSection isLoaded={isLoaded} />
        <AboutSection isLoaded={isLoaded} />
        <SkillsSection skills={SKILLS_DATA} stats={STATS_DATA} />{" "}
        <CTASection />
        <Footer />
      </div>
    </ReactLenis>
  );
}
