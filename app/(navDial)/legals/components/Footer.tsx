import React, { memo } from 'react';

export const Footer: React.FC = memo(() => (
  <footer className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-t from-zinc-900/30 to-transparent border-t border-zinc-800/50">
    <div className="max-w-4xl mx-auto text-center">
      <div className="text-zinc-500 text-sm">
        <p>&copy; 2024 Sphinx. All rights reserved.</p>
        <p className="mt-2">
          For questions about these policies, please contact our legal team.
        </p>
      </div>
    </div>
  </footer>
));

Footer.displayName = 'Footer';