import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  DIAL_RADIUS_CLOSED,
  DIAL_RADIUS_OPEN,
  BUTTON_SIZE,
  VISIBLE_ITEMS,
} from '../utils/constants';
import { navItems, NAV_ITEMS_COUNT } from '../utils/navItems';

// Degree step for each rotation (360° / total items for even spacing)
const ROTATION_STEP = 360 / NAV_ITEMS_COUNT;

// Throttle function for smooth rotation control
const createThrottledFunction = (func: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecuted = 0;

  return () => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    if (timeSinceLastExecution >= delay) {
      func();
      lastExecuted = now;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func();
        lastExecuted = Date.now();
        timeoutId = null;
      }, delay - timeSinceLastExecution);
    }
  };
};

export const useDesktopDial = (isExpanded: boolean) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const rotationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced radius calculation with smooth interpolation
  const currentRadius = useMemo(() => {
    return isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;
  }, [isExpanded]);

  // Optimized item calculation with memoization
  const getAllItems = useCallback(() => {
    const startIndex = Math.round(rotation / ROTATION_STEP) % NAV_ITEMS_COUNT;
    const visibleItems = [];
    
    for (let i = 0; i < VISIBLE_ITEMS; i++) {
      const itemIndex = (startIndex + i) % NAV_ITEMS_COUNT;
      visibleItems.push({
        ...navItems[itemIndex],
        displayIndex: i,
        actualIndex: itemIndex,
        isAnimating: isRotating, // Pass rotation state for animation optimization
      });
    }
    
    return visibleItems;
  }, [rotation, isRotating]);

  // Enhanced position calculation with GPU-friendly transforms
  const getButtonPosition = useCallback((displayIndex: number) => {
    // Distribute items evenly across a semicircle (160 degrees for better spacing)
    const startAngle = -80; // Start from top-left
    const endAngle = 80;    // End at top-right
    const angleStep = VISIBLE_ITEMS > 1 ? (endAngle - startAngle) / (VISIBLE_ITEMS - 1) : 0;
    const angle = startAngle + displayIndex * angleStep;
    const radian = (angle * Math.PI) / 180;
    
    // Convert to x, y coordinates with slight curve adjustment
    const radiusAdjustment = Math.cos(radian * 0.5) * 10; // Subtle curve
    const adjustedRadius = currentRadius + radiusAdjustment;
    
    const x = Math.cos(radian) * adjustedRadius;
    const y = Math.sin(radian) * adjustedRadius;
    
    // Enhanced z-index calculation for proper layering
    const zIndex = Math.round(100 + Math.cos(radian) * 50);
    
    return { 
      x, 
      y, 
      zIndex,
      angle: angle // Store angle for potential future use
    };
  }, [currentRadius]);

  // Smooth rotation with easing and performance optimization - Fixed directions
  const performRotation = useCallback((direction: 'next' | 'previous') => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    
    // Clear any existing timeout
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }
    
    setRotation(prev => {
      // Fixed rotation direction: next = forward in array, previous = backward in array
      const newRotation = direction === 'next' 
        ? (prev + ROTATION_STEP) % 360
        : (prev - ROTATION_STEP + 360) % 360;
      return newRotation;
    });
    
    // Use requestAnimationFrame for smooth animation timing
    const animationDuration = 600; // Match CSS transition duration
    rotationTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsRotating(false);
      });
    }, animationDuration);
  }, [isRotating]);

  // Throttled rotation functions for better performance
  const rotateNext = useMemo(
    () => createThrottledFunction(() => performRotation('next'), 100),
    [performRotation]
  );

  const rotatePrevious = useMemo(
    () => createThrottledFunction(() => performRotation('previous'), 100),
    [performRotation]
  );

  // Enhanced hover state management with debouncing
  const setHoveredItemThrottled = useCallback((itemId: string | null) => {
    // Simple state update - React batches these automatically
    setHoveredItem(itemId);
  }, []);

  // Reset rotation when dial collapses with smooth transition
  const resetRotation = useCallback(() => {
    if (!isExpanded && rotation !== 0) {
      // Clear any ongoing rotation
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
      
      setRotation(0);
      setIsRotating(false);
      setHoveredItem(null);
    }
  }, [isExpanded, rotation]);

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
    };
  }, []);

  // Performance optimization: preload next/previous items
  const preloadedItems = useMemo(() => {
    if (!isExpanded || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return [];
    
    const nextStartIndex = Math.round((rotation + ROTATION_STEP) / ROTATION_STEP) % NAV_ITEMS_COUNT;
    const prevStartIndex = Math.round((rotation - ROTATION_STEP + 360) / ROTATION_STEP) % NAV_ITEMS_COUNT;
    
    return [
      navItems[nextStartIndex],
      navItems[prevStartIndex],
    ];
  }, [rotation, isExpanded]);

  return {
    currentRadius,
    rotation,
    isRotating,
    hoveredItem,
    dialRef,
    getAllItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem: setHoveredItemThrottled,
    preloadedItems, // For future optimization
  };
};