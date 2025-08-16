import React, { memo, useCallback } from 'react';
import type { PolicyKey, Policies } from '../types/legal';

interface MobilePolicySelectorProps {
  readonly policies: Policies;
  readonly selectedPolicy: PolicyKey;
  readonly onPolicySelect: (key: PolicyKey) => void;
}

export const MobilePolicySelector: React.FC<MobilePolicySelectorProps> = memo(({
  policies,
  selectedPolicy,
  onPolicySelect,
}) => {
  const handlePolicyClick = useCallback((key: string) => {
    onPolicySelect(key as PolicyKey);
  }, [onPolicySelect]);

  return (
    <>
      <div className="lg:hidden fixed top-24 left-0 right-0 z-40 pointer-events-none ">
        <div className="flex items-center justify-center px-4">
          <div 
            className="relative flex space-x-1 bg-black/80 backdrop-blur-xl rounded-2xl p-2 border border-zinc-700/30 shadow-2xl shadow-black/40 pointer-events-auto overflow-hidden"
            style={{
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03)'
            }}
            role="tablist"
            aria-label="Policy selection"
          >
            {/* Selected indicator line */}
            <div 
              className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ease-out"
              style={{
                left: `${(Object.keys(policies).indexOf(selectedPolicy) * (100 / Object.keys(policies).length)) + (100 / Object.keys(policies).length / 2 - 25)}%`,
                width: '50%',
                transform: 'translateX(-50%)'
              }}
            />
            {Object.entries(policies).map(([key, policy]) => {
              const IconComponent = policy.icon;
              const isActive = selectedPolicy === key;

              return (
                <button
                  key={key}
                  onClick={() => handlePolicyClick(key)}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                  }`}
                >
                  {/* Active state background glow with hidden overflow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl animate-pulse" />
                  )}
                  
                  {/* Content container with hidden overflow */}
                  <div className="relative z-10 flex items-center space-x-2 overflow-hidden">
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium hidden sm:inline whitespace-nowrap overflow-hidden text-ellipsis">
                      {policy.title.split(" ")[0]}
                    </span>
                  </div>
                  
                  {/* Individual button selected indicator (additional visual cue) */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
});

MobilePolicySelector.displayName = 'MobilePolicySelector';