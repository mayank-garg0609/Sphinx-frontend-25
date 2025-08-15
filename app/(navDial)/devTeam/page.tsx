"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { TeamMemberIndex } from "./types/TeamTypes";
import { TeamData } from "./types/teamData";
import { 
  SCROLL_TIMEOUT_DELAY, 
  ACTIVE_SCROLL_TIMEOUT, 
  OBSERVER_THRESHOLD, 
  ROOT_MARGIN 
} from "./types/constant";
import TeamHeader from "./component/TeamHeader";
import TeamMemberCard from "./component/TeamMemberCard";
import NavigationDots from "./component/NavigationDots";

const TeamPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<TeamMemberIndex>(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<TeamMemberIndex | null>(null);
  
  const railRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeMember = TeamData[activeIndex];

  // Cleanup timeouts function
  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  // Setup intersection observer with proper cleanup
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
            const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
            maxIndex = index;
          }
        });

        if (maxRatio > 0.75) {
          setActiveIndex(maxIndex);
        }
      },
      {
        root: railRef.current,
        rootMargin: ROOT_MARGIN,
        threshold: OBSERVER_THRESHOLD,
      }
    );

    const items = railRef.current.querySelectorAll("li");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      observerRef.current?.disconnect();
      clearScrollTimeout();
    };
  }, [isScrolling, clearScrollTimeout]);

  // Handle scroll events with proper cleanup
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearScrollTimeout();

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, SCROLL_TIMEOUT_DELAY);
    };

    const rail = railRef.current;
    if (rail) {
      rail.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        rail.removeEventListener("scroll", handleScroll);
        clearScrollTimeout();
      };
    }
  }, [clearScrollTimeout]);

  const scrollToIndex = useCallback((index: number) => {
    if (!railRef.current || index < 0 || index >= TeamData.length) return;

    const items = railRef.current.children;
    const targetItem = items[index] as HTMLElement;

    if (targetItem) {
      setIsScrolling(true);
      targetItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      clearScrollTimeout();
      scrollTimeoutRef.current = setTimeout(() => {
        setActiveIndex(index);
        setIsScrolling(false);
      }, ACTIVE_SCROLL_TIMEOUT);
    }
  }, [clearScrollTimeout]);

  const handleMouseEnter = useCallback((index: TeamMemberIndex) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
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
        aria-hidden="true"
      />

      {/* Header */}
      <TeamHeader />

      {/* Main Content with improved accessibility */}
      <main className="pt-24 h-screen">
        <div className="max-w-[1920px] mx-auto px-12 min-h-screen flex items-center">
          <div className="w-full grid grid-cols-12 gap-16 items-center py-12">
            {/* Left Section - Fixed CSS class */}
            <div className="col-span-3 relative min-h-[750px] w-[45vw] flex flex-col justify-center">
              {/* Giant Age Number Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                  className="text-[40rem] font-black leading-none opacity-[0.08] font-mono text-white/20 transition-all duration-1000 ease-out"
                  style={{
                    lineHeight: 0.6,
                    transform: `translateY(${activeIndex * -2}px)`,
                  }}
                  aria-hidden="true"
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
                    <p className="text-white/70 leading-relaxed max-w-[32ch] text-lg font-light tracking-wide transition-all duration-700">
                      {activeMember.description}
                    </p>
                  </div>
                </div>

                <nav className="flex items-center gap-8 text-sm text-white/60 pt-4" aria-label="Social links">
                  <Link
                    className="hover:text-blue-400 cursor-pointer transition-all duration-300 hover:tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400"
                    href={activeMember.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </Link>
                  <span className="text-white/20" aria-hidden="true">/</span>
                  <Link
                    className="hover:text-cyan-400 cursor-pointer transition-all duration-300 hover:tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    href={activeMember.Instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </Link>
                </nav>
              </div>
            </div>

            {/* Center Section - Team Photos */}
            <div className="col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <ul
                  ref={railRef}
                  className="h-[700px] overflow-y-auto scroll-smooth space-y-8 py-12 scrollbar-hide"
                  style={{
                    scrollSnapType: "y mandatory",
                    scrollPadding: "35% 0",
                  }}
                  role="listbox"
                  aria-label="Team members"
                  aria-activedescendant={`team-member-${activeIndex}`}
                >
                  {TeamData.map((member, index) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      isActive={activeIndex === index}
                      isHovered={hoveredIndex === index}
                      onClick={scrollToIndex}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </ul>

                {/* Gradient fades */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* Right Section - Active Member Details */}
            <div className="col-span-3 flex flex-col justify-center min-h-[700px] space-y-8">
              <div className="space-y-8 transition-all duration-700" id={`team-member-${activeIndex}`}>
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

        {/* Navigation Component */}
        <NavigationDots
          teamData={TeamData}
          activeIndex={activeIndex}
          hoveredIndex={hoveredIndex}
          onScrollToIndex={scrollToIndex}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </main>
    </div>
  );
};

export default TeamPage;