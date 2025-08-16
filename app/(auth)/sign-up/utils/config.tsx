import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

const validateEnvironment = () => {
  const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    return EnvSchema.parse(env);
  } catch (error) {
    console.error("Environment validation failed:", error);

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Required environment variables are missing in production"
      );
    }

    return env;
  }
};

const env = validateEnvironment();

export const API_CONFIG = {
  baseUrl: (() => {
    if (env.NEXT_PUBLIC_API_URL) {
      return env.NEXT_PUBLIC_API_URL;
    }

    if (env.NODE_ENV === "development") {
      return "http://localhost:3001";
    }

    throw new Error("API_URL is required in production environment");
  })(),
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  googlePopupTimeout: 30000,
  // Token refresh timing
  tokenRefreshThreshold: 300000, // 5 minutes before expiry
  // Rate limiting
  rateLimitWindow: 60000, // 1 minute
  maxRequestsPerWindow: 10,
} as const;

export const SECURITY_CONFIG = {
  contentSecurityPolicy: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://apis.google.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://accounts.google.com",
      API_CONFIG.baseUrl,
    ],
    "frame-src": ["'self'", "https://accounts.google.com"],
  },
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
  },
} as const;

export const API_ENDPOINTS = {
  SIGNUP: "/auth/signup",
  GOOGLE_AUTH: "/auth/google",
  REFRESH_TOKEN: "/api/auth/refresh",
  LOGOUT: "/api/auth/logout",
  CSRF_TOKEN: "/api/auth/csrf-token",
  STORE_REFRESH_TOKEN: "/api/auth/store-refresh-token",
} as const;

export const isValidApiUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.baseUrl;

  if (!isValidApiUrl(baseUrl)) {
    throw new Error(`Invalid API base URL: ${baseUrl}`);
  }

  return `${baseUrl.replace(/\/$/, "")}${endpoint}`;
};

class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - API_CONFIG.rateLimitWindow;

    this.requests = this.requests.filter(
      (timestamp) => timestamp > windowStart
    );

    if (this.requests.length >= API_CONFIG.maxRequestsPerWindow) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0;

    const oldestRequest = Math.min(...this.requests);
    const timeUntilExpiry =
      API_CONFIG.rateLimitWindow - (Date.now() - oldestRequest);

    return Math.max(0, timeUntilExpiry);
  }
}

export const rateLimiter = new RateLimiter();
