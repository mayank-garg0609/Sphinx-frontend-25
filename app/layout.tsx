"use client";
import { useMemo, memo, useCallback, lazy, Suspense } from "react";
import { Oxanium } from "next/font/google";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./globals.css";
// Lazy load components to reduce initial bundle size
const Navbar = lazy(() => import("./components/navbar"));
const CursorTracker = lazy(() => import("../app/animations/glowingCursor"));

// Static imports for images
import homeBG from "@/public/image/homeBG.webp";
import upcomingBG from "@/public/image/upcomingBG.png";
import mobileBG from "@/public/image/mobileBG.png";

// OPTIMIZATION: Move all constants outside component to prevent recreation on each render
const NO_BG_PATHS = new Set([
  "/login",
  "/sign-up",
  "/caProgram",
  "/caProgram/register",
]);

const UPCOMING_PATHS = new Set([
  "/about-us",
  "/accommodation",
  "/team",
  "/dev-team",
  "/workshops",
  "/events",
  "/competition",
  "/sponsors",
]);

const GLOW_PATH = new Set(["/login", "/sign-up", "/register"]);

// OPTIMIZATION: Font configuration moved outside component
const oxanium = Oxanium({
  weight: "300",
  subsets: ["latin"],
  display: "swap", // Improves font loading performance
});

// OPTIMIZATION: Static class strings to avoid string concatenation
const CONTAINER_STYLES = "fixed inset-0 z-10";
const NAVBAR_STYLES = "fixed top-0 left-0 w-full z-50";
const MAIN_STYLES = "relative z-10";
const CURSOR_GLOW_STYLES = "hidden lg:block cursor-glow";

// OPTIMIZATION: Consolidated image styles object
const IMAGE_STYLES = {
  upcoming: {
    mobile:
      "object-contain fixed max-lg:left-1/2 max-lg:top-0 max-lg:transform max-lg:-translate-x-1/2 max-lg:h-[1080] max-lg:w-auto",
    desktop: "lg:left-48 lg:bottom-0 lg:h-[840px] lg:w-auto overflow-y-hidden",
  },
  home: {
    mobile: "object-cover absolute max-lg:w-500",
    desktop: "",
  },
};

const HOME_OVERLAY_STYLE =
  "absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent";

// OPTIMIZATION: Memoized background components with stable props
const UpcomingBGLayer = memo(() => (
  <div className={CONTAINER_STYLES}>
    <Image
      src={upcomingBG}
      alt="ascended human image"
      placeholder="blur"
      loading="lazy"
      blurDataURL={upcomingBG.blurDataURL}
      className={`${IMAGE_STYLES.upcoming.mobile} ${IMAGE_STYLES.upcoming.desktop}`}
      sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 400px"
      quality={75}
    />
  </div>
));

const BackgroundLayer = memo(() => (
  <div className={CONTAINER_STYLES}>
    <Image
      src={mobileBG}
      alt="Background"
      loading="lazy"
      fill
      placeholder="blur"
      className={`${IMAGE_STYLES.home.mobile} ${IMAGE_STYLES.home.desktop}`}
      quality={60}
      sizes="100vw"
      priority={false}
    />
    <div className={HOME_OVERLAY_STYLE} />
  </div>
));

// OPTIMIZATION: Separate cursor component for better code splitting
const CursorGlow = memo(() => {
  // OPTIMIZATION: Only render cursor tracker on client side and desktop
  const shouldRenderCursor = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  }, []);

  if (!shouldRenderCursor) return null;

  return (
    <Suspense fallback={null}>
      <div className={CURSOR_GLOW_STYLES} />
      <CursorTracker />
    </Suspense>
  );
});

// OPTIMIZATION: Memoized navbar wrapper with suspense
const NavbarWrapper = memo(() => (
  <div className={NAVBAR_STYLES}>
    <Suspense fallback={<div className="h-16 bg-black/20" />}>
      <Navbar />
    </Suspense>
  </div>
));

// Set display names for better debugging
BackgroundLayer.displayName = "BackgroundLayer";
NavbarWrapper.displayName = "NavbarWrapper";
UpcomingBGLayer.displayName = "UpcomingBGLayer";
CursorGlow.displayName = "CursorGlow";

// OPTIMIZATION: Main layout component with comprehensive memoization
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const showBG = useMemo(() => !NO_BG_PATHS.has(pathname), [pathname]);
  const cursor = useMemo(() => GLOW_PATH.has(pathname), [pathname]);
  const isUpcoming = useMemo(() => UPCOMING_PATHS.has(pathname), [pathname]);

  const backgroundContent = useMemo(() => {
    if (!showBG) return null;

    const Background = isUpcoming ? UpcomingBGLayer : BackgroundLayer;

    return (
      <>
        <Background />
        <NavbarWrapper />
      </>
    );
  }, [showBG, isUpcoming]);

  const bodyClassName = useMemo(() => oxanium.className, []);

  const cursorWrapper = useMemo(() => {
    if (!cursor) return null;

    return <CursorGlow />;
  }, [cursor]);

  return (
    <ViewTransitions>
      <html lang="en">
        <body className={bodyClassName}>
          <Toaster richColors position="top-center" />

          {/* OPTIMIZATION: Cursor component handles its own conditional rendering */}
          {cursorWrapper}

          {backgroundContent}

          <main className={MAIN_STYLES}>{children}</main>
        </body>
      </html>
    </ViewTransitions>
  );
}
