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
    <div className="lg:hidden fixed top-24 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800/50 p-4"> 
      <div className="flex items-center justify-center">
        <div 
          className="flex space-x-1 bg-zinc-900/50 rounded-xl p-1 border border-zinc-800/50"
          role="tablist"
          aria-label="Policy selection"
        >
          {Object.entries(policies).map(([key, policy]) => {
            const IconComponent = policy.icon;
            const isActive = selectedPolicy === key;

            return (
              <button
                key={key}
                onClick={() => handlePolicyClick(key)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {policy.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

MobilePolicySelector.displayName = 'MobilePolicySelector';