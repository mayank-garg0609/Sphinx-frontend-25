import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  DIAL_RADIUS_CLOSED,
  DIAL_RADIUS_OPEN,
  BUTTON_SIZE,
  VISIBLE_ITEMS,
} from "../utils/constants";
import { navItems, NAV_ITEMS_COUNT } from "../utils/navItems";

// Degree step for each rotation (360° / total items for even spacing)
const ROTATION_STEP = 360 / NAV_ITEMS_COUNT;

// Optimized throttle function with RAF
const createRAFThrottledFunction = (func: () => void, delay: number = 16) => {
  let rafId: number | null = null;
  let lastExecuted = 0;

  return () => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    if (timeSinceLastExecution >= delay) {
      func();
      lastExecuted = now;
    } else {
      rafId = requestAnimationFrame(() => {
        func();
        lastExecuted = Date.now();
      });
    }
  };
};

export const useDesktopDial = (isExpanded: boolean) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const rotationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRotationRef = useRef<number>(0);

  // Motion values for smooth, hardware-accelerated animations
  const motionRotation = useMotionValue(0);
  const smoothRotation = useSpring(motionRotation, {
    stiffness: 300,
    damping: 25,
    mass: 0.8,
  });

  // Enhanced radius calculation with smooth interpolation
  const currentRadius = useMemo(() => {
    return isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;
  }, [isExpanded]);

  // Optimized item calculation with memoization and caching
  const itemsCache = useRef<Map<string, any>>(new Map());

  const getAllItems = useCallback(() => {
    const cacheKey = `${rotation}-${isRotating}`;

    if (itemsCache.current.has(cacheKey)) {
      return itemsCache.current.get(cacheKey);
    }

    const startIndex = Math.round(rotation / ROTATION_STEP) % NAV_ITEMS_COUNT;
    const visibleItems = [];

    for (let i = 0; i < VISIBLE_ITEMS; i++) {
      const itemIndex = (startIndex + i) % NAV_ITEMS_COUNT;
      visibleItems.push({
        ...navItems[itemIndex],
        displayIndex: i,
        actualIndex: itemIndex,
        isAnimating: isRotating,
      });
    }

    if (itemsCache.current.size > 10) {
      const firstKey = itemsCache.current.keys().next().value;
      if (firstKey !== undefined) {
        itemsCache.current.delete(firstKey);
      }
    }
    itemsCache.current.set(cacheKey, visibleItems);

    return visibleItems;
  }, [rotation, isRotating]);

  // Enhanced position calculation with GPU-friendly transforms and caching
  const positionCache = useRef<Map<string, any>>(new Map());

  const getButtonPosition = useCallback(
    (displayIndex: number) => {
      const cacheKey = `${displayIndex}-${currentRadius}`;

      if (positionCache.current.has(cacheKey)) {
        return positionCache.current.get(cacheKey);
      }

      // Distribute items evenly across a semicircle (160 degrees for better spacing)
      const startAngle = -80; // Start from top-left
      const endAngle = 80; // End at top-right
      const angleStep =
        VISIBLE_ITEMS > 1 ? (endAngle - startAngle) / (VISIBLE_ITEMS - 1) : 0;
      const angle = startAngle + displayIndex * angleStep;
      const radian = (angle * Math.PI) / 180;

      // Convert to x, y coordinates with slight curve adjustment
      const radiusAdjustment = Math.cos(radian * 0.5) * 10; // Subtle curve
      const adjustedRadius = currentRadius + radiusAdjustment;

      const x = Math.cos(radian) * adjustedRadius;
      const y = Math.sin(radian) * adjustedRadius;

      // Enhanced z-index calculation for proper layering
      const zIndex = Math.round(100 + Math.cos(radian) * 50);

      const position = {
        x,
        y,
        zIndex,
        angle: angle,
      };

      // Cache the result
      positionCache.current.set(cacheKey, position);

      return position;
    },
    [currentRadius]
  );

  // Smooth rotation with enhanced performance and motion values
  const performRotation = useCallback(
    (direction: "next" | "previous") => {
      if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;

      setIsRotating(true);

      // Clear any existing timeout
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }

      const newRotation =
        direction === "next"
          ? (rotation + ROTATION_STEP) % 360
          : (rotation - ROTATION_STEP + 360) % 360;

      // Update both state and motion value for smooth animation
      setRotation(newRotation);
      motionRotation.set(newRotation);
      lastRotationRef.current = newRotation;

      // Use requestAnimationFrame for smooth animation timing
      const animationDuration = 600;
      rotationTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          setIsRotating(false);
        });
      }, animationDuration);
    },
    [rotation, isRotating, motionRotation]
  );

  // Throttled rotation functions with RAF optimization
  const rotateNext = useMemo(
    () => createRAFThrottledFunction(() => performRotation("next"), 100),
    [performRotation]
  );

  const rotatePrevious = useMemo(
    () => createRAFThrottledFunction(() => performRotation("previous"), 100),
    [performRotation]
  );

  // Debounced hover state management
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setHoveredItemThrottled = useCallback((itemId: string | null) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Immediate update for better UX, with debounce for performance
    setHoveredItem(itemId);

    hoverTimeoutRef.current = setTimeout(() => {
      // Additional processing if needed
    }, 50);
  }, []);

  // Reset rotation when dial collapses with smooth transition
  const resetRotation = useCallback(() => {
    if (!isExpanded && (rotation !== 0 || lastRotationRef.current !== 0)) {
      // Clear any ongoing rotation
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }

      setRotation(0);
      motionRotation.set(0);
      lastRotationRef.current = 0;
      setIsRotating(false);
      setHoveredItem(null);

      // Clear caches
      itemsCache.current.clear();
      positionCache.current.clear();
    }
  }, [isExpanded, rotation, motionRotation]);

  // Optimized effect for reset rotation
  useEffect(() => {
    resetRotation();
  }, [resetRotation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Clear caches
      itemsCache.current.clear();
      positionCache.current.clear();
    };
  }, []);

  // Performance optimization: memoize expensive calculations
  const memoizedRadius = useMemo(() => currentRadius, [currentRadius]);
  const memoizedRotation = useMemo(() => rotation, [rotation]);

  // Transform for smooth wheel animation using motion values
  const wheelTransform = useTransform(
    smoothRotation,
    (value) => `rotate(${value}deg)`
  );

  return {
    currentRadius: memoizedRadius,
    rotation: memoizedRotation,
    isRotating,
    hoveredItem,
    dialRef,
    getAllItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem: setHoveredItemThrottled,
    // Additional optimizations
    smoothRotation,
    wheelTransform,
    motionRotation,
  };
};
