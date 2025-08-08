import React, { useState, useCallback, useMemo } from "react";
import { StatItemProps } from "../types/aboutUs";
import { useDelayedVisibility } from "../hooks/useDelayedVisibility";
import AnimatedCounter from "./AnimatedCounter";

const StatItem: React.FC<StatItemProps> = React.memo(({ 
  value, 
  label, 
  delay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = useDelayedVisibility(delay);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const { numericValue, suffix } = useMemo(() => {
    const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
    const suffixValue = value.replace(/\d/g, "");
    return { numericValue: numeric, suffix: suffixValue };
  }, [value]);

  const containerClasses = useMemo(() => 
    `text-center transform transition-all duration-1000 ease-out cursor-pointer ${
      isVisible
        ? "translate-y-0 opacity-100 scale-100"
        : "translate-y-12 opacity-0 scale-95"
    } ${isHovered ? "scale-105" : ""}`,
    [isVisible, isHovered]
  );

  const valueClasses = useMemo(() =>
    `text-4xl md:text-5xl font-bold mb-3 transition-all duration-500 ${
      isHovered ? "text-yellow-400" : "text-white"
    }`,
    [isHovered]
  );

  const underlineClasses = useMemo(() =>
    `h-0.5 mx-auto mt-3 transition-all duration-500 ${
      isHovered ? "bg-yellow-400 w-16" : "bg-zinc-700 w-12"
    }`,
    [isHovered]
  );

  return (
    <div
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={valueClasses}>
        <AnimatedCounter value={numericValue} suffix={suffix} />
      </div>
      <div className="text-zinc-400 text-sm uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className={underlineClasses}></div>
    </div>
  );
});

StatItem.displayName = "StatItem";

export default StatItem;