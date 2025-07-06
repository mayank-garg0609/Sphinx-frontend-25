"use client";

import { useCursorTracker } from "../app/animations/glowingCursor";
import "./globals.css";
import localFont from "next/font/local";
import { Oxanium } from 'next/font/google'
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";

const spaceArmor = localFont({
  src: "./fonts/SPACE_ARMOR.woff",
  display: "swap",
  variable: "--font-space-armor",
});

const oxanium = Oxanium({
  weight: '300',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useCursorTracker();

  return (
    <ViewTransitions>
      <html lang="en">
        <body className={oxanium.className}>
          <Toaster richColors position="top-center" />
          <div className="cursor-glow" />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
