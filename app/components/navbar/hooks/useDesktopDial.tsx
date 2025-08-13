import { useState, useRef, useCallback, useMemo } from 'react';
import {
  DIAL_RADIUS_CLOSED,
  DIAL_RADIUS_OPEN,
  BUTTON_SIZE,
} from '../utils/constants';
import { navItems, NAV_ITEMS_COUNT } from '../utils/navItems';

/**
 * Simplified hook for desktop dial without rotation functionality
 * Now handles full-width horizontal layout
 */
export const useDesktopDial = (isExpanded: boolean) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  const currentRadius = useMemo(() => {
    return isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;
  }, [isExpanded]);

  /**
   * Get all navigation items without rotation logic
   */
  const getAllItems = useCallback(() => {
    return navItems.map((item, index) => ({
      ...item,
      displayIndex: index,
      actualIndex: index,
      isAnimating: false, // No animation needed for static layout
    }));
  }, []);

  /**
   * Calculate button positions for horizontal full-width layout
   */
  const getButtonPosition = useCallback((displayIndex: number, containerWidth: number = 800) => {
    const totalItems = NAV_ITEMS_COUNT;
    
    // Calculate spacing for horizontal distribution
    const availableWidth = containerWidth - 40; // Leave some margin
    const startX = -availableWidth / 2;
    const spacing = totalItems > 1 ? availableWidth / (totalItems - 1) : 0;
    
    const x = startX + displayIndex * spacing;
    const y = 0; // Keep all buttons on the same horizontal line
    const zIndex = 100 + displayIndex;
    
    return { 
      x, 
      y, 
      zIndex,
      angle: 0 // No rotation needed
    };
  }, []);

  /**
   * Throttled hover state setter
   */
  const setHoveredItemThrottled = useCallback((itemId: string | null) => {
    setHoveredItem(itemId);
  }, []);

  // No rotation functions needed - remove rotateNext and rotatePrevious
  const rotateNext = useCallback(() => {
    // No-op - rotation removed
  }, []);

  const rotatePrevious = useCallback(() => {
    // No-op - rotation removed
  }, []);

  return {
    currentRadius,
    rotation: 0, // Always 0 - no rotation
    isRotating: false, // Never rotating
    hoveredItem,
    dialRef,
    getAllItems,
    getButtonPosition,
    rotateNext, // Keep for compatibility but does nothing
    rotatePrevious, // Keep for compatibility but does nothing
    setHoveredItem: setHoveredItemThrottled,
  };
};