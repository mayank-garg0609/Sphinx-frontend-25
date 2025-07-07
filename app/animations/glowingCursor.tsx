"use client";
import { useEffect } from "react";

export function useCursorTracker() {
  useEffect(() => {
    const injectCursorPosition = ({ clientX: x, clientY: y }: PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    document.body.addEventListener("pointermove", injectCursorPosition);
    return () => {
      document.body.removeEventListener("pointermove", injectCursorPosition);
    };
  }, []);
}
