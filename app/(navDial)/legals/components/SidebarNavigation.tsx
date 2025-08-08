import React, { memo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import type { PolicyKey, Policies } from '../types/legal';

interface SidebarNavigationProps {
  readonly policies: Policies;
  readonly selectedPolicy: PolicyKey;
  readonly onPolicySelect: (key: PolicyKey) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = memo(({
  policies,
  selectedPolicy,
  onPolicySelect,
}) => {
  const handlePolicyClick = useCallback((key: string) => {
    onPolicySelect(key as PolicyKey);
  }, [onPolicySelect]);

  return (
    <aside className="hidden lg:block fixed left-10 top-20 bottom-0 w-80 bg-zinc-900/30 backdrop-blur-sm border-r border-zinc-800/50 z-30 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">
            Legal Documents
          </h2>
        </div>

        <nav className="space-y-2" role="navigation" aria-label="Legal documents navigation">
          {Object.entries(policies).map(([key, policy]) => {
            const IconComponent = policy.icon;
            const isActive = selectedPolicy === key;

            return (
              <button
                key={key}
                onClick={() => handlePolicyClick(key)}
                className={`w-full group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-white shadow-lg shadow-cyan-500/10"
                    : "hover:bg-zinc-800/50 text-zinc-300 hover:text-white border border-transparent hover:border-zinc-700/50"
                }`}
                aria-pressed={isActive}
                aria-describedby={`${key}-description`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-cyan-400"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-semibold transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {policy.title}
                    </div>
                    <div 
                      className="text-xs text-zinc-500 mt-1"
                      id={`${key}-description`}
                    >
                      {policy.description}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-all duration-300 ${
                    isActive
                      ? "text-cyan-400 transform rotate-90"
                      : "text-zinc-500 group-hover:text-zinc-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
});

SidebarNavigation.displayName = 'SidebarNavigation';