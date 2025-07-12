import { useState, useEffect } from "react";
import { checkIsDesktop } from "../utils/navbatUtils";

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDesktop(checkIsDesktop());

    const handleResize = () => setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isDesktop, isClient };
};
