import React, { forwardRef } from "react";
import Image from "next/image";
import { TeamMember } from "../types/TeamTypes";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const TeamMemberCard = forwardRef<HTMLLIElement, TeamMemberCardProps>(({ 
  member, 
  index, 
  isActive, 
  isHovered, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}, ref) => (
  <li
    ref={ref}
    data-index={index}
    className="flex justify-center cursor-pointer group"
    style={{
      scrollSnapAlign: "center",
      scrollSnapStop: "always",
    }}
    onClick={() => onClick(index)}
    onMouseEnter={() => onMouseEnter(index)}
    onMouseLeave={onMouseLeave}
    role="button"
    tabIndex={0}
    aria-label={`Select ${member.name}, ${member.branch}`}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(index);
      }
    }}
  >
    <div
      className={`
        relative overflow-hidden transition-all duration-700 ease-out
        ${isActive
          ? "w-80 h-96 rounded-3xl shadow-2xl shadow-blue-500/20 scale-110"
          : "w-64 h-80 rounded-2xl transform scale-90 opacity-50"
        }
        ${isHovered && !isActive ? "scale-100 opacity-75" : ""}
      `}
    >
      {/* Enhanced stylish border frame for active image */}
      {isActive && (
        <>
          {/* Top-left corner accent */}
          <div className="absolute top-0 left-0 w-20 h-20 z-30">
            <div className="absolute top-4 left-4 w-12 h-12 border-l-3 border-t-3 border-blue-400 rounded-tl-2xl opacity-90" />
            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-cyan-300 rounded-tl-xl opacity-70" />
          </div>
          
          {/* Bottom-right corner accent */}
          <div className="absolute bottom-0 right-0 w-20 h-20 z-30">
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-3 border-b-3 border-cyan-400 rounded-br-2xl opacity-90" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-blue-300 rounded-br-xl opacity-70" />
          </div>

          {/* Top-right corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 z-30">
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-400 rounded-tr-xl opacity-60" />
          </div>

          {/* Bottom-left corner accent */}
          <div className="absolute bottom-0 left-0 w-16 h-16 z-30">
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400 rounded-bl-xl opacity-60" />
          </div>

          {/* Animated border glow effect */}
          <div className="absolute inset-0 rounded-3xl opacity-60 z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl animate-pulse" />
          </div>

          {/* Subtle inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 z-10 rounded-3xl" />
        </>
      )}

      {/* Main image with enhanced filters and transitions */}
      <Image
        src={member.imageUrl}
        alt={`${member.name}, ${member.branch}`}
        fill
        className={`
          object-cover object-center transition-all duration-700 ease-out rounded-inherit
          ${isActive
            ? "grayscale-0 brightness-110 contrast-110 saturate-125 drop-shadow-xl"
            : "grayscale-[90%] brightness-40 contrast-75 saturate-30"
          }
          ${isHovered && !isActive ? "grayscale-[50%] brightness-70 saturate-75" : ""}
        `}
        sizes="(max-width: 768px) 256px, 320px"
        priority={index < 3} // Prioritize first 3 images for better performance
      />

      {/* Hover overlay for non-active items */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/15 via-transparent to-cyan-500/10 transition-opacity duration-300" />
      )}

      {/* Loading placeholder effect */}
      <div className={`absolute inset-0 bg-gray-800 transition-opacity duration-700 ${isActive || isHovered ? 'opacity-0' : 'opacity-20'}`} />
    </div>
  </li>
));

TeamMemberCard.displayName = 'TeamMemberCard';

export default TeamMemberCard;