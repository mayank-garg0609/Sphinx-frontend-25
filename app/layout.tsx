"use client";
import {
  useMemo,
  memo,
  useCallback,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import { Oxanium } from "next/font/google";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Navbar = lazy(() => import("./components/navbar"));
const CursorTracker = lazy(() => import("../app/animations/glowingCursor"));

import homeBG from "@/public/image/homeBG.webp";
import upcomingBG from "@/public/image/upcomingBG.webp";
import mobileBG from "@/public/image/mobileBG.webp";

// ========== CONSTANTS ==========
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

const oxanium = Oxanium({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const CONTAINER_STYLES = "fixed inset-0 z-10";
const NAVBAR_STYLES = "fixed top-0 left-0 w-full z-50";
const MAIN_STYLES = "relative z-10";
const CURSOR_GLOW_STYLES = "hidden lg:block cursor-glow";

const IMAGE_STYLES = {
  upcoming: {
    mobile:
      "object-cover fixed inset-0 w-full h-screen scale-110 max-lg:scale-100",
    desktop:
      "lg:object-cover lg:fixed lg:inset-0 lg:w-full lg:h-screen lg:scale-100",
  },
  home: {
    mobile: "object-cover fixed inset-0 w-full h-screen scale-100",
    desktop: "lg:object-cover lg:scale-105",
  },
};

const HOME_OVERLAY_STYLE =
  "absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10";

// ========== CONFIGURATION ==========
const getGoogleClientId = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.warn('Google Client ID is not configured. Google OAuth will not work.');
    return '';
  }
  
  return clientId;
};

// ========== COMPONENTS ==========
const NavbarFallback = memo(() => (
  <div className="h-16 bg-black/20 backdrop-blur-sm" />
));
NavbarFallback.displayName = "NavbarFallback";

const CursorGlow = memo(() => {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();

    const handleResize = () => {
      checkDesktop();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient || !isDesktop) return null;

  return (
    <Suspense fallback={null}>
      <div className={CURSOR_GLOW_STYLES} />
      <CursorTracker />
    </Suspense>
  );
});
CursorGlow.displayName = "CursorGlow";

const UpcomingBGLayer = memo(() => (
  <div className={CONTAINER_STYLES}>
    <Image
      src={upcomingBG}
      alt="ascended human image"
      placeholder="blur"
      loading="eager"
      priority
      fill
      blurDataURL={upcomingBG.blurDataURL}
      className={`${IMAGE_STYLES.upcoming.mobile} ${IMAGE_STYLES.upcoming.desktop}`}
      sizes="100vw"
      quality={85}
    />
  </div>
));
UpcomingBGLayer.displayName = "UpcomingBGLayer";

const BackgroundLayer = memo(() => (
  <div className={CONTAINER_STYLES}>
    <Image
      src={mobileBG}
      alt="Background"
      loading="eager"
      priority
      fill
      placeholder="blur"
      className={`${IMAGE_STYLES.home.mobile} ${IMAGE_STYLES.home.desktop}`}
      quality={80}
      sizes="100vw"
    />
    <div className={HOME_OVERLAY_STYLE} />
  </div>
));
BackgroundLayer.displayName = "BackgroundLayer";

const NavbarWrapper = memo(() => (
  <div className={NAVBAR_STYLES}>
    <Suspense fallback={<NavbarFallback />}>
      <Navbar />
    </Suspense>
  </div>
));
NavbarWrapper.displayName = "NavbarWrapper";

const BackgroundSelector = memo<{ isUpcoming: boolean }>(({ isUpcoming }) => {
  return isUpcoming ? <UpcomingBGLayer /> : <BackgroundLayer />;
});
BackgroundSelector.displayName = "BackgroundSelector";

// ========== GOOGLE OAUTH WRAPPER ==========
const GoogleOAuthWrapper = memo<{ children: React.ReactNode }>(({ children }) => {
  const googleClientId = useMemo(() => getGoogleClientId(), []);

  // If no client ID, render children without Google OAuth
  if (!googleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
});
GoogleOAuthWrapper.displayName = "GoogleOAuthWrapper";

// ========== MAIN LAYOUT ==========
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const showBG = useMemo(() => !NO_BG_PATHS.has(pathname), [pathname]);
  const showCursor = useMemo(() => GLOW_PATH.has(pathname), [pathname]);
  const isUpcoming = useMemo(() => UPCOMING_PATHS.has(pathname), [pathname]);

  const backgroundContent = useMemo(() => {
    if (!showBG) return null;

    return (
      <>
        <BackgroundSelector isUpcoming={isUpcoming} />
        <NavbarWrapper />
      </>
    );
  }, [showBG, isUpcoming]);

  const cursorWrapper = useMemo(() => {
    if (!showCursor) return null;
    return <CursorGlow />;
  }, [showCursor]);

  const bodyClassName = useMemo(() => oxanium.className, []);

  const toasterProps = useMemo(
    () => ({
      richColors: true,
      position: "top-center" as const,
    }),
    []
  );

  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          <title>Rajasthan's largest techno-management festival</title>
          <link rel="preload" href={mobileBG.src} as="image" type="image/png" />
          <link
            rel="preload"
            href={upcomingBG.src}
            as="image"
            type="image/png"
          />
        </head>
        <body className={bodyClassName}>
          <GoogleOAuthWrapper>
            <Toaster {...toasterProps} />
            {cursorWrapper}
            {backgroundContent}
            <main className={MAIN_STYLES}>{children}</main>
          </GoogleOAuthWrapper>
        </body>
      </html>
    </ViewTransitions>
  );
}