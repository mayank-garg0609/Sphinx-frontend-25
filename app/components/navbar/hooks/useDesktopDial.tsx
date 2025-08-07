import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { DIAL_RADIUS_CLOSED, DIAL_RADIUS_OPEN, VISIBLE_ITEMS, TRANSITION_DURATION } from '../utils/constants';
import { ButtonPosition } from '../types/navbarTypes';
import { navItems, NAV_ITEMS_COUNT } from '../utils/navItems';
import { calculateButtonPosition, createPositionCache } from '../utils/calculations';

export const useDesktopDial = (isExpanded: boolean) => {
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  
  const currentRadius = useMemo(
    () => isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED,
    [isExpanded]
  );

  const positionCache = useMemo(
    () => createPositionCache(currentRadius, NAV_ITEMS_COUNT),
    [currentRadius]
  );

  const getVisibleItems = useCallback(() => {
    const visibleItems = [];
    const visibleCount = Math.min(VISIBLE_ITEMS, NAV_ITEMS_COUNT);
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentOffset + i) % NAV_ITEMS_COUNT;
      visibleItems.push({
        ...navItems[index],
        displayIndex: i,
      });
    }
    return visibleItems;
  }, [currentOffset]);

  const getButtonPosition = useCallback(
    (displayIndex: number): ButtonPosition => {
      const cached = positionCache.get(displayIndex);
      return cached || calculateButtonPosition(displayIndex, currentRadius, NAV_ITEMS_COUNT);
    },
    [positionCache, currentRadius]
  );

  const rotateNext = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setCurrentOffset((prev) => (prev + 1) % NAV_ITEMS_COUNT);
    
    const timeoutId = setTimeout(() => {
      setIsRotating(false);
    }, TRANSITION_DURATION);
    
    return () => clearTimeout(timeoutId);
  }, [isRotating]);

  const rotatePrevious = useCallback(() => {
    if (isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
    
    setIsRotating(true);
    setCurrentOffset((prev) => (prev - 1 + NAV_ITEMS_COUNT) % NAV_ITEMS_COUNT);
    
    const timeoutId = setTimeout(() => {
      setIsRotating(false);
    }, TRANSITION_DURATION);
    
    return () => clearTimeout(timeoutId);
  }, [isRotating]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isExpanded || isRotating || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      requestAnimationFrame(() => {
        if (e.deltaY > 0) {
          rotateNext();
        } else {
          rotatePrevious();
        }
      });
    },
    [isExpanded, isRotating, rotateNext, rotatePrevious]
  );

  useEffect(() => {
    const dialElement = dialRef.current;
    if (dialElement && isExpanded) {
      dialElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => dialElement.removeEventListener('wheel', handleWheel);
    }
  }, [isExpanded, handleWheel]);

  return useMemo(() => ({
    currentRadius,
    currentOffset,
    isRotating,
    hoveredItem,
    dialRef,
    getVisibleItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem,
  }), [
    currentRadius,
    currentOffset,
    isRotating,
    hoveredItem,
    getVisibleItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
  ]);
};