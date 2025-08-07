import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTransitionRouter } from 'next-view-transitions';
import { slideInOut } from '@/app/animations/pageTrans';
import { NavItem } from '../types/navbarTypes';

interface NavigationHandlers {
  readonly pathname: string;
  readonly handleNavigation: (item: NavItem) => void;
  readonly handleInnerCircleNavigation: (isLoggedIn: boolean) => void;
  readonly navigateHome: () => void;
}

export const useNavigation = (
  setIsExpanded: (value: boolean) => void,
  setIsMobileMenuOpen: (value: boolean) => void
): NavigationHandlers => {
  const pathname = usePathname();
  const router = useTransitionRouter();

  const handleNavigation = useCallback(
    (item: NavItem) => {
      if (item.external) {
        const newWindow = window.open(item.link, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          console.warn('Popup blocked, opening in same tab');
          window.location.href = item.link;
        }
      } else {
        router.push(item.link, { onTransitionReady: slideInOut });
      }
      
      requestAnimationFrame(() => {
        setIsExpanded(false);
        setIsMobileMenuOpen(false);
      });
    },
    [router, setIsExpanded, setIsMobileMenuOpen]
  );

  const handleInnerCircleNavigation = useCallback(
    (isLoggedIn: boolean) => {
      const link = isLoggedIn ? '/profile' : '/sign-up';
      router.push(link, { onTransitionReady: slideInOut });
      
      requestAnimationFrame(() => {
        setIsExpanded(false);
        setIsMobileMenuOpen(false);
      });
    },
    [router, setIsExpanded, setIsMobileMenuOpen]
  );

  const navigateHome = useCallback(() => {
    router.push('/', { onTransitionReady: slideInOut });
  }, [router]);

  return useMemo(() => ({
    pathname,
    handleNavigation,
    handleInnerCircleNavigation,
    navigateHome,
  }), [pathname, handleNavigation, handleInnerCircleNavigation, navigateHome]);
};