import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SkillBarProps, ANIMATION_CONFIG } from "../types/aboutUs";
import { useDelayedVisibility } from "../hooks/useDelayedVisibility";

const SkillBar: React.FC<SkillBarProps> = React.memo(({
  skill,
  percentage,
  delay = 0,
}) => {
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = useDelayedVisibility(delay);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, ANIMATION_CONFIG.SKILL_BAR_DELAY);

    return () => clearTimeout(timer);
  }, [percentage, isVisible]);

  const containerClasses = useMemo(() =>
    `mb-8 transform transition-all duration-1000 ease-out cursor-pointer ${
      isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
    }`,
    [isVisible]
  );

  const skillNameClasses = useMemo(() =>
    `font-semibold transition-colors duration-300 ${
      isHovered ? "text-yellow-400" : "text-white"
    }`,
    [isHovered]
  );

  const progressBarClasses = useMemo(() =>
    `h-full rounded-full transition-all ease-out relative overflow-hidden ${
      isHovered
        ? "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300"
        : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400"
    }`,
    [isHovered]
  );

  const progressBarStyle = useMemo(() => ({
    width: `${width}%`,
    transitionDuration: `${ANIMATION_CONFIG.SKILL_BAR_DURATION}ms`,
  }), [width]);

  return (
    <div
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={skillNameClasses}>{skill}</span>
        <span className="text-yellow-400 font-bold text-lg">{percentage}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden shadow-inner">
        <div className={progressBarClasses} style={progressBarStyle}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
});

SkillBar.displayName = "SkillBar";

export default SkillBar;