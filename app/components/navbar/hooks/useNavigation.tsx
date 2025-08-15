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
        // Enhanced external link handling with multiple fallback strategies
        try {
          // First attempt: Standard window.open with specific features
          const newWindow = window.open(
            item.link, 
            '_blank', 
            'noopener,noreferrer,width=1024,height=768,scrollbars=yes,resizable=yes,status=yes,location=yes'
          );
          
          // Check if window was successfully opened
          if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            // Fallback 1: Try without window features
            const fallbackWindow = window.open(item.link, '_blank', 'noopener,noreferrer');
            
            if (!fallbackWindow || fallbackWindow.closed) {
              // Fallback 2: Create a temporary link element and click it
              const tempLink = document.createElement('a');
              tempLink.href = item.link;
              tempLink.target = '_blank';
              tempLink.rel = 'noopener noreferrer';
              tempLink.style.display = 'none';
              
              // Add to DOM temporarily
              document.body.appendChild(tempLink);
              
              // Trigger click with user gesture context
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              tempLink.dispatchEvent(clickEvent);
              
              // Clean up
              document.body.removeChild(tempLink);
              
              console.log(`Opened ${item.label} using fallback link click method`);
            } else {
              // Focus the fallback window if it opened successfully
              try {
                fallbackWindow.focus();
              } catch (e) {
                // Silently handle focus errors
              }
            }
          } else {
            // Focus the new window if it opened successfully
            try {
              newWindow.focus();
            } catch (e) {
              // Silently handle focus errors in case of cross-origin restrictions
            }
          }
        } catch (error) {
          // Final fallback: Navigate in same tab if all else fails
          console.warn(`Failed to open ${item.label} in new tab, trying same tab navigation:`, error);
          window.location.href = item.link;
        }
      } else {
        // Internal navigation remains unchanged
        router.push(item.link, { onTransitionReady: slideInOut });
      }
      
      // Close mobile menu and collapse dial (only for internal navigation)
      if (!item.external) {
        requestAnimationFrame(() => {
          setIsExpanded(false);
          setIsMobileMenuOpen(false);
        });
      }
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