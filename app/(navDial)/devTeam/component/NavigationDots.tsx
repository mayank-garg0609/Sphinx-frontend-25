import React, { memo } from "react";
import { TeamMember, TeamMemberIndex } from "../types/TeamTypes";

interface NavigationDotsProps {
  teamData: TeamMember[];
  activeIndex: number;
  hoveredIndex: TeamMemberIndex | null;
  onScrollToIndex: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = memo(({ 
  teamData, 
  activeIndex, 
  hoveredIndex, 
  onScrollToIndex, 
  onMouseEnter, 
  onMouseLeave 
}) => (
  <div className="fixed bottom-12 right-12 z-40">
    <div className="flex flex-col items-center gap-4 bg-black/70 backdrop-blur-3xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/50">
      <div className="text-xs text-white/60 uppercase tracking-[0.2em] font-medium">
        Team
      </div>
      <nav className="flex flex-col gap-3" aria-label="Team member navigation">
        {teamData.map((member, index) => (
          <button
            key={member.id}
            onClick={() => onScrollToIndex(index)}
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={onMouseLeave}
            className={`
              w-14 h-14 rounded-2xl text-sm font-mono transition-all duration-500 ease-out 
              flex items-center justify-center border relative overflow-hidden group
              transform-gpu will-change-transform
              ${activeIndex === index
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400/50 scale-110 shadow-xl shadow-blue-500/25"
                : "bg-white/5 text-white/60 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105"
              }
            `}
            aria-label={`Go to ${member.name}`}
            aria-current={activeIndex === index ? 'true' : 'false'}
          >
            {/* Enhanced hover effect overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-all duration-300 rounded-2xl ${
                hoveredIndex === index && activeIndex !== index ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
            
            {/* Active state animated background */}
            {activeIndex === index && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-2xl animate-pulse" />
            )}
            
            <span className="relative z-10 font-bold transition-all duration-300">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </nav>
    </div>
  </div>
));

NavigationDots.displayName = 'NavigationDots';

export default NavigationDots;