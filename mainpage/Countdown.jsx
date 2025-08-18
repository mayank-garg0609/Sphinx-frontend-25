"use client";
import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2025-09-25T23:59:59").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  });

  // ⭐ Store stars safely (no TypeScript type here)
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // ⭐ generate stars only on client
    const starArray = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(starArray);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, min: 0, sec: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, min, sec });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bg-transparent flex flex-col items-center justify-center ">
     
      

      {/* Countdown Grid */}
      <div className="grid grid-flow-col gap-6 text-center auto-cols-max justify-center items-center flex-wrap relative z-10">
        <CountdownCard value={timeLeft.days} label="Days" color="blue" />
        <CountdownCard value={timeLeft.hours} label="Hours" color="purple" />
        <CountdownCard value={timeLeft.min} label="Min" color="pink" />
        <CountdownCard value={timeLeft.sec} label="Sec" color="cyan" />
      </div>
    </div>
  );
}

function CountdownCard({ value, label, color }) {
  const colorMap = {
    blue: "from-gray-900 to-black border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.9)] text-blue-400",
    purple:
      "from-gray-900 to-black border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.9)] text-purple-400",
    pink: "from-gray-900 to-black border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.9)] text-pink-400",
    cyan: "from-gray-900 to-black border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.9)] text-cyan-400",
  };

  const formattedValue = String(value).padStart(2, "0");

  return (
    <div
      className={`flex flex-col p-3 sm:p-6 bg-gradient-to-br rounded-2xl border hover:scale-110 transition-transform duration-500 ${colorMap[color]}`}
    >
      <span className="font-mono text-5xl sm:text-6xl font-bold drop-shadow-[0_0_20px_currentColor]">
        {formattedValue}
      </span>
      <span className="uppercase text-sm tracking-widest mt-2 text-white/70">
        {label}
      </span>
    </div>
  );
}

/* ✨ Extra Tailwind Animations (add to globals.css)
-------------------------------------- */
/*
@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
.animate-twinkle {
  animation: twinkle 3s infinite;
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 6s infinite;
}
*/
