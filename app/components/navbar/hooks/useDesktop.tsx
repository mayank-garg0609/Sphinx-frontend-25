import { useState, useEffect, useCallback } from "react";
import { DESKTOP_BREAKPOINT } from "../utils/constants";

export const useDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const checkIsDesktop = useCallback(() => {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }, []);

  useEffect(() => {
    setIsClient(true);
    setIsDesktop(checkIsDesktop());

    const handleResize = () => setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkIsDesktop]);

  return { isDesktop, isClient };
};