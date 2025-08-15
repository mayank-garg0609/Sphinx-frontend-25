// Enhanced constants for optimal performance and smooth interactions
export const SCROLL_TIMEOUT_DELAY = 100; // Reduced for more responsive feedback
export const ACTIVE_SCROLL_TIMEOUT = 800; // Increased to match scroll animation duration
export const OBSERVER_THRESHOLD = [0.1, 0.25, 0.5, 0.75, 0.9]; // More granular thresholds
export const ROOT_MARGIN = "-30% 0px -30% 0px"; // Better center detection

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 300,
  MEDIUM: 500,
  SLOW: 700,
  SMOOTH: 800,
} as const;

// Scroll behavior configuration
export const SCROLL_CONFIG = {
  behavior: "smooth" as ScrollBehavior,
  block: "center" as ScrollLogicalPosition,
  inline: "nearest" as ScrollLogicalPosition,
} as const;

// Performance optimization constants
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 100,
  THROTTLE_DELAY: 16, // ~60fps
  RAF_TIMEOUT: 1000/60, // 16.67ms
} as const;

// Intersection observer configuration
export const OBSERVER_CONFIG = {
  rootMargin: ROOT_MARGIN,
  threshold: OBSERVER_THRESHOLD,
} as const;