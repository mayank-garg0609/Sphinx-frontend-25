"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { TeamMemberIndex } from "./types/TeamTypes";
import { TeamData } from "./types/teamData";
import TeamHeader from "./component/TeamHeader";
import TeamMemberCard from "./component/TeamMemberCard";
import NavigationDots from "./component/NavigationDots";
import { ScrollStyles } from "./styles/scrollbar";

// Enhanced constants for smoother interactions
const SCROLL_DEBOUNCE_DELAY = 100;
const INTERSECTION_THRESHOLD = [0.1, 0.25, 0.5, 0.75, 0.9];
const ROOT_MARGIN = "-30% 0px -30% 0px";
const SCROLL_BEHAVIOR_CONFIG = {
  behavior: "smooth" as ScrollBehavior,
  block: "center" as ScrollLogicalPosition,
};

const TeamPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<TeamMemberIndex>(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<TeamMemberIndex | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const railRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeMember = useMemo(() => TeamData[activeIndex], [activeIndex]);

  // Clear timeout utility
  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  // Enhanced intersection observer for better active element detection
  const setupIntersectionObserver = useCallback(() => {
    if (!railRef.current) return;

    // Cleanup existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Don't update active index during user scrolling to prevent conflicts
        if (isUserScrolling) return;

        // Find the element with the highest intersection ratio (most visible)
        let maxVisibleElement = { index: 0, ratio: 0 };
        
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
          
          if (entry.intersectionRatio > maxVisibleElement.ratio) {
            maxVisibleElement = { index, ratio: entry.intersectionRatio };
          }
        });

        // Only update if the element is sufficiently visible (> 50%)
        if (maxVisibleElement.ratio > 0.5) {
          setActiveIndex(maxVisibleElement.index);
        }
      },
      {
        root: railRef.current,
        rootMargin: ROOT_MARGIN,
        threshold: INTERSECTION_THRESHOLD,
      }
    );

    // Observe all items
    itemRefs.current.forEach((item) => {
      if (item) {
        observerRef.current?.observe(item);
      }
    });
  }, [isUserScrolling]);

  // Handle scroll events with improved debouncing
  const handleScrollDebounced = useCallback(() => {
    setIsUserScrolling(true);
    clearScrollTimeout();

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, SCROLL_DEBOUNCE_DELAY);
  }, [clearScrollTimeout]);

  // Initialize intersection observer and scroll handler
  useEffect(() => {
    if (!isInitialized) return;

    setupIntersectionObserver();

    const rail = railRef.current;
    if (rail) {
      rail.addEventListener("scroll", handleScrollDebounced, { passive: true });
    }

    return () => {
      if (rail) {
        rail.removeEventListener("scroll", handleScrollDebounced);
      }
      observerRef.current?.disconnect();
      clearScrollTimeout();
    };
  }, [setupIntersectionObserver, handleScrollDebounced, clearScrollTimeout, isInitialized]);

  // Initialize after component mount to prevent SSR issues
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const initializeComponent = () => {
      setIsInitialized(true);
    };

    requestAnimationFrame(initializeComponent);
  }, []);

  // Smooth scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!railRef.current || index < 0 || index >= TeamData.length) return;

    const targetItem = itemRefs.current[index];
    if (!targetItem) return;

    // Prevent observer updates during programmatic scroll
    setIsUserScrolling(true);
    
    // Update active index immediately for UI responsiveness
    setActiveIndex(index);

    // Perform smooth scroll
    targetItem.scrollIntoView(SCROLL_BEHAVIOR_CONFIG);

    // Reset scrolling state after animation completes
    clearScrollTimeout();
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 800); // Slightly longer to account for scroll animation
  }, [clearScrollTimeout]);

  const handleMouseEnter = useCallback((index: TeamMemberIndex) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Ref callback to store item references
  const setItemRef = useCallback((index: number) => {
    return (el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
    };
  }, []);

  if (!isInitialized) {
    // Return a loading state to prevent hydration mismatches
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Subtle Grid Background */}
      <ScrollStyles/>
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

      {/* Main Content */}
      <main className="pt-24 h-screen">
        <div className="max-w-[1920px] mx-auto px-12 min-h-screen flex items-center">
          <div className="w-full grid grid-cols-12 gap-16 items-center py-12">
            {/* Left Section */}
            <div className="col-span-3 relative min-h-[800px] flex flex-col justify-center">
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
                      ref={setItemRef(index)}
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