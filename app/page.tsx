"use client";
import React, { useState, useEffect } from "react";
import GlowGlitchLogo from "@/app/components/GlowGlitchLogo";

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

      // Check if countdown is finished
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

  return (
    <main className="min-h-screen bg-black">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <GlowGlitchLogo
          text="SPHINX"
          onAnimationComplete={handleAnimationComplete}
          autoPlay={true}
          duration={4000}
          className="absolute inset-0"
        />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>
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
                  <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400/20"></div>
                    ))}
                  </div>
                </div>

                <div className="relative bg-black/80 border-2 border-cyan-400/50 rounded-lg p-8 backdrop-blur-sm">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

                  <div className="text-cyan-400 text-sm font-mono mb-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    SYSTEM ONLINE - COUNTDOWN ACTIVE
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-6">
                    {[
                      { label: "DAYS", value: timeLeft.days },
                      { label: "HOURS", value: timeLeft.hours },
                      { label: "MINUTES", value: timeLeft.minutes },
                      { label: "SECONDS", value: timeLeft.seconds },
                    ].map((unit, index) => (
                      <div key={unit.label} className="text-center">
                        <div className="relative">
                          <div className="text-4xl md:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 filter drop-shadow-lg">
                            {formatNumber(unit.value)}
                          </div>
                          <div className="absolute inset-0 text-4xl md:text-6xl font-mono font-bold text-cyan-400/20 animate-pulse">
                            {formatNumber(unit.value)}
                          </div>
                        </div>
                        <div className="text-xs md:text-sm text-cyan-400/80 font-mono tracking-wider mt-2 border-b border-cyan-400/30 pb-1">
                          {unit.label}
                        </div>
                        <div className="w-full h-1 bg-gray-800/50 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"
                            style={{
                              width: `${Math.min(
                                100,
                                (unit.value /
                                  (unit.label === "DAYS"
                                    ? 365
                                    : unit.label === "HOURS"
                                    ? 24
                                    : 60)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="text-lg md:text-xl text-purple-400 font-mono tracking-wider mb-2">
                      [ MISSION LAUNCH SEQUENCE INITIATED ]
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      TARGET: {targetDate.toLocaleDateString()}{" "}
                      {targetDate.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-ping"></div>
                </div>

                <div className="flex gap-4 mt-6 justify-center"></div>
              </div>
            )}

            {!countdownActive && isCountdownFinished && (
              <div className="animate-fade-in">
                <div className="relative bg-black/80 border-2 border-green-400/50 rounded-lg p-8">
                  <div className="text-green-400 text-sm font-mono mb-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    MISSION STATUS: LAUNCHED
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 font-mono">
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
