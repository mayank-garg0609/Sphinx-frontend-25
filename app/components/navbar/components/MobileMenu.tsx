import React, { useEffect, memo, Suspense, useCallback } from 'react';
import { FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { navItems } from '../utils/navItems';

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly pathname: string;
  readonly isLoggedIn: boolean;
  readonly setIsLoggedIn: (value: boolean) => void;
  readonly onNavigation: (item: any) => void;
  readonly onInnerCircleNavigation: () => void;
}

const MobileMenuComponent: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  pathname,
  isLoggedIn,
  setIsLoggedIn,
  onNavigation,
  onInnerCircleNavigation,
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const toggleAuthStatus = useCallback(() => {
    setIsLoggedIn(!isLoggedIn);
  }, [isLoggedIn, setIsLoggedIn]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 text-white z-50">
      <button
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <Suspense fallback={<div className="w-8 h-8 bg-gray-400 rounded animate-pulse" />}>
          <FaTimes size={32} />
        </Suspense>
      </button>
      
      <nav className="flex flex-col items-center justify-center gap-1 mt-6 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <button
              key={item.id}
              onClick={() => onNavigation(item)}
              className={`w-full text-center py-2 text-xs font-semibold tracking-wide rounded-md hover:bg-white hover:text-black transition-all duration-200 active:scale-95 ${
                isActive ? 'bg-white text-black' : ''
              }`}
            >
              <div className="flex justify-center items-center gap-2">
                <Suspense fallback={<div className="w-4 h-4 bg-gray-400 rounded animate-pulse" />}>
                  <item.icon size={16} />
                </Suspense>
                {item.label}
              </div>
            </button>
          );
        })}
        
        <button
          onClick={onInnerCircleNavigation}
          className="mt-6 w-80 h-20 py-3 border border-white rounded-xl text-2xl font-semibold bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200 ease-in-out active:scale-95 text-center flex items-center justify-center gap-2"
        >
          <Suspense fallback={<div className="w-4 h-4 bg-gray-400 rounded animate-pulse" />}>
            {isLoggedIn ? <FaUser size={16} /> : <FaUserPlus size={20} />}
          </Suspense>
          <span>{isLoggedIn ? 'Logout' : 'Sign Up'}</span>
        </button>


      </nav>
    </div>
  );
};

export const MobileMenu = memo(MobileMenuComponent);