import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "../types/TeamTypes";
import TeamHeader from "./TeamHeader";

interface MobileTeamViewProps {
  teamData: TeamMember[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const MobileTeamView: React.FC<MobileTeamViewProps> = ({
  teamData,
  activeIndex,
  onIndexChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeMember = teamData[activeIndex];

  // Handle card tap/swipe navigation
  const handleCardChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && activeIndex < teamData.length - 1) {
      onIndexChange(activeIndex + 1);
    } else if (direction === 'prev' && activeIndex > 0) {
      onIndexChange(activeIndex - 1);
    }
  };

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleCardChange('next');
    }
    if (isRightSwipe) {
      handleCardChange('prev');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Mobile Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)`,
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <TeamHeader />

      {/* Main Mobile Content */}
      <main className="pt-20 pb-8 min-h-screen flex flex-col">
        {/* Hero Section with Active Member */}
        <div className="flex-1 flex flex-col">
          {/* Member Image Card */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div 
              className="relative w-full max-w-sm"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                {/* Stylish border frame */}
                <div className="absolute inset-0 z-20">
                  {/* Top-left corner */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-blue-400 rounded-tl-xl opacity-80" />
                  {/* Bottom-right corner */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-400 rounded-br-xl opacity-80" />
                  {/* Top-right corner */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-purple-400 rounded-tr-lg opacity-60" />
                  {/* Bottom-left corner */}
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-purple-400 rounded-bl-lg opacity-60" />
                </div>

                {/* Animated border glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl animate-pulse z-10" />

                {/* Main image */}
                <Image
                  src={activeMember.imageUrl}
                  alt={`${activeMember.name}, ${activeMember.branch}`}
                  fill
                  className="object-cover object-center rounded-3xl"
                  sizes="(max-width: 448px) 100vw, 448px"
                  priority
                />

                {/* Navigation arrows */}
                {activeIndex > 0 && (
                  <button
                    onClick={() => handleCardChange('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 z-30"
                    aria-label="Previous member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {activeIndex < teamData.length - 1 && (
                  <button
                    onClick={() => handleCardChange('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 z-30"
                    aria-label="Next member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Position indicator */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-mono text-white/90 z-30">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(teamData.length).padStart(2, "0")}
                </div>
              </div>

              {/* Swipe indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {teamData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onIndexChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "bg-blue-400 w-6" 
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Member Info */}
          <div className="px-6 py-6 space-y-6">
            {/* Age number background */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden">
                <span
                  className="text-[8rem] font-black leading-none opacity-[0.06] font-mono text-white/20"
                  aria-hidden="true"
                >
                  {activeMember.age}
                </span>
              </div>

              {/* Main content */}
              <div className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent opacity-80" />
                  
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-[0.1em] text-white leading-tight">
                      {activeMember.name}
                    </h1>
                    <p className="text-blue-400 font-medium uppercase tracking-[0.12em] text-lg">
                      {activeMember.branch}
                    </p>
                    <p className="text-cyan-400 font-medium uppercase tracking-[0.15em] text-base">
                      {activeMember.designation}
                    </p>
                  </div>
                </div>

                {/* Expandable description */}
                <div className="space-y-3">
                  <p className={`
                    text-white/70 leading-relaxed text-base font-light tracking-wide transition-all duration-300
                    ${isExpanded ? '' : 'line-clamp-3'}
                  `}>
                    {activeMember.description}
                  </p>
                  
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 text-sm font-medium hover:text-cyan-400 transition-colors"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                </div>

                {/* Social links */}
                <nav className="flex items-center gap-6 pt-2" aria-label="Social links">
                  <Link
                    className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-all duration-300"
                    href={activeMember.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Link>
                  
                  <Link
                    className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-all duration-300"
                    href={activeMember.Instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom thumbnail strip */}
        <div className="px-4 pb-4">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {teamData.map((member, index) => (
              <button
                key={member.id}
                onClick={() => onIndexChange(index)}
                className={`
                  relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden transition-all duration-300
                  ${index === activeIndex 
                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a0a0a] scale-110' 
                    : 'opacity-60 hover:opacity-80'
                  }
                `}
                style={{ scrollSnapAlign: 'center' }}
                aria-label={`Select ${member.name}`}
              >
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
                
                {/* Overlay for non-active items */}
                {index !== activeIndex && (
                  <div className="absolute inset-0 bg-black/40" />
                )}
                
                {/* Index number */}
                <div className={`
                  absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono
                  ${index === activeIndex 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-black/70 text-white/80'
                  }
                `}>
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileTeamView;