"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Play, Award, Users, Camera, Zap } from "lucide-react";

interface StatItemProps {
  value: string;
  label: string;
  delay?: number;
}

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay?: number;
}

const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({
  value,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / 60;
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return Math.min(prev + increment, value);
        });
      }, 25);
      return () => clearInterval(interval);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span>
      {Math.floor(count)}
      {suffix}
    </span>
  );
};

// Stat Item Component
const StatItem: React.FC<StatItemProps> = ({ value, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const numericValue = parseInt(value.replace(/\D/g, ""));
  const suffix = value.replace(/\d/g, "");

  return (
    <div
      className={`text-center transform transition-all duration-1000 ease-out cursor-pointer ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95"
      } ${isHovered ? "scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`text-4xl md:text-5xl font-bold mb-3 transition-all duration-500 ${
          isHovered ? "text-yellow-400" : "text-white"
        }`}
      >
        <AnimatedCounter value={numericValue} suffix={suffix} />
      </div>
      <div className="text-zinc-400 text-sm uppercase tracking-wider font-medium">
        {label}
      </div>
      <div
        className={`w-12 h-0.5 mx-auto mt-3 transition-all duration-500 ${
          isHovered ? "bg-yellow-400 w-16" : "bg-zinc-700"
        }`}
      ></div>
    </div>
  );
};

// Skill Bar Component
const SkillBar: React.FC<SkillBarProps> = ({
  skill,
  percentage,
  delay = 0,
}) => {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setWidth(percentage), 200);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div
      className={`mb-8 transform transition-all duration-1000 ease-out cursor-pointer ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className={`font-semibold transition-colors duration-300 ${
            isHovered ? "text-yellow-400" : "text-white"
          }`}
        >
          {skill}
        </span>
        <span className="text-yellow-400 font-bold text-lg">{percentage}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1500 ease-out relative overflow-hidden ${
            isHovered
              ? "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300"
              : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400"
          }`}
          style={{ width: `${width}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AboutUsPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-black/90 to-zinc-900/80"></div>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-zinc-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className={`text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-zinc-200 to-zinc-300 bg-clip-text text-transparent transform transition-all duration-1500 ${
                isLoaded
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-20 opacity-0 scale-95"
              }`}
            >
              About SPHINX
            </h1>
            <div
              className={`w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 mx-auto transform transition-all duration-1000 delay-500 ${
                isLoaded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
            ></div>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div
            className={`transform transition-all duration-1500 delay-300 ease-out ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0"
            }`}
          >
            <div className="relative group">
              <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:shadow-yellow-500/10">
                <div className="w-full h-full bg-gradient-to-br from-yellow-900/10 to-transparent flex items-center justify-center relative">
                  <div className="text-center p-8 transform transition-all duration-500 group-hover:scale-110">
                    <Camera className="w-20 h-20 text-yellow-400 mx-auto mb-6 transform transition-all duration-500 group-hover:rotate-12" />
                    <p className="text-zinc-300 text-lg font-medium">
                      Technical Festival
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Play className="w-10 h-10 text-black ml-1 font-bold" />
              </div>
            </div>
          </div>

          <div
            className={`transform transition-all duration-1500 delay-700 ease-out ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-6 font-bold">
              MNIT Jaipur
            </h3>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Celebrating Culture & Creativity <br />
              <span className="text-yellow-400">The Best</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light">
              SPHINX is the cultural heartbeat of MNIT Jaipur — a festival that
              blends art, music, dance, literature, and expression into an
              electrifying celebration. Experience unforgettable performances,
              workshops, and creative brilliance at one of India's premier
              campus fests.
            </p>
            <button className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-10 py-4 rounded-full font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/25 transform hover:scale-105 hover:-translate-y-1">
              <span className="group-hover:mr-2 transition-all duration-300">
                Contact Us
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              SPHINX Highlights{" "}
            </h2>
            <p className="text-zinc-400 mb-16 text-lg leading-relaxed">
              From electrifying stage events and artistic showcases to immersive
              cultural experiences and competitions, SPHINX is where passion
              meets performance.
            </p>
            <div>
              <SkillBar skill="Video Editing" percentage={85} delay={300} />
              <SkillBar skill="Videography" percentage={90} delay={500} />
              <SkillBar skill="Branding" percentage={75} delay={700} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <StatItem value="20+" label="Years Experience" delay={900} />
            <StatItem value="1,000+" label="Projects Done" delay={1100} />
            <StatItem value="300+" label="Satisfied Clients" delay={1300} />
            <StatItem value="64" label="Awards Won" delay={1500} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-16 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-zinc-500/5 rounded-full blur-2xl"></div>
            <div className="relative text-center">
              <p className="text-yellow-400 text-sm uppercase tracking-widest mb-6 font-bold">
                Hire Us Now
              </p>
              <h2 className="text-5xl md:text-6xl font-bold mb-12 leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Join the Cultural Revolution at <br />
                <span className="text-yellow-400">SPHINX, MNIT Jaipur</span>
              </h2>
              <button className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-12 py-4 rounded-full font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/25 inline-flex items-center transform hover:scale-105 hover:-translate-y-1">
                Get Started
                <ChevronRight className="w-6 h-6 ml-3 transform transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              SPHINX
            </h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              SPHINX is MNIT Jaipur’s annual cultural festival — a celebration
              of creativity, energy, and artistic excellence that brings
              students from across the nation together.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">
              Get In Touch
            </h4>
            <div className="space-y-3 text-zinc-400">
              <p className="hover:text-white transition-colors duration-300">
                3443 Oak Ridge Omaha, GA 45065
              </p>
              <p className="hover:text-white transition-colors duration-300">
                800-625-4125
              </p>
              <p className="hover:text-white transition-colors duration-300">
                402-245-7543
              </p>
              <p className="hover:text-white transition-colors duration-300">
                hello@digita.com
              </p>
            </div>
          </div>

          <div>
            <button className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-8 py-3 rounded-full font-bold transition-all duration-500 inline-flex items-center transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-yellow-400/25">
              Explore
              <Zap className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:rotate-12" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500">
          <p>Copyright © 2024 SPHINX | MNIT Jaipur</p>
        </div>
      </footer>
    </div>
  );
};
``;
export default AboutUsPage;
