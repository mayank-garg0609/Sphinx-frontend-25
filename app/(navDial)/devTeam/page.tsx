"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { TeamMemberIndex } from "./types/TeamTypes";
import { TeamData } from "./types/teamData";
import TeamHeader from "./component/TeamHeader";
import TeamMemberCard from "./component/TeamMemberCard";
import NavigationDots from "./component/NavigationDots";
import MobileTeamView from "./component/MobileTeamView";
import { ScrollStyles } from "./styles/scrollbar";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { ReactLenis } from "@studio-freight/react-lenis";

const SCROLL_DEBOUNCE_DELAY = 100;
const INTERSECTION_THRESHOLD = [0.1, 0.25, 0.5, 0.75, 0.9];

const ROOT_MARGINS = {
  mobile: "-20% 0px -20% 0px",
  tablet: "-25% 0px -25% 0px",
  desktop: "-30% 0px -30% 0px",
  large: "-35% 0px -35% 0px",
};

const SCROLL_BEHAVIOR_CONFIG = {
  behavior: "smooth" as const,
  block: "center" as const,
};

const TeamPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<TeamMemberIndex>(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<TeamMemberIndex | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1440px)");
  const isExtraLarge = useMediaQuery("(min-width: 1920px)");

  const railRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lenisRef = useRef<any>(null);

  const activeMember = useMemo(() => TeamData[activeIndex], [activeIndex]);

  const getRootMargin = useCallback(() => {
    if (isMobile) return ROOT_MARGINS.mobile;
    if (isTablet) return ROOT_MARGINS.tablet;
    if (isExtraLarge) return ROOT_MARGINS.large;
    return ROOT_MARGINS.desktop;
  }, [isMobile, isTablet, isExtraLarge]);

  const clearScrollTimeout = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, []);

  const setupIntersectionObserver = useCallback(() => {
    if (!railRef.current || isMobile) return; // Skip for mobile

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserScrolling) return;

        let maxVisibleElement = { index: 0, ratio: 0 };

        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
            10
          );

          if (entry.intersectionRatio > maxVisibleElement.ratio) {
            maxVisibleElement = { index, ratio: entry.intersectionRatio };
          }
        });

        if (maxVisibleElement.ratio > 0.5) {
          setActiveIndex(maxVisibleElement.index);
        }
      },
      {
        root: railRef.current,
        rootMargin: getRootMargin(),
        threshold: INTERSECTION_THRESHOLD,
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) {
        observerRef.current?.observe(item);
      }
    });
  }, [isUserScrolling, getRootMargin, isMobile]);

  const handleScrollDebounced = useCallback(() => {
    setIsUserScrolling(true);
    clearScrollTimeout();

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, SCROLL_DEBOUNCE_DELAY);
  }, [clearScrollTimeout]);

  useEffect(() => {
    if (!isInitialized || isMobile) return;

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
  }, [
    setupIntersectionObserver,
    handleScrollDebounced,
    clearScrollTimeout,
    isInitialized,
    isMobile,
  ]);

  useEffect(() => {
    const initializeComponent = () => {
      setIsInitialized(true);
    };

    requestAnimationFrame(initializeComponent);
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!railRef.current || index < 0 || index >= TeamData.length) return;

      const targetItem = itemRefs.current[index];
      if (!targetItem) return;

      setIsUserScrolling(true);
      setActiveIndex(index);

      targetItem.scrollIntoView(SCROLL_BEHAVIOR_CONFIG);

      clearScrollTimeout();
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 800);
    },
    [clearScrollTimeout]
  );

  const handleMouseEnter = useCallback(
    (index: TeamMemberIndex) => {
      if (!isMobile) {
        setHoveredIndex(index);
      }
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setHoveredIndex(null);
    }
  }, [isMobile]);

  const setItemRef = useCallback((index: number) => {
    return (el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileTeamView
        teamData={TeamData}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      />
    );
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
        <ScrollStyles />

        <div
          className="fixed inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: `${isExtraLarge ? "50px 50px" : "40px 40px"}`,
          }}
          aria-hidden="true"
        />

        <TeamHeader />

        <main className="pt-20 md:pt-24 h-screen">
          <div
            className={`
          max-w-full mx-auto min-h-screen flex items-center
          ${isExtraLarge ? "px-16" : isLargeDesktop ? "px-12" : "px-8"}
        `}
          >
            <div
              className={`
            w-full items-center py-8 md:py-12
            ${
              isTablet
                ? "grid grid-cols-1 gap-8"
                : "grid grid-cols-12 gap-12 lg:gap-18"
            }
          `}
            >
              <div
                className={`
              relative flex flex-col justify-center
              ${
                isTablet
                  ? "order-2 min-h-[500px]"
                  : "col-span-12 lg:col-span-3 min-h-[700px] xl:min-h-[900px]"
              }
            `}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span
                    className={`
                    font-black leading-none opacity-[0.08] font-mono text-white/20 
                    transition-all duration-1000 ease-out
                    ${
                      isExtraLarge
                        ? "text-[45rem]"
                        : isLargeDesktop
                        ? "text-[35rem]"
                        : isTablet
                        ? "text-[20rem]"
                        : "text-[25rem]"
                    }
                  `}
                    style={{
                      lineHeight: 0.6,
                      transform: `translateY(${activeIndex * -2}px)`,
                    }}
                    aria-hidden="true"
                  >
                    {activeMember.age}
                  </span>
                </div>

                <div
                  className={`relative z-10 ${
                    isTablet ? "text-center" : "space-y-6 lg:space-y-8"
                  }`}
                >
                  <div className={`${isTablet ? "space-y-4" : "space-y-6"}`}>
                    <div
                      className={`
                    bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent opacity-80
                    ${
                      isTablet ? "w-16 h-[1px] mx-auto" : "w-20 lg:w-24 h-[1px]"
                    }
                  `}
                    />
                    <div className={`${isTablet ? "space-y-2" : "space-y-4"}`}>
                      <h1
                        className={`
                      font-black uppercase tracking-[0.15em] text-white leading-[0.9] 
                      transition-all duration-700
                      ${
                        isExtraLarge
                          ? "text-7xl"
                          : isLargeDesktop
                          ? "text-6xl"
                          : isTablet
                          ? "text-4xl"
                          : "text-5xl"
                      }
                    `}
                      >
                        {activeMember.designation}
                      </h1>
                      <p
                        className={`
                      text-white/70 leading-relaxed font-light tracking-wide 
                      transition-all duration-700
                      ${
                        isExtraLarge
                          ? "text-xl max-w-[40ch]"
                          : isLargeDesktop
                          ? "text-lg max-w-[32ch]"
                          : isTablet
                          ? "text-base max-w-[50ch] mx-auto"
                          : "text-lg max-w-[32ch]"
                      }
                    `}
                      >
                        {activeMember.description}
                      </p>
                    </div>
                  </div>

                  <nav
                    className={`
                  flex items-center gap-6 lg:gap-8 text-sm text-white/60 pt-4
                  ${isTablet ? "justify-center" : ""}
                `}
                    aria-label="Social links"
                  >
                    <Link
                      className="hover:text-blue-400 cursor-pointer transition-all duration-300 hover:tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400"
                      href={activeMember.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </Link>
                    <span className="text-white/20" aria-hidden="true">
                      /
                    </span>
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

              <div
                className={`
              flex justify-center
              ${isTablet ? "order-1" : "col-span-12 lg:col-span-6"}
            `}
              >
                <div
                  className={`
                relative w-full
                ${
                  isExtraLarge
                    ? "max-w-2xl"
                    : isLargeDesktop
                    ? "max-w-xl"
                    : isTablet
                    ? "max-w-lg"
                    : "max-w-lg"
                }
              `}
                >
                  <ul
                    ref={railRef}
                    className={`
                    overflow-y-auto scroll-smooth space-y-6 lg:space-y-8 scrollbar-hide
                    ${
                      isExtraLarge
                        ? "h-[800px] py-16"
                        : isLargeDesktop
                        ? "h-[700px] py-12"
                        : isTablet
                        ? "h-[600px] py-10"
                        : "h-[700px] py-12"
                    }
                  `}
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

                  <div className="absolute top-0 left-0 right-0 h-20 lg:h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-20 lg:h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
                </div>
              </div>

              {!isTablet && (
                <div className="col-span-12 lg:col-span-3 flex flex-col justify-center min-h-[600px] xl:min-h-[700px] space-y-6 lg:space-y-8">
                  <div
                    className="space-y-6 lg:space-y-8 transition-all duration-700"
                    id={`team-member-${activeIndex}`}
                  >
                    <div className="space-y-4 lg:space-y-6">
                      <h2
                        className={`
                      font-black uppercase tracking-[0.1em] text-white leading-tight 
                      transition-all duration-700
                      ${
                        isExtraLarge
                          ? "text-6xl"
                          : isLargeDesktop
                          ? "text-5xl"
                          : "text-4xl"
                      }
                    `}
                      >
                        {activeMember.name}
                      </h2>
                      <p
                        className={`
                      text-blue-400 font-medium uppercase tracking-[0.15em] 
                      transition-all duration-700
                      ${
                        isExtraLarge
                          ? "text-2xl"
                          : isLargeDesktop
                          ? "text-xl"
                          : "text-lg"
                      }
                    `}
                      >
                        {activeMember.branch}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isTablet && (
            <NavigationDots
              teamData={TeamData}
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
              onScrollToIndex={scrollToIndex}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </main>
      </div>
    </ReactLenis>
  );
};

export default TeamPage;
