"use client";
import { useMemo, memo } from "react";
import { useCursorTracker } from "../app/animations/glowingCursor";
import "./globals.css";
import localFont from "next/font/local";
import { Oxanium } from "next/font/google";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Image from "next/image";
import homeBG from "@/public/image/homeBG.webp";
import upcomingBG from "@/public/image/upcomingBG.png";
import Navbar from "./components/navbar";

const spaceArmor = localFont({
  src: "./fonts/SPACE_ARMOR.woff",
  display: "swap",
  variable: "--font-space-armor",
});

const oxanium = Oxanium({
  weight: "300",
  subsets: ["latin"],
});

const noBG: string[] = [
  "/login",
  "/sign-up",
  "/caProgram",
  "/caProgram/register",
];

const soon: string[] = [
  "/about-us",
  "/accomodation",
  "team",
  "dev-team",
  "workshops",
  "events",
  "competition",
  "sponsors",
];

const UpcomingBGLayer = memo(() => (
  <div className="fixed top-0 left-0 w-full h-full z-10">
    <Image
      src={upcomingBG}
      alt="ascended human image"
      placeholder="blur"
      loading="lazy"
      blurDataURL={upcomingBG.blurDataURL}
      className="h-[840px] w-auto object-contain justify-start absolute bottom-0 left-48"
    />
  </div>
));

const BackgroundLayer = memo(() => (
  <div className="fixed top-0 left-0 w-full h-full z-10">
    <Image
      src={homeBG}
      alt="Background"
      fill
      loading="lazy"
      placeholder="blur"
      className="object-cover"
      quality={60}
      sizes="100vw"
      priority={false}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
  </div>
));

BackgroundLayer.displayName = "BackgroundLayer";

const NavbarWrapper = memo(() => (
  <div className="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>
));

NavbarWrapper.displayName = "NavbarWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useCursorTracker();
  const pathname = usePathname();

  const showBG = useMemo(() => !noBG.includes(pathname), [pathname]);
  const upcomingBG = useMemo(() => soon.includes(pathname), [pathname]);

  const bodyClassName = useMemo(() => oxanium.className, []);

  return (
    <ViewTransitions>
      <html lang="en">
        <body className={bodyClassName}>
          <Toaster richColors position="top-center" />
          <div className="cursor-glow" />

          {showBG && !upcomingBG &&(
            <>
              <BackgroundLayer />
              <NavbarWrapper />
            </>
          )}

          {upcomingBG && (
            <>
              <UpcomingBGLayer />
              <NavbarWrapper />
            </>
          )}

          <main className="relative z-10">{children}</main>
        </body>
      </html>
    </ViewTransitions>
  );
}
