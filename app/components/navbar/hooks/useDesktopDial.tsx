import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  DIAL_RADIUS_CLOSED,
  DIAL_RADIUS_OPEN,
  BUTTON_SIZE,
  VISIBLE_ITEMS,
} from '../utils/constants';
import { navItems, NAV_ITEMS_COUNT } from '../utils/navItems';

const ROTATION_STEP = 360 / NAV_ITEMS_COUNT;

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

  const currentRadius = useMemo(() => {
    return isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;
  }, [isExpanded]);

  const getAllItems = useCallback(() => {
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
    
    return visibleItems;
  }, [rotation, isRotating]);

  const getButtonPosition = useCallback((displayIndex: number) => {
    const startAngle = -80; 
    const endAngle = 80;    
    const angleStep = VISIBLE_ITEMS > 1 ? (endAngle - startAngle) / (VISIBLE_ITEMS - 1) : 0;
    const angle = startAngle + displayIndex * angleStep;
    const radian = (angle * Math.PI) / 180;
    
    const radiusAdjustment = Math.cos(radian * 0.5) * 10; // Subtle curve
    const adjustedRadius = currentRadius + radiusAdjustment;
    
    const x = Math.cos(radian) * adjustedRadius;
    const y = Math.sin(radian) * adjustedRadius;
    
    const zIndex = Math.round(100 + Math.cos(radian) * 50);
    
    return { 
      x, 
      y, 
      zIndex,
      angle: angle 
    };
  }, [currentRadius]);

  const performRotation = useCallback((direction: 'next' | 'previous') => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }
    
    setRotation(prev => {
      const newRotation = direction === 'next' 
        ? (prev + ROTATION_STEP) % 360
        : (prev - ROTATION_STEP + 360) % 360;
      return newRotation;
    });
    
    const animationDuration = 600; 
    rotationTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsRotating(false);
      });
    }, animationDuration);
  }, [isRotating]);

  const rotateNext = useMemo(
    () => createThrottledFunction(() => performRotation('next'), 100),
    [performRotation]
  );

  const rotatePrevious = useMemo(
    () => createThrottledFunction(() => performRotation('previous'), 100),
    [performRotation]
  );

  const setHoveredItemThrottled = useCallback((itemId: string | null) => {
    setHoveredItem(itemId);
  }, []);

  const resetRotation = useCallback(() => {
    if (!isExpanded && rotation !== 0) {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
      
      setRotation(0);
      setIsRotating(false);
      setHoveredItem(null);
    }
  }, [isExpanded, rotation]);

  useEffect(() => {
    resetRotation();
  }, [resetRotation]);

  useEffect(() => {
    return () => {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
    };
  }, []);

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