import React from "react";
import { AnimatedCounterProps } from "../types/aboutUs";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";

const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(({ 
  value, 
  suffix = "" 
}) => {
  const count = useAnimatedCounter(value);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";

export default AnimatedCounter;