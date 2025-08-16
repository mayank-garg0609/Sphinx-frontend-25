import React, { memo } from "react";
import { TeamMember, TeamMemberIndex } from "../types/TeamTypes";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface NavigationDotsProps {
  teamData: TeamMember[];
  activeIndex: number;
  hoveredIndex: TeamMemberIndex | null;
  onScrollToIndex: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = memo(
  ({
    teamData,
    activeIndex,
    hoveredIndex,
    onScrollToIndex,
    onMouseEnter,
    onMouseLeave,
  }) => {
    const isLargeDesktop = useMediaQuery("(min-width: 1440px)");
    const isExtraLarge = useMediaQuery("(min-width: 1920px)");

    const getResponsiveStyles = () => {
      if (isExtraLarge) {
        return {
          position: "fixed bottom-16 right-16 z-40",
          container:
            "bg-black/70 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50",
          button: "w-16 h-16 rounded-2xl text-base",
          gap: "gap-4",
        };
      }
      if (isLargeDesktop) {
        return {
          position: "fixed bottom-12 right-12 z-40",
          container:
            "bg-black/70 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/50",
          button: "w-14 h-14 rounded-2xl text-sm",
          gap: "gap-3",
        };
      }
      return {
        position: "fixed bottom-8 right-8 z-40",
        container:
          "bg-black/70 backdrop-blur-3xl rounded-2xl p-4 border border-white/10 shadow-2xl shadow-black/50",
        button: "w-12 h-12 rounded-xl text-xs",
        gap: "gap-2",
      };
    };

    const styles = getResponsiveStyles();

    return (
      <div className={styles.position}>
        <div
          className={`flex flex-col items-center ${styles.gap} ${styles.container}`}
        >
          <div
            className={`
          text-xs text-white/60 uppercase tracking-[0.2em] font-medium
          ${isExtraLarge ? "text-sm" : ""}
        `}
          >
            Team
          </div>
          <nav
            className={`flex flex-col ${styles.gap}`}
            aria-label="Team member navigation"
          >
            {teamData.map((member, index) => (
              <button
                key={member.id}
                onClick={() => onScrollToIndex(index)}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
                className={`
                ${styles.button} font-mono transition-all duration-500 ease-out 
                flex items-center justify-center border relative overflow-hidden group
                transform-gpu will-change-transform
                ${
                  activeIndex === index
                    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400/50 scale-110 shadow-xl shadow-blue-500/25"
                    : "bg-white/5 text-white/60 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105"
                }
              `}
                aria-label={`Go to ${member.name}`}
                aria-current={activeIndex === index ? "step" : undefined} // Fixed: Use 'step' instead of 'true'/'false'
              >
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 
                  transition-all duration-300 
                  ${
                    isExtraLarge || isLargeDesktop
                      ? "rounded-2xl"
                      : "rounded-xl"
                  }
                  ${
                    hoveredIndex === index && activeIndex !== index
                      ? "opacity-100 scale-105"
                      : "opacity-0 scale-100"
                  }
                `}
                />

                {activeIndex === index && (
                  <div
                    className={`
                  absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 animate-pulse
                  ${
                    isExtraLarge || isLargeDesktop
                      ? "rounded-2xl"
                      : "rounded-xl"
                  }
                `}
                  />
                )}

                <span className="relative z-10 font-bold transition-all duration-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }
);

NavigationDots.displayName = "NavigationDots";

export default NavigationDots;
