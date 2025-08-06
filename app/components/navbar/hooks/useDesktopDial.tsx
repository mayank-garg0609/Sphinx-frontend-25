import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { DIAL_RADIUS_CLOSED, DIAL_RADIUS_OPEN, BUTTON_SIZE, VISIBLE_ITEMS } from "../utils/constants";
import { ButtonPosition } from "../types/navbarTypes";
import { navItems } from "../utils/navItems";

export const useDesktopDial = (isExpanded: boolean) => {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const dialRef = useRef<HTMLDivElement>(null);

  const currentRadius = isExpanded ? DIAL_RADIUS_OPEN : DIAL_RADIUS_CLOSED;

  const getVisibleItems = useCallback(() => {
    const visibleItems = [];
    for (let i = 0; i < VISIBLE_ITEMS && i < navItems.length; i++) {
      const index = (currentOffset + i) % navItems.length;
      visibleItems.push({
        ...navItems[index],
        displayIndex: i,
      });
    }
    return visibleItems;
  }, [currentOffset]);

  const getButtonPosition = useCallback(
    (displayIndex: number): ButtonPosition => {
      const startAngle = -80;
      const endAngle = 80;
      const angleStep = (endAngle - startAngle) / (Math.min(VISIBLE_ITEMS, navItems.length) - 1);
      const angle = startAngle + displayIndex * angleStep;
      const radian = (angle * Math.PI) / 180;

      return {
        x: Math.cos(radian) * currentRadius,
        y: Math.sin(radian) * currentRadius,
        angle,
        zIndex: Math.round(100 + Math.cos(radian) * 50),
      };
    },
    [currentRadius]
  );

  const rotateNext = useCallback(() => {
    if (isRotating || navItems.length <= VISIBLE_ITEMS) return;
    setIsRotating(true);
    setCurrentOffset((prev) => (prev + 1) % navItems.length);
    setTimeout(() => setIsRotating(false), 400);
  }, [isRotating]);

  const rotatePrevious = useCallback(() => {
    if (isRotating || navItems.length <= VISIBLE_ITEMS) return;
    setIsRotating(true);
    setCurrentOffset((prev) => (prev - 1 + navItems.length) % navItems.length);
    setTimeout(() => setIsRotating(false), 400);
  }, [isRotating]);

  // Wheel event handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isExpanded || isRotating || navItems.length <= VISIBLE_ITEMS) return;
      e.preventDefault();
      if (e.deltaY > 0) rotateNext();
      else rotatePrevious();
    },
    [isExpanded, isRotating, rotateNext, rotatePrevious]
  );

  // Mouse tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleGlobalMouseMove);
    return () => document.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Wheel event listener
  useEffect(() => {
    const dialElement = dialRef.current;
    if (dialElement && isExpanded) {
      dialElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => dialElement.removeEventListener("wheel", handleWheel);
    }
  }, [isExpanded, handleWheel]);

  return {
    currentRadius,
    currentOffset,
    isRotating,
    hoveredItem,
    mousePos,
    dialRef,
    getVisibleItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem,
  };
};