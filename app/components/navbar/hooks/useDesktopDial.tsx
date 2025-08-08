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

export const useDesktopDial = (isExpanded: boolean) => {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  // Calculate radius based on expansion state
  const currentRadius = useMemo(() => {
    return isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;
  }, [isExpanded]);

  // Get visible items based on current rotation
  const getAllItems = useCallback(() => {
    const startIndex = Math.round(rotation / ROTATION_STEP) % NAV_ITEMS_COUNT;
    const visibleItems = [];
    
    for (let i = 0; i < VISIBLE_ITEMS; i++) {
      const itemIndex = (startIndex + i) % NAV_ITEMS_COUNT;
      visibleItems.push({
        ...navItems[itemIndex],
        displayIndex: i,
        actualIndex: itemIndex,
      });
    }
    
    return visibleItems;
  }, [rotation]);

  // Calculate button position based on display index (semicircle distribution)
  const getButtonPosition = useCallback((displayIndex: number) => {
    // Distribute items evenly across a semicircle (180 degrees)
    const startAngle = -90; // Start from top (-90 degrees)
    const endAngle = 90;    // End at bottom (90 degrees)
    const angleStep = VISIBLE_ITEMS > 1 ? (endAngle - startAngle) / (VISIBLE_ITEMS - 1) : 0;
    const angle = startAngle + displayIndex * angleStep;
    const radian = (angle * Math.PI) / 180;
    
    // Convert to x, y coordinates
    const x = Math.cos(radian) * currentRadius;
    const y = Math.sin(radian) * currentRadius;
    
    // Z-index for layering (items closer to center should be on top)
    const zIndex = Math.round(100 + Math.cos(radian) * 50);
    
    return { 
      x, 
      y, 
      zIndex,
      angle: angle // Store angle for counter-rotation
    };
  }, [currentRadius]);

  // Rotate to next position (show next set of items)
  const rotateNext = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setRotation(prev => (prev + ROTATION_STEP) % 360);
    
    // Reset rotation flag after animation completes
    setTimeout(() => {
      setIsRotating(false);
    }, 500); // Match CSS transition duration
  }, [isRotating]);

  // Rotate to previous position (show previous set of items)
  const rotatePrevious = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setRotation(prev => (prev - ROTATION_STEP + 360) % 360);
    
    // Reset rotation flag after animation completes
    setTimeout(() => {
      setIsRotating(false);
    }, 500); // Match CSS transition duration
  }, [isRotating]);

  // Reset rotation when dial collapses
  const resetRotation = useCallback(() => {
    if (!isExpanded) {
      setRotation(0);
      setIsRotating(false);
    }
  }, [isExpanded]);

  // Call reset when expanded state changes
  useEffect(() => {
    resetRotation();
  }, [resetRotation]);

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
    setHoveredItem,
  };
};