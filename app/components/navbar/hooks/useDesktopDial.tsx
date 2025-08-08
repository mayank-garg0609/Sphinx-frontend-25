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

  // Get all items (no longer need to slice for visible items since we show all)
  const getAllItems = useCallback(() => {
    return navItems.map((item, index) => ({
      ...item,
      displayIndex: index,
    }));
  }, []);

  // Calculate button position based on index and current rotation
  const getButtonPosition = useCallback((displayIndex: number) => {
    // Base angle for this item (evenly distributed around the semicircle)
    const baseAngle = (displayIndex / (NAV_ITEMS_COUNT - 1)) * Math.PI;
    
    // Convert to x, y coordinates
    const x = Math.cos(baseAngle) * currentRadius;
    const y = -Math.sin(baseAngle) * currentRadius; // Negative for upward arc
    
    return { x, y };
  }, [currentRadius]);

  // Rotate to next position
  const rotateNext = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setRotation(prev => prev + ROTATION_STEP);
    
    // Reset rotation flag after animation completes
    setTimeout(() => {
      setIsRotating(false);
    }, 500); // Match CSS transition duration
  }, [isRotating]);

  // Rotate to previous position
  const rotatePrevious = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setRotation(prev => prev - ROTATION_STEP);
    
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