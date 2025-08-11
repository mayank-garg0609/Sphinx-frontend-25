export const SECURITY_CONFIG = {
  password: {
    minLength: 8,
    maxLength: 128,
  },
  email: {
    maxLength: 254,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  api: {
    timeout: 30000,
    maxRetries: 3,
    rateLimitWindow: 900000, // 15 minutes
  },
  auth: {
    tokenExpiry: 3600000, // 1 hour
    maxSessionDuration: 86400000, // 24 hours
    lockoutDuration: 900000, // 15 minutes
  },
  input: {
    maxLength: 1000,
    suspiciousPatterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
    ],
  },
  maxAttempts: 5,
} as const;
