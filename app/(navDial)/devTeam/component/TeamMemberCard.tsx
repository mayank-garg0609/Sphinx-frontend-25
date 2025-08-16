import React, { forwardRef } from "react";
import Image from "next/image";
import { TeamMember } from "../types/TeamTypes";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const TeamMemberCard = forwardRef<HTMLLIElement, TeamMemberCardProps>(
  (
    { member, index, isActive, isHovered, onClick, onMouseEnter, onMouseLeave },
    ref
  ) => {
    const isTablet = useMediaQuery(
      "(min-width: 769px) and (max-width: 1024px)"
    );
    const isLargeDesktop = useMediaQuery("(min-width: 1440px)");
    const isExtraLarge = useMediaQuery("(min-width: 1920px)");

    const getCardDimensions = () => {
      if (isExtraLarge) {
        return {
          active: { width: "w-96", height: "h-[32rem]", scale: "scale-110" },
          inactive: { width: "w-80", height: "h-96", scale: "scale-95" },
        };
      }
      if (isLargeDesktop) {
        return {
          active: { width: "w-80", height: "h-96", scale: "scale-110" },
          inactive: { width: "w-64", height: "h-80", scale: "scale-90" },
        };
      }
      if (isTablet) {
        return {
          active: { width: "w-72", height: "h-80", scale: "scale-105" },
          inactive: { width: "w-56", height: "h-64", scale: "scale-90" },
        };
      }
      // Default desktop
      return {
        active: { width: "w-80", height: "h-96", scale: "scale-110" },
        inactive: { width: "w-64", height: "h-80", scale: "scale-90" },
      };
    };

    const dimensions = getCardDimensions();
    const currentDimensions = isActive
      ? dimensions.active
      : dimensions.inactive;

    return (
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
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(index);
          }
        }}
      >
        <div
          className={`
          relative overflow-hidden transition-all duration-700 ease-out
          ${currentDimensions.width} ${currentDimensions.height}
          ${
            isActive
              ? `${
                  isTablet ? "rounded-2xl" : "rounded-3xl"
                } shadow-2xl shadow-blue-500/20 ${currentDimensions.scale}`
              : `${isTablet ? "rounded-xl" : "rounded-2xl"} transform ${
                  currentDimensions.scale
                } opacity-50`
          }
          ${isHovered && !isActive ? "scale-100 opacity-75" : ""}
        `}
        >
          {isActive && (
            <>
              {/* Corner accents - responsive sizing with fixed border classes */}
              <div
                className={`absolute top-0 left-0 z-30 ${
                  isTablet ? "w-16 h-16" : "w-20 h-20"
                }`}
              >
                <div
                  className={`
                absolute border-l-2 border-t-2 border-blue-400 opacity-90
                ${
                  isTablet
                    ? "top-3 left-3 w-8 h-8 rounded-tl-xl"
                    : "top-4 left-4 w-12 h-12 rounded-tl-2xl"
                }
              `}
                />
                <div
                  className={`
                absolute border-l-2 border-t-2 border-cyan-300 opacity-70
                ${
                  isTablet
                    ? "top-4 left-4 w-6 h-6 rounded-tl-lg"
                    : "top-6 left-6 w-8 h-8 rounded-tl-xl"
                }
              `}
                />
              </div>

              <div
                className={`absolute bottom-0 right-0 z-30 ${
                  isTablet ? "w-16 h-16" : "w-20 h-20"
                }`}
              >
                <div
                  className={`
                absolute border-r-2 border-b-2 border-cyan-400 opacity-90
                ${
                  isTablet
                    ? "bottom-3 right-3 w-8 h-8 rounded-br-xl"
                    : "bottom-4 right-4 w-12 h-12 rounded-br-2xl"
                }
              `}
                />
                <div
                  className={`
                absolute border-r-2 border-b-2 border-blue-300 opacity-70
                ${
                  isTablet
                    ? "bottom-4 right-4 w-6 h-6 rounded-br-lg"
                    : "bottom-6 right-6 w-8 h-8 rounded-br-xl"
                }
              `}
                />
              </div>

              <div
                className={`absolute top-0 right-0 z-30 ${
                  isTablet ? "w-12 h-12" : "w-16 h-16"
                }`}
              >
                <div
                  className={`
                absolute border-r-2 border-t-2 border-purple-400 opacity-60
                ${
                  isTablet
                    ? "top-3 right-3 w-6 h-6 rounded-tr-lg"
                    : "top-4 right-4 w-8 h-8 rounded-tr-xl"
                }
              `}
                />
              </div>

              <div
                className={`absolute bottom-0 left-0 z-30 ${
                  isTablet ? "w-12 h-12" : "w-16 h-16"
                }`}
              >
                <div
                  className={`
                absolute border-l-2 border-b-2 border-purple-400 opacity-60
                ${
                  isTablet
                    ? "bottom-3 left-3 w-6 h-6 rounded-bl-lg"
                    : "bottom-4 left-4 w-8 h-8 rounded-bl-xl"
                }
              `}
                />
              </div>

              <div
                className={`
              absolute inset-0 opacity-60 z-20
              ${isTablet ? "rounded-2xl" : "rounded-3xl"}
            `}
              >
                <div
                  className={`
                absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 animate-pulse
                ${isTablet ? "rounded-2xl" : "rounded-3xl"}
              `}
                />
              </div>

              <div
                className={`
              absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 z-10
              ${isTablet ? "rounded-2xl" : "rounded-3xl"}
            `}
              />
            </>
          )}

          <Image
            src={member.imageUrl}
            alt={`${member.name}, ${member.branch}`}
            fill
            className={`
            object-cover object-center transition-all duration-700 ease-out rounded-inherit
            ${
              isActive
                ? "grayscale-0 brightness-110 contrast-110 saturate-125 drop-shadow-xl"
                : "grayscale-[90%] brightness-40 contrast-75 saturate-30"
            }
            ${
              isHovered && !isActive
                ? "grayscale-[50%] brightness-70 saturate-75"
                : ""
            }
          `}
            sizes={`
            ${
              isExtraLarge
                ? "(max-width: 768px) 256px, 384px"
                : isLargeDesktop
                ? "(max-width: 768px) 256px, 320px"
                : isTablet
                ? "(max-width: 768px) 224px, 288px"
                : "(max-width: 768px) 256px, 320px"
            }
          `}
            priority={index === 0} // Fixed: Only prioritize the first image
          />

          {isHovered && !isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/15 via-transparent to-cyan-500/10 transition-opacity duration-300" />
          )}

          <div
            className={`absolute inset-0 bg-gray-800 transition-opacity duration-700 ${
              isActive || isHovered ? "opacity-0" : "opacity-20"
            }`}
          />
        </div>
      </li>
    );
  }
);

TeamMemberCard.displayName = "TeamMemberCard";

export default TeamMemberCard;
