import React, { memo, useMemo } from 'react';
import type { Policy } from '../types/legal';

interface PolicyHeaderProps {
  readonly policy: Policy;
  readonly isLoaded: boolean;
}

export const PolicyHeader: React.FC<PolicyHeaderProps> = memo(({ policy, isLoaded }) => {
  const formattedDate = useMemo(() => 
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }), []);

  return (
    <header className="mb-12 md:mb-16 text-center">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-400/30">
          <policy.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>
        <div>
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent transform transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {policy.title}
          </h1>
          <div className="text-zinc-400 text-sm mt-2">
            Effective as of {formattedDate}
          </div>
        </div>
      </div>
    </header>
  );
});

PolicyHeader.displayName = 'PolicyHeader';