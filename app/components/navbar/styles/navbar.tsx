export const navbarStyles = `
  /* Core dial container with GPU acceleration - Topmost overlay */
  .dial-container {
    position: fixed;
    z-index: 9999; /* Maximum z-index for topmost positioning */
    overflow: visible;
    contain: layout style paint;
    will-change: transform;
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    pointer-events: none; /* Allow clicks to pass through transparent areas */
  }

  /* Full-width expanded state - responsive overlay at topmost level */
  .dial-container.full-width-container {
    left: 0;
    top: 0;
    width: 100vw;
    height: clamp(100px, 12vh, 160px); /* Responsive height */
    z-index: 9999;
    background: linear-gradient(
      90deg,
      rgba(26, 26, 46, 0.1) 0%,
      rgba(26, 26, 46, 0.8) 15%,
      rgba(26, 26, 46, 0.95) 50%,
      rgba(26, 26, 46, 0.8) 85%,
      rgba(26, 26, 46, 0.1) 100%
    );
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    pointer-events: auto;
  }

  .dial-wrapper {
    position: relative;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    contain: layout style paint;
    transform: translateZ(0);
    will-change: width, height;
  }

  /* Enhanced cyberpunk track styles - responsive */
  .cyberpunk-track {
    background: linear-gradient(
      90deg,
      #1a1a2e 0%,
      #16213e 20%,
      #0f0f23 40%,
      #16213e 60%,
      #1a1a2e 80%,
      #16213e 100%
    );
    background-size: 300% 100%;
    animation: gradientShift 12s ease infinite;
    border-radius: clamp(40px, 8vw, 60px);
    height: clamp(60px, 8vh, 80px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: background-position;
  }

  .cyberpunk-inner-track {
    background: linear-gradient(
      90deg,
      #e8e8e8 0%,
      #f5f5f5 25%,
      #ffffff 50%,
      #f5f5f5 75%,
      #e8e8e8 100%
    );
    position: relative;
    overflow: hidden;
    border-radius: clamp(30px, 6vw, 50px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
  }

  .cyberpunk-inner-track::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 255, 255, 0.1) 25%,
      rgba(0, 255, 255, 0.2) 50%,
      rgba(0, 255, 255, 0.1) 75%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: translateZ(0);
  }

  .cyberpunk-inner-track:hover::before {
    opacity: 1;
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
    33% { background-position: 50% 50%; }
    66% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes controlPulse {
    0%, 100% { 
      box-shadow: 
        0 0 10px rgba(0, 255, 255, 0.4),
        inset 0 0 10px rgba(0, 255, 255, 0.2),
        0 0 20px rgba(0, 255, 255, 0.2);
      transform: translateZ(0) scale(1);
    }
    50% { 
      box-shadow: 
        0 0 20px rgba(0, 255, 255, 0.6),
        inset 0 0 15px rgba(0, 255, 255, 0.3),
        0 0 30px rgba(0, 255, 255, 0.3);
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

  @keyframes signupGlow {
    0%, 100% {
      box-shadow: 0 0 15px #28a745, 0 0 30px rgba(40, 167, 69, 0.4), 0 0 45px rgba(40, 167, 69, 0.2),
        inset 0 0 15px rgba(40, 167, 69, 0.2);
    }
    50% {
      box-shadow: 0 0 25px #28a745, 0 0 50px rgba(40, 167, 69, 0.6), 0 0 75px rgba(40, 167, 69, 0.4),
        inset 0 0 25px rgba(40, 167, 69, 0.3);
    }
  }

  @keyframes profileGlow {
    0%, 100% {
      box-shadow: 0 0 15px #4a90e2, 0 0 30px rgba(74, 144, 226, 0.4), 0 0 45px rgba(74, 144, 226, 0.2),
        inset 0 0 15px rgba(74, 144, 226, 0.2);
    }
    50% {
      box-shadow: 0 0 25px #4a90e2, 0 0 50px rgba(74, 144, 226, 0.6), 0 0 75px rgba(74, 144, 226, 0.4),
        inset 0 0 25px rgba(74, 144, 226, 0.3);
    }
  }

  /* Cyberpunk component styles */
  .cyberpunk-dial {
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .neon-glow-cyan {
    box-shadow: 
      0 0 10px #00ffff,
      0 0 20px rgba(0, 255, 255, 0.4),
      0 0 30px rgba(0, 255, 255, 0.2),
      inset 0 0 10px rgba(0, 255, 255, 0.2);
  }

  .neon-glow-magenta {
    box-shadow: 
      0 0 10px #ff00ff,
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 30px rgba(255, 0, 255, 0.2),
      inset 0 0 10px rgba(255, 0, 255, 0.2);
  }

  .neon-glow-amber {
    box-shadow: 
      0 0 10px #ffbf00,
      0 0 20px rgba(255, 191, 0, 0.4),
      0 0 30px rgba(255, 191, 0, 0.2),
      inset 0 0 10px rgba(255, 191, 0, 0.2);
  }

  .center-hub-cyberpunk {
    background: 
      radial-gradient(circle at 30% 30%, #2a2a4e 0%, #1a1a2e 50%, #0f0f23 100%);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform, box-shadow;
    box-shadow: 
      0 0 15px rgba(0, 255, 255, 0.8),
      inset 0 0 10px rgba(0, 255, 255, 0.2),
      0 0 25px rgba(0, 255, 255, 0.4);
  }

  .center-hub-cyberpunk::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 255, 0.4) 60deg, transparent 120deg);
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
      0 0 20px rgba(0, 255, 255, 0.8),
      inset 0 0 20px rgba(0, 255, 255, 0.2),
      0 0 40px rgba(0, 255, 255, 0.4);
  }

  .inner-profile-cyberpunk {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2563eb 100%);
    border: 2px solid #4a90e2;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    will-change: transform, box-shadow;
    animation: profileGlow 3s ease-in-out infinite;
  }

  .inner-profile-cyberpunk::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  .inner-profile-cyberpunk:hover::before {
    transform: translateX(100%);
  }

  .inner-profile-cyberpunk:hover {
    transform: translateZ(0) scale(1.15);
    box-shadow: 
      0 0 20px rgba(74, 144, 226, 0.8),
      inset 0 0 20px rgba(255, 255, 255, 0.2),
      0 0 40px rgba(74, 144, 226, 0.4);
    animation: none;
  }

  .inner-profile-cyberpunk.signup {
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 50%, #16a085 100%);
    border: 2px solid #28a745;
    animation: signupGlow 3s ease-in-out infinite;
  }

  .inner-profile-cyberpunk.signup:hover {
    box-shadow: 
      0 0 20px rgba(40, 167, 69, 0.8),
      inset 0 0 20px rgba(255, 255, 255, 0.2),
      0 0 40px rgba(40, 167, 69, 0.4);
    animation: none;
  }

  /* Navigation buttons container for horizontal layout */
  .nav-buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0; /* No gap needed as positions are calculated */
  }

  /* Performance optimizations */
  .dial-container * {
    box-sizing: border-box;
  }

  /* Hardware acceleration for all animated elements */
  .cyberpunk-track,
  .cyberpunk-inner-track,
  .center-hub-cyberpunk,
  .inner-profile-cyberpunk {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Hide on tablet and mobile - Desktop only */
  @media (max-width: 1023px) {
    .dial-container {
      display: none !important;
    }
  }

  /* Smooth animations with GPU acceleration */
  @media (prefers-reduced-motion: no-preference) {
    .center-hub-cyberpunk,
    .inner-profile-cyberpunk {
      transform: translateZ(0);
    }
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .dial-wrapper,
    .cyberpunk-track,
    .cyberpunk-inner-track,
    .center-hub-cyberpunk,
    .inner-profile-cyberpunk {
      transition: none !important;
      animation: none !important;
    }
    
    .center-hub-cyberpunk::before,
    .inner-profile-cyberpunk::before {
      animation: none !important;
    }
  }

  /* Focus styles for accessibility */
  .center-hub-cyberpunk:focus,
  .inner-profile-cyberpunk:focus {
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
      background: linear-gradient(90deg, #d8d8d8 0%, #e5e5e5 50%, #f0f0f0 100%);
    }
  }

  /* Responsive breakpoints for different desktop sizes */
  @media (min-width: 1024px) and (max-width: 1199px) {
    .dial-container.full-width-container {
      height: 100px;
    }
    
    .cyberpunk-track {
      height: 60px;
      border-radius: 40px;
    }
    
    .cyberpunk-inner-track {
      border-radius: 30px;
    }
  }

  @media (min-width: 1200px) and (max-width: 1439px) {
    .dial-container.full-width-container {
      height: 110px;
    }
    
    .cyberpunk-track {
      height: 70px;
      border-radius: 50px;
    }
    
    .cyberpunk-inner-track {
      border-radius: 40px;
    }
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    .dial-container.full-width-container {
      height: 120px;
    }
    
    .cyberpunk-track {
      height: 80px;
    }
  }

  /* Large screen optimizations */
  @media (min-width: 1920px) {
    .dial-container.full-width-container {
      height: 140px;
    }
    
    .cyberpunk-track {
      height: 100px;
    }
    
    .cyberpunk-inner-track {
      height: 80px;
    }
  }

  /* Ultra-wide screen support */
  @media (min-width: 2560px) {
    .dial-container.full-width-container {
      height: 160px;
    }
    
    .cyberpunk-track {
      height: 120px;
    }
    
    .cyberpunk-inner-track {
      height: 100px;
    }
  }



  /* Ensure all interactive elements in navbar are clickable */
  .dial-container button,
  .dial-container .cyberpunk-inner-track,
  .dial-container .nav-buttons-container {
    pointer-events: auto;
  }

  /* Ensure navbar elements stay above all page content */
  .center-hub-cyberpunk,
  .inner-profile-cyberpunk,
  .nav-buttons-container > * {
    z-index: 10000;
    position: relative;
  }

  /* Smooth fade-in animation when page loads */
  .dial-container {
    animation: navbarFadeIn 0.8s ease-out;
  }

  @keyframes navbarFadeIn {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;