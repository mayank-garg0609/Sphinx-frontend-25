export const PROFILE_STYLES = {
  container: "relative min-h-screen bg-black overflow-hidden",
  backgroundOverlay:
    "absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20 lg:from-black/80 lg:via-black/60 lg:to-transparent z-1",
  mobileCard:
    "w-full max-w-md bg-black/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/10",
  desktopCard:
    "ml-16 xl:ml-24 w-full max-w-xl bg-black/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10",
  mobileWrapper:
    "lg:hidden relative z-10 min-h-screen flex items-center justify-center p-4",
  desktopWrapper: "hidden lg:flex relative z-10 min-h-screen items-center",
} as const;

export const SECTION_STYLES = {
  card: "bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10",
  sectionTitle: "text-lg font-semibold mb-3 flex items-center",
  infoGrid: "space-y-2 text-sm text-gray-300",
} as const;

export const MAX_RETRIES = 3;
export const MAX_REQUESTS_PER_SESSION = 10;
export const RETRY_DELAY = 2000;
export const RATE_LIMIT_RESET_TIME = 5 * 60 * 1000; // 5 minutes
