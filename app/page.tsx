"use client";

import { useRef } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import "./globals.css";
import type { StaticImageData } from "next/image";

import Card from "./components/card";
import eventImage from "@/public/image/human.webp";

const HOME_CONTAINER_CLASSES =
  "relative w-screen min-h-screen overflow-x-hidden overflow-y-auto text-white";

const HOME_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

interface cardProps {
  id: number;
  title: string;
  description: string;
  prizes_worth: string;
  isCenter?: boolean;
  imageData: StaticImageData;
}

const cards: cardProps[] = [
  {
    id: 1,
    title: " Meshmerize ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    imageData: eventImage,
  },
  {
    id: 2,
    title: "CosmClench",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    imageData: eventImage,
  },
  {
    id: 3,
    title: "CoDecode",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    imageData: eventImage,
  },
];

export default function Home() {
  const lenisRef = useRef(null);

  return (
    <ReactLenis root ref={lenisRef}>
      <main className={HOME_CONTAINER_CLASSES} style={HOME_CONTAINER_STYLES}>
        <section className="h-screen w-screen flex items-center justify-center bg-[#0f1b1d]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">SECTION 1</h1>
          </div>
        </section>

        <section className="h-screen w-screen flex items-center justify-center bg-black/20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">SECTION 2</h1>
            <div className="flex flex-wrap gap-8 justify-center pt-8">
              {cards.map((card) => (
                <Card key={card.id} {...card} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}
