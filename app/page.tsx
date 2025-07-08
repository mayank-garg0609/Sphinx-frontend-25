"use client";

import { useRef } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import "./globals.css";

const HOME_CONTAINER_CLASSES = "relative w-screen min-h-screen overflow-x-hidden text-white";

const HOME_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

export default function Home() {
  const lenisRef = useRef(null);

  return (
    <ReactLenis root ref={lenisRef}>
      <main
        className= {HOME_CONTAINER_CLASSES}
        style={HOME_CONTAINER_STYLES}
      >
        <div className="overflow-y-auto leading-relaxed "></div>
        <section className="h-screen w-screen flex items-center justify-center bg-[#0f1b1d]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">SECTION 1</h1>
          </div>
        </section>

        <section className="h-screen w-screen flex items-center justify-center bg-black/20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">SECTION 2</h1>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}
