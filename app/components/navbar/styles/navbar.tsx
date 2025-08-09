export const navbarStyles = `
  /* Core dial container with GPU acceleration */
  .dial-container {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%) translateZ(0);
    z-index: 50;
    overflow: hidden;
    contain: layout style paint;
    will-change: transform;
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .dial-wrapper {
    position: relative;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    contain: layout style paint;
    transform: translateZ(0);
    will-change: width, height;
  }

  /* Enhanced cyberpunk track styles */
  .semicircle-track {
    position: absolute;
    border-radius: 50%;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    contain: layout style paint;
    transform: translateZ(0);
    will-change: opacity, transform;
  }

  .inner-track {
    position: absolute;
    border-radius: 50%;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    contain: layout style paint;
    transform: translateZ(0);
    will-change: opacity, transform;
  }

  /* Optimized animations with GPU acceleration */
  @keyframes neonPulse {
    0%, 100% { 
      filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor);
      transform: translateZ(0) scale(1);
    }
    50% { 
      filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 24px currentColor);
      transform: translateZ(0) scale(1.02);
    }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes controlPulse {
    0%, 100% { 
      box-shadow: 
        0 0 10px #00ffff40,
        inset 0 0 10px #00ffff20,
        0 0 20px #00ffff20;
      transform: translateZ(0) scale(1);
    }
    50% { 
      box-shadow: 
        0 0 20px #00ffff60,
        inset 0 0 15px #00ffff30,
        0 0 30px #00ffff30;
      transform: translateZ(0) scale(1.05);
    }
  }

  @keyframes ripple {
    0% {
      transform: translateZ(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateZ(0) scale(1.6);
      opacity: 0;
    }
  }

  @keyframes spin {
    from { transform: translateZ(0) rotate(0deg); }
    to { transform: translateZ(0) rotate(360deg); }
  }

  /* Cyberpunk component styles */
  .cyberpunk-dial {
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .neon-glow-cyan {
    box-shadow: 
      0 0 10px #00ffff,
      0 0 20px #00ffff40,
      0 0 30px #00ffff20,
      inset 0 0 10px #00ffff20;
  }

  .neon-glow-magenta {
    box-shadow: 
      0 0 10px #ff00ff,
      0 0 20px #ff00ff40,
      0 0 30px #ff00ff20,
      inset 0 0 10px #ff00ff20;
  }

  .neon-glow-amber {
    box-shadow: 
      0 0 10px #ffbf00,
      0 0 20px #ffbf0040,
      0 0 30px #ffbf0020,
      inset 0 0 10px #ffbf0020;
  }

  .control-button {
    position: absolute;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    border: 1px solid #00ffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: controlPulse 3s ease-in-out infinite;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transform: translateZ(0);
    will-change: transform, box-shadow, background;
  }

  .control-button:hover {
    transform: translateZ(0) scale(1.15);
    background: linear-gradient(135deg, #2a2a4e 0%, #26335e 50%, #1f1f43 100%);
    box-shadow: 
      0 0 20px #00ffff80,
      inset 0 0 20px #00ffff30,
      0 0 40px #00ffff40;
    animation: none;
  }

  .control-button:active {
    transform: translateZ(0) scale(1.05);
    animation: none;
  }

  .control-button:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid #00ffff;
    border-radius: inherit;
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  }

  .cyberpunk-track {
    background: 
      conic-gradient(from 0deg, 
        #1a1a2e 0deg, 
        #16213e 60deg, 
        #0f0f23 120deg, 
        #16213e 180deg, 
        #1a1a2e 240deg, 
        #0f0f23 300deg, 
        #1a1a2e 360deg
      );
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite;
    will-change: background-position;
  }

  .cyberpunk-inner-track {
    background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #ffffff 100%);
    position: relative;
    overflow: hidden;
  }

  .cyberpunk-inner-track::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, #00ffff10 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: translateZ(0);
  }

  .cyberpunk-inner-track:hover::before {
    opacity: 1;
  }

  .center-hub-cyberpunk {
    background: 
      radial-gradient(circle at 30% 30%, #2a2a4e 0%, #1a1a2e 50%, #0f0f23 100%);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform, box-shadow;
  }

  .center-hub-cyberpunk::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0deg, #00ffff40 60deg, transparent 120deg);
    animation: spin 4s linear infinite;
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: translateZ(0);
  }

  .center-hub-cyberpunk:hover::before {
    opacity: 1;
  }

  .center-hub-cyberpunk:hover {
    transform: translateZ(0) scale(1.1);
    box-shadow: 
      0 0 20px #00ffff80,
      inset 0 0 20px #00ffff20,
      0 0 40px #00ffff40;
  }

  .inner-profile-cyberpunk {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2563eb 100%);
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform, box-shadow;
  }

  .inner-profile-cyberpunk::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, #ffffff20 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  .inner-profile-cyberpunk:hover::before {
    transform: translateX(100%);
  }

  .inner-profile-cyberpunk:hover {
    transform: translateZ(0) scale(1.15);
    box-shadow: 
      0 0 20px #4a90e280,
      inset 0 0 20px #ffffff20,
      0 0 40px #4a90e240;
  }

  .inner-profile-cyberpunk.signup {
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 50%, #16a085 100%);
  }

  .inner-profile-cyberpunk.signup:hover {
    box-shadow: 
      0 0 20px #28a74580,
      inset 0 0 20px #ffffff20,
      0 0 40px #28a74540;
  }

  /* Performance optimizations */
  .dial-container * {
    box-sizing: border-box;
  }

  /* Hardware acceleration for all animated elements */
  .semicircle-track,
  .inner-track,
  .center-hub-cyberpunk,
  .inner-profile-cyberpunk,
  .control-button {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Smooth animations with GPU acceleration */
  @media (prefers-reduced-motion: no-preference) {
    .center-hub-cyberpunk,
    .inner-profile-cyberpunk,
    .control-button {
      transform: translateZ(0);
    }
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .dial-wrapper,
    .semicircle-track,
    .inner-track,
    .center-hub-cyberpunk,
    .inner-profile-cyberpunk,
    .control-button {
      transition: none !important;
      animation: none !important;
    }
    
    .cyberpunk-track {
      animation: none !important;
    }
    
    .center-hub-cyberpunk::before,
    .inner-profile-cyberpunk::before {
      animation: none !important;
    }
  }

  /* Focus styles for accessibility */
  .center-hub-cyberpunk:focus,
  .inner-profile-cyberpunk:focus,
  .control-button:focus {
    outline: 2px solid #00ffff;
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .neon-glow-cyan,
    .neon-glow-magenta,
    .neon-glow-amber {
      box-shadow: none;
      border-width: 3px;
    }
  }

  /* Dark mode optimizations */
  @media (prefers-color-scheme: dark) {
    .cyberpunk-inner-track {
      background: linear-gradient(135deg, #d8d8d8 0%, #e5e5e5 50%, #f0f0f0 100%);
    }
  }
`;