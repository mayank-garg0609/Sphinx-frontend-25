import { useState, useEffect } from "react";
import { ANIMATION_CONFIG } from "../types/aboutUs";

export const useAnimatedCounter = (targetValue: number): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    timer = setTimeout(() => {
      const increment = targetValue / ANIMATION_CONFIG.COUNTER_INCREMENT_STEPS;
      
      interval = setInterval(() => {
        setCount((prevCount) => {
          const nextValue = prevCount + increment;
          if (nextValue >= targetValue) {
            clearInterval(interval);
            return targetValue;
          }
          return nextValue;
        });
      }, ANIMATION_CONFIG.COUNTER_INTERVAL);
    }, ANIMATION_CONFIG.COUNTER_DELAY);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetValue]);

  return Math.floor(count);
};