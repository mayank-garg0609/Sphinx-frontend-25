"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, Phone, Mail, Globe } from "lucide-react";
import Image from "next/image";
import logo from "@/public/image/logo.png";
import Link from "next/link";
interface TeamMember {
  id: string;
  name: string;
  branch: string;
  imageUrl: string;
  age: number;
  designation: string;
  description: string;
}

const mockTeamData: TeamMember[] = [
  {
    id: "1",
    name: "АНДРЕЙ ИВАНОВ",
    branch: "ХИМИЧЕСКИЙ ИНЖЕНЕР",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    age: 25,
    designation: "КОМАНДА",
    description:
      "Команда профессионалов, которая реализует инновационные решения в области химического производства и технологических процессов.",
  },
  {
    id: "2",
    name: "СТАНИСЛАВ ПОПОВ",
    branch: "ТЕХНИЧЕСКИЙ ДИРЕКТОР",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
    age: 28,
    designation: "КОМАНДА",
    description:
      "Команда экспертов, объединенных общей целью создания выдающихся технических решений для современного производства.",
  },
  {
    id: "4",
    name: "ЕЛЕНА КОЗЛОВА",
    branch: "ДИРЕКТОР ПО МАРКЕТИНГУ",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
    age: 29,
    designation: "КОМАНДА",
    description:
      "Профессионалы, стремящиеся к совершенству в каждом проекте и взаимодействии с клиентами.",
  },
  {
    id: "5",
    name: "СЕРГЕЙ ВОЛКОВ",
    branch: "ВЕДУЩИЙ РАЗРАБОТЧИК",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
    age: 26,
    designation: "КОМАНДА",
    description:
      "Инновационная команда, которая превращает смелые идеи в реальные технологические решения.",
  },
  {
    id: "6",
    name: "АННА МОРОЗОВА",
    branch: "UX/UI ИНЖЕНЕР",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&crop=face",
    age: 27,
    designation: "КОМАНДА",
    description:
      "Креативные профессионалы, создающие интуитивные и красивые пользовательские интерфейсы.",
  },
];

const TeamPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const activeMember = mockTeamData[activeIndex];

  // Setup intersection observer for center detection
  useEffect(() => {
    if (!railRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;

        let maxRatio = 0;
        let maxIndex = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            maxIndex = index;
          }
        });

        if (maxRatio > 0.75) {
          setActiveIndex(maxIndex);
        }
      },
      {
        root: railRef.current,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0.5, 0.75, 0.9],
      }
    );

    const items = railRef.current.querySelectorAll("li");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isScrolling]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const rail = railRef.current;
    if (rail) {
      rail.addEventListener("scroll", handleScroll, { passive: true });
      return () => rail.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (!railRef.current) return;

    const items = railRef.current.children;
    const targetItem = items[index] as HTMLElement;

    if (targetItem) {
      setIsScrolling(true);
      targetItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        setActiveIndex(index);
        setIsScrolling(false);
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-12 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={logo}
                alt="Logo"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>

            <Link className="text-base font-medium tracking-[0.2em] text-white/90" href="/">
              SPHINX/25
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 h-screen">
        <div className="max-w-[1920px] mx-auto px-12 min-h-screen flex items-center">
          <div className="w-full grid grid-cols-12 gap-16 items-center py-12">
            {/* Left Section - Giant Age Number and Title */}
            <div className="col-span-3 relative min-h-[750] w-[45vw] flex flex-col justify-center">
              {/* Giant Age Number Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                  className="text-[40rem] font-black leading-none opacity-[0.08] font-mono text-white/20 transition-all duration-1000 ease-out"
                  style={{
                    lineHeight: 0.6,
                    transform: `translateY(${activeIndex * -2}px)`,
                  }}
                >
                  {activeMember.age}
                </span>
              </div>

              {/* Title and Description */}
              <div className="relative z-10 space-y-8">
                <div className="space-y-6">
                  <div className="w-24 h-[1px] bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent opacity-80" />
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black uppercase tracking-[0.15em] text-white leading-[0.9] transition-all duration-700">
                      {activeMember.designation}
                    </h1>
                    <p className="text-white/60 leading-relaxed max-w-[32ch] text-lg font-light tracking-wide transition-all duration-700">
                      {activeMember.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-sm text-white/40 pt-4">
                  <Link
                    className="hover:text-blue-400 cursor-pointer transition-all duration-300 hover:tracking-wider"
                    href="https://www.linkedin.com/in/sphinx-mnit-jaipur/"
                  >
                    LinkedIn
                  </Link>
                  <span className="text-white/20">/</span>
                  <Link
                    className="hover:text-cyan-400 cursor-pointer transition-all duration-300 hover:tracking-wider"
                    href="https://www.instagram.com/sphinx.mnit/"
                  >
                    Instagram
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Section - Team Photos */}
            <div className="col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <ul
                  ref={railRef}
                  className="h-[700px] overflow-y-auto scroll-smooth space-y-8 py-12"
                  style={{
                    scrollSnapType: "y mandatory",
                    scrollPadding: "35% 0",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style jsx>{`
                    ul::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {mockTeamData.map((member, index) => (
                    <li
                      key={member.id}
                      data-index={index}
                      className="flex justify-center cursor-pointer group"
                      style={{
                        scrollSnapAlign: "center",
                        scrollSnapStop: "always",
                      }}
                      onClick={() => scrollToIndex(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`
                          relative overflow-hidden transition-all duration-700 ease-out
                          ${
                            activeIndex === index
                              ? "w-80 h-96 rounded-3xl shadow-2xl shadow-blue-500/20"
                              : "w-64 h-80 rounded-2xl transform scale-90 opacity-40"
                          }
                          ${
                            hoveredIndex === index && activeIndex !== index
                              ? "scale-95 opacity-70"
                              : ""
                          }
                        `}
                      >
                        {/* Advanced border effect for active image */}
                        {activeIndex === index && (
                          <>
                            {/* Animated corner borders */}
                            <div className="absolute top-0 left-0 w-16 h-16 z-20">
                              <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-blue-400 rounded-tl-xl opacity-80"></div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 z-20">
                              <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-cyan-400 rounded-br-xl opacity-80"></div>
                            </div>

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-500/5 z-10"></div>

                            {/* Animated border glow */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 p-[1px] z-5">
                              <div className="w-full h-full bg-transparent rounded-3xl"></div>
                            </div>
                          </>
                        )}

                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className={`
                            w-full h-full object-cover object-center transition-all duration-700 ease-out
                            ${
                              activeIndex === index
                                ? "grayscale-0 brightness-110 contrast-110 saturate-110"
                                : "grayscale-[80%] brightness-50 contrast-75 saturate-50"
                            }
                            ${
                              hoveredIndex === index && activeIndex !== index
                                ? "grayscale-[40%] brightness-75"
                                : ""
                            }
                          `}
                          style={{
                            objectFit: "cover",
                            objectPosition: "center center",
                          }}
                        />

                        {/* Hover effect overlay */}
                        {hoveredIndex === index && activeIndex !== index && (
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Professional gradient fades */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
              </div>
            </div>

            {/* Right Section - Active Member Details */}
            <div className="col-span-3 flex flex-col justify-center min-h-[700px] space-y-8">
              <div className="space-y-8 transition-all duration-700">
                <div className="space-y-6">
                  <h2 className="text-5xl font-black uppercase tracking-[0.1em] text-white leading-tight transition-all duration-700">
                    {activeMember.name}
                  </h2>
                  <p className="text-blue-400 font-medium uppercase tracking-[0.15em] text-xl transition-all duration-700">
                    {activeMember.branch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Right Navigation */}
        <div className="fixed bottom-12 right-12 z-40">
          <div className="flex flex-col items-center gap-4 bg-black/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
            <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
              Team
            </div>
            <div className="flex flex-col gap-3">
              {mockTeamData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    w-14 h-14 rounded-2xl text-sm font-mono transition-all duration-500 ease-out flex items-center justify-center border relative overflow-hidden group
                    ${
                      activeIndex === index
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400/50 transform scale-110 shadow-xl shadow-blue-500/25"
                        : "bg-white/5 text-white/60 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105"
                    }
                  `}
                  aria-label={`Go to team member ${index + 1}`}
                >
                  {/* Hover effect background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-opacity duration-300 ${
                      hoveredIndex === index && activeIndex !== index
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  ></div>

                  <span className="relative z-10 font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamPage;
