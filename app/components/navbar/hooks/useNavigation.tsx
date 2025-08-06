import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
import { NavItem } from "../types/navbarTypes";

export const useNavigation = (setIsExpanded: (value: boolean) => void, setIsMobileMenuOpen: (value: boolean) => void) => {
  const pathname = usePathname();
  const router = useTransitionRouter();

  const handleNavigation = useCallback(
    (item: NavItem) => {
      if (item.external) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.link, { onTransitionReady: slideInOut });
      }
      setIsExpanded(false);
      setIsMobileMenuOpen(false);
    },
    [router, setIsExpanded, setIsMobileMenuOpen]
  );

  const handleInnerCircleNavigation = useCallback(
    (isLoggedIn: boolean) => {
      const link = isLoggedIn ? "/profile" : "/sign-up";
      router.push(link, { onTransitionReady: slideInOut });
      setIsExpanded(false);
      setIsMobileMenuOpen(false);
    },
    [router, setIsExpanded, setIsMobileMenuOpen]
  );

  const navigateHome = useCallback(() => {
    router.push("/", { onTransitionReady: slideInOut });
  }, [router]);

  return { pathname, handleNavigation, handleInnerCircleNavigation, navigateHome };
};
