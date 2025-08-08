import React, { memo } from 'react';

interface PolicySectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const PolicySection: React.FC<PolicySectionProps> = memo(({ 
  title, 
  children, 
  className = "mb-12 md:mb-16" 
}) => (
  <section className={className}>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center">
      <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-3 md:mr-4" />
      {title}
    </h2>
    {children}
  </section>
));

PolicySection.displayName = 'PolicySection';

interface PolicySubSectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly dotColor?: 'cyan' | 'purple';
}

export const PolicySubSection: React.FC<PolicySubSectionProps> = memo(({ 
  title, 
  children,
  dotColor = 'cyan'
}) => (
  <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
    <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3 md:mb-4 flex items-center">
      <div className={`w-2 h-2 bg-${dotColor}-400 rounded-full mr-3`} />
      {title}
    </h3>
    {children}
  </div>
));

PolicySubSection.displayName = 'PolicySubSection';