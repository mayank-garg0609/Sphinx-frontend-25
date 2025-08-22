import React, { useMemo, useRef, useEffect, useState } from "react";
import { Camera, Play } from "lucide-react";
import { AboutSectionProps } from "../types/aboutUs";

// Extend window type for YouTube API callback
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

const AboutSection: React.FC<AboutSectionProps> = React.memo(({ isLoaded }) => {
  const leftColumnClasses = useMemo(
    () =>
      `transform transition-all duration-1500 delay-300 ease-out ${
        isLoaded ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
      }`,
    [isLoaded]
  );

  const rightColumnClasses = useMemo(
    () =>
      `transform transition-all duration-1500 delay-700 ease-out ${
        isLoaded ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
      }`,
    [isLoaded]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [playerId, setPlayerId] = useState<string>('');
  const playerRef = useRef<any>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    setPlayerId(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    if (!isClient || !playerId) return;
    
    let isComponentMounted = true;

    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (existingScript) {
        // If script exists but API not ready, wait for it
        const checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkAPI);
            if (isComponentMounted) {
              initializePlayer();
            }
          }
        }, 100);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkAPI), 10000);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      
      // Set up the global callback before adding the script
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          if (isComponentMounted) {
            initializePlayer();
          }
        };
      }
      
      document.head.appendChild(script);
    };

    const initializePlayer = () => {
      if (!isComponentMounted) return;

      try {
        // Initialize YouTube player directly on the div with playerId
        playerRef.current = new window.YT.Player(playerId, {
          width: '100%',
          height: '100%',
          videoId: 'xd50KJh1AIo',
          playerVars: {
            enablejsapi: 1,
            start: 68,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    const onPlayerReady = (event: any) => {
      if (!isComponentMounted) return;
      
      console.log('YouTube player ready');
      setPlayerReady(true);
      
      // Get initial state
      try {
        const state = event.target.getPlayerState();
        setIsPlaying(state === window.YT.PlayerState.PLAYING);
      } catch (error) {
        console.error('Error getting initial player state:', error);
      }
    };

    const onPlayerStateChange = (event: any) => {
      if (!isComponentMounted) return;
      
      const state = event.data;
      console.log('Player state changed:', state);
      setIsPlaying(state === window.YT.PlayerState.PLAYING);
    };

    const onPlayerError = (event: any) => {
      console.error('YouTube player error:', event.data);
    };

    loadYouTubeAPI();

    // Cleanup function
    return () => {
      isComponentMounted = false;
      
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (error) {
          console.error('Error destroying player:', error);
        }
        playerRef.current = null;
      }
    };
  }, [playerId]);

  const handlePlayPause = () => {
    if (!playerRef.current || !playerReady) {
      console.log('Player not ready or not available');
      return;
    }

    try {
      const state = playerRef.current.getPlayerState();
      console.log('Current player state:', state);
      
      if (state === window.YT.PlayerState.PLAYING) {
        console.log('Pausing video');
        playerRef.current.pauseVideo();
      } else {
        console.log('Playing video');
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error controlling YouTube player:', error);
    }
  };

  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className={leftColumnClasses}>
          <div className="relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
              {isClient && playerId ? (
                <div
                  id={playerId}
                  className="w-full h-full rounded-2xl bg-black flex items-center justify-center"
                  style={{ minHeight: "315px" }}
                >
                  {!playerReady && (
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p>Loading YouTube Player...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center" style={{ minHeight: "315px" }}>
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Initializing Player...</p>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handlePlayPause}
              disabled={!playerReady}
              className={`absolute -bottom-8 -right-8 w-28 h-28 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                !playerReady 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'opacity-100 cursor-pointer hover:rotate-6'
              }`}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-10 h-10 text-black transition-transform duration-200" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <Play className="w-10 h-10 text-black ml-1 transition-transform duration-200" fill="currentColor" />
              )}
            </button>
          </div>
        </div>
        <div className={rightColumnClasses}>
          <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-6 font-bold">
            MNIT Jaipur
          </h3>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Celebrating Culture & Creativity <br />
            <span className="text-yellow-400">The Best</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light">
            SPHINX, MNIT Jaipur's crown jewel, is Rajasthan's largest
            Techno-Management fest, attracting 60,000+ innovators and
            problem-solvers from IITs, NITs, and across India. By day, it drives
            breakthroughs with high-intensity Hackathons, Robowars, and
            cutting-edge challenges; by night, it captivates with icons like
            Mithoon and Jubin Nautiyal — a grand fusion of technology,
            creativity, and unforgettable experiences.
          </p>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;