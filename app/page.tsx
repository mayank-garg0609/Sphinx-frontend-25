"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import GlowGlitchLogo from "@/app/components/GlowGlitchLogo";
import ParticleEffect from "@/app/animations/particleEffects";

export default function HomePage() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [targetDate, setTargetDate] = useState<Date>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const getCurrentTime = (): Date => {
    return new Date();
  };

  const calculateTimeLeft = () => {
    const now = getCurrentTime();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const handleAnimationComplete = () => {
    console.log("Logo animation completed!");
    setTimeout(() => {
      setShowMainContent(true);
      setCountdownActive(true);
    }, 500);
  };

  useEffect(() => {
    if (!countdownActive) return;

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setCountdownActive(false);
        console.log("Countdown finished!");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownActive, targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const isCountdownFinished =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const getProgress = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const CircularTimer = ({
    value,
    max,
    label,
  }: {
    value: number;
    max: number;
    label: string;
  }) => {
    const progress = getProgress(value, max);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth="8"
              fill="transparent"
              className="drop-shadow-sm"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out filter drop-shadow-lg"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 filter drop-shadow-lg">
                {formatNumber(value)}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10 animate-pulse"></div>
        </div>

        <div className="text-xs md:text-sm text-cyan-400/80 font-mono tracking-wider mt-3 text-center">
          {label}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
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
        <GlowGlitchLogo
          text="SPHINX"
          onAnimationComplete={handleAnimationComplete}
          autoPlay={true}
          duration={1000}
          className="absolute inset-0"
        />

        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-border-glow"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-border-glow"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-border-glow-vertical"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-border-glow-vertical"></div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            showMainContent ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-center text-white z-20 relative">
            {countdownActive && (
              <div className="relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-16 grid-rows-16 w-full h-full animate-grid-pulse">
                    {Array.from({ length: 256 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-cyan-400/20"
                        style={{
                          animationDelay: `${(i * 0.1) % 5}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-500/30 blur-2xl animate-glow-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-pink-400/20 blur-xl animate-glow-pulse-reverse"></div>

                  <div className="relative bg-black/90 backdrop-blur-xl rounded-full p-8 md:p-12 border border-cyan-400/40 shadow-2xl shadow-cyan-400/20">
                    <div className="absolute inset-3 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin-slow"></div>
                    <div className="absolute inset-6 rounded-full border border-dotted border-purple-400/25 animate-reverse-spin"></div>
                    <div className="absolute inset-9 rounded-full border border-solid border-pink-400/15 animate-spin-slower"></div>

                    <div className="text-cyan-400 text-xs md:text-sm font-mono mb-6 flex items-center justify-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span
                          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                      SYSTEM ONLINE - COUNTDOWN ACTIVE
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
                      <CircularTimer
                        value={timeLeft.days}
                        max={365}
                        label="DAYS"
                      />
                      <CircularTimer
                        value={timeLeft.hours}
                        max={24}
                        label="HOURS"
                      />
                      <CircularTimer
                        value={timeLeft.minutes}
                        max={60}
                        label="MINS"
                      />
                      <CircularTimer
                        value={timeLeft.seconds}
                        max={60}
                        label="SECS"
                      />
                    </div>

                    <div className="text-center">
                      <div className="text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 font-mono tracking-wider mb-2 animate-text-glow">
                        [ MISSION LAUNCH SEQUENCE INITIATED ]
                      </div>
                      <div className="text-xs md:text-sm text-gray-400 font-mono">
                        TARGET: {targetDate.toLocaleDateString()}{" "}
                        {targetDate.toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-scan-line"></div>
                    <div className="absolute inset-x-0 bottom-1/3 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-scan-line-reverse"></div>
                  </div>

                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400 animate-corner-glow"></div>
                  <div
                    className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-cyan-400 animate-corner-glow"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-cyan-400 animate-corner-glow"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400 animate-corner-glow"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                </div>
              </div>
            )}

            {!countdownActive && isCountdownFinished && (
              <div className="animate-fade-in">
                <div className="relative bg-black/90 border-2 border-green-400/60 rounded-xl p-8 backdrop-blur-xl shadow-2xl shadow-green-400/20">
                  <div className="text-green-400 text-sm font-mono mb-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    MISSION STATUS: LAUNCHED
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 font-mono animate-text-glow">
                    SPHINX ONLINE
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-mono">
                    [ SYSTEM FULLY OPERATIONAL ]<br />
                    THE FUTURE IS NOW
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
