"use client";
import { useEffect, useRef, useCallback } from "react";

const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const CURSOR_X_PROP = "--cursor-x";
const CURSOR_Y_PROP = "--cursor-y";

export function useCursorTracker() {
  const rafRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  const injectCursorPosition = useCallback(
    throttle(({ clientX: x, clientY: y }: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        if (!isActiveRef.current) return;
        
        const documentElement = document.documentElement;
        const style = documentElement.style;
        
        style.setProperty(CURSOR_X_PROP, `${x}px`);
        style.setProperty(CURSOR_Y_PROP, `${y}px`);
      });
    }, 16),
    []
  );

  useEffect(() => {
    // OPTIMIZATION: Early return for server-side rendering
    if (typeof window === "undefined") return;
    
    // OPTIMIZATION: Only initialize on desktop to save resources
    if (window.innerWidth < 1024) return;

    // OPTIMIZATION: Set active flag for cleanup safety
    isActiveRef.current = true;

    document.body.addEventListener("pointermove", injectCursorPosition, { 
      passive: true 
    });

    return () => {
      // OPTIMIZATION: Set inactive flag first
      isActiveRef.current = false;
      
      // OPTIMIZATION: Clean up event listener
      document.body.removeEventListener("pointermove", injectCursorPosition);
      
      // OPTIMIZATION: Cancel any pending RAF calls
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [injectCursorPosition]);
}

// OPTIMIZATION: Default export component for better tree shaking
export default function CursorTracker() {
  useCursorTracker();
  return null; // Hook-only component
}