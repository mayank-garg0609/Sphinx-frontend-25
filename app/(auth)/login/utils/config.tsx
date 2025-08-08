export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  maxRetries: 3,
  googlePopupTimeout: 30000,
} as const;