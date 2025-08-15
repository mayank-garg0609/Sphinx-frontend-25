import React from "react";
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

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  index, 
  isActive, 
  isHovered, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}) => (
  <li
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
          ? "w-80 h-96 rounded-3xl shadow-2xl shadow-blue-500/20"
          : "w-64 h-80 rounded-2xl transform scale-90 opacity-40"
        }
        ${isHovered && !isActive ? "scale-95 opacity-70" : ""}
      `}
    >
      {/* Enhanced border effects for active image */}
      {isActive && (
        <>
          <div className="absolute top-0 left-0 w-16 h-16 z-20">
            <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-blue-400 rounded-tl-xl opacity-80" />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 z-20">
            <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-cyan-400 rounded-br-xl opacity-80" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-500/5 z-10" />
        </>
      )}

      {/* Use Next.js Image for optimization */}
      <Image
        src={member.imageUrl}
        alt={`${member.name}, ${member.branch}`}
        fill
        className={`
          object-cover object-center transition-all duration-700 ease-out
          ${isActive
            ? "grayscale-0 brightness-110 contrast-110 saturate-110"
            : "grayscale-[80%] brightness-50 contrast-75 saturate-50"
          }
          ${isHovered && !isActive ? "grayscale-[40%] brightness-75" : ""}
        `}
        sizes="(max-width: 768px) 256px, 320px"
        priority={index < 2} // Prioritize first 2 images
      />

      {isHovered && !isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
      )}
    </div>
  </li>
);

export default TeamMemberCard;