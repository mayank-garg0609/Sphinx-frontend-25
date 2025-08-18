"use client";
import React, { useState } from "react";
import Image from "next/image";
import ParticleEffect from "@/app/animations/particleEffects";
import Orb from "@/app/components/orb";
import Countdown from "@/app/components/countdown";
import LightRays from "@/app/components/rays";
import Particles from "@/app/components/particles";
import BlurText from "@/app/components/blur";

export default function HomePage() {
  const [targetDate] = useState<Date>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  );

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/image/BG.png"
          alt="Futuristic Background"
          fill
          className="object-cover opacity-40"
          priority
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/..."
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-purple-900/10 animate-pulse"></div>

      <div className="absolute inset-0 z-1">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      <div className="absolute inset-0 z-2">
        <Particles
          particleColors={["#ffffff", "#3B82F6", "#06b6d4"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-light-sweep"></div>
        <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent animate-light-sweep-vertical"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-pink-400/20 to-transparent rotate-45 animate-diagonal-sweep"></div>
        </div>
      </div>

      <div className="hidden md:block">
        <ParticleEffect />
      </div>

      <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
        {/* Border Effects */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-border-glow"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-border-glow"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-border-glow-vertical"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-border-glow-vertical"></div>
        </div>

        {/* Main Content */}
        <div className="text-center text-white z-20 relative">
          {/* Enhanced Orb with Text Overlay */}
          <div className="relative flex flex-col items-center justify-center mb-8">
            <div className="relative w-96 h-96">
              <Orb
                hoverIntensity={0.7}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
                className="w-full h-full"
              />

              {/* Text Overlay on Orb */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold font-space text-white mb-4 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                  SPHINX'25
                </div>
                <BlurText
                  text="Rajasthan's Largest Techno-Management Fest"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-lg text-cyan-300 text-center max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Countdown Component */}
          <div className="mt-8">
            <Countdown
              targetDate={targetDate.toISOString()}
              className="relative z-30"
            />
          </div>
        </div>
      </section>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes light-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }

        @keyframes light-sweep-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes diagonal-sweep {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(200vw) translateY(200vh) rotate(45deg); }
        }

        @keyframes border-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        @keyframes border-glow-vertical {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        .animate-light-sweep {
          animation: light-sweep 3s linear infinite;
        }
        .animate-light-sweep-vertical {
          animation: light-sweep-vertical 4s linear infinite;
        }
        .animate-diagonal-sweep {
          animation: diagonal-sweep 5s linear infinite;
        }
        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }
        .animate-border-glow-vertical {
          animation: border-glow-vertical 2.5s ease-in-out infinite;
        }

        .bg-radial-gradient {
          background: radial-gradient(
            circle,
            transparent 0%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        .font-space {
          font-family: "Space Armor", monospace;
        }
      `}</style>
    </main>
  );
}