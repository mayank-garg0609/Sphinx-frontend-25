import { useEffect, useRef } from "react";

const CSS_PROPERTIES = {
  X: "--cursor-x",
  Y: "--cursor-y"
};

export function useCursorTracker(): void {
  const rafRef = useRef<number | undefined>(undefined);
  const documentElement: HTMLElement = document.documentElement;

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse") return;
      if (rafRef.current !== undefined) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        const { clientX: x, clientY: y } = event;
        documentElement.style.setProperty(CSS_PROPERTIES.X, `${x}px`);
        documentElement.style.setProperty(CSS_PROPERTIES.Y, `${y}px`);
      });
    };

    const handlePointerLeave = (): void => {
      documentElement.style.removeProperty(CSS_PROPERTIES.X);
      documentElement.style.removeProperty(CSS_PROPERTIES.Y);
    };

    document.body.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.body.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave); 

    return () => {
      document.body.removeEventListener("pointermove", handlePointerMove);
      document.body.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);

      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
}
