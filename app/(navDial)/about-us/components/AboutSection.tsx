import React, { useMemo, useRef, useEffect, useState } from "react";
import { Camera, Play } from "lucide-react";
import { AboutSectionProps } from "../types/aboutUs";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Check if script is already loaded
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        // If script exists but API not ready, wait for it
        const checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkAPI);
            initializePlayer();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      // Create a unique callback name for this instance
      const callbackName = `onYouTubeIframeAPIReady_${Math.random().toString(36).substr(2, 9)}`;
      window[callbackName] = initializePlayer;
      
      // If global callback doesn't exist, create it
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          // Call all instance callbacks
          Object.keys(window).forEach(key => {
            if (key.startsWith('onYouTubeIframeAPIReady_') && typeof window[key] === 'function') {
              window[key]();
            }
          });
        };
      }
    };

    const initializePlayer = () => {
      if (!iframeRef.current) return;

      try {
        // Create a container div for the YouTube player
        const playerId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
        
        // Replace iframe with div for YouTube API
        const container = iframeRef.current.parentElement;
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        playerDiv.style.width = '100%';
        playerDiv.style.height = '100%';
        playerDiv.className = 'rounded-2xl';
        
        container?.replaceChild(playerDiv, iframeRef.current);

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
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    const onPlayerReady = (event: any) => {
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
      const state = event.data;
      setIsPlaying(state === window.YT.PlayerState.PLAYING);
    };

    loadYouTubeAPI();

    // Cleanup function
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!playerRef.current || !playerReady) return;

    try {
      const state = playerRef.current.getPlayerState();
      
      if (state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      } else {
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
            <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/xd50KJh1AIo?enablejsapi=1&start=68"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded-2xl"
                style={{ minHeight: "315px", minWidth: "420px", background: "#000" }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center p-2 bg-black/60 rounded-xl">
                <p className="text-zinc-300 text-lg font-medium">Technical Festival</p>
              </div> 
            </div>
            <button
              type="button"
              onClick={handlePlayPause}
              disabled={!playerReady}
              className={`absolute -bottom-8 -right-8 w-28 h-28 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${!playerReady ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-black ml-1 font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <Play className="w-10 h-10 text-black ml-1 font-bold" />
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