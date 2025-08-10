// app/(auth)/utils/security.tsx
export const SECURITY_CONFIG = {
  // Rate limiting configuration
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDuration: 30 * 60 * 1000, // 30 minutes
    progressiveDelay: true,
  },
  
  // Password security
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    maxConsecutiveChars: 3,
  },
  
  // Session security
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 4 * 60 * 60 * 1000, // 4 hours
    absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // Token security
  token: {
    algorithm: 'HS256',
    issuer: 'sphinx-auth',
    audience: 'sphinx-users',
    jwtExpiry: '24h',
    refreshExpiry: '7d',
  },
  
  // Input validation
  validation: {
    maxInputLength: 1000,
    allowedEmailDomains: [], // Empty means all domains allowed
    sanitizeHtml: true,
    trimWhitespace: true,
  },
  
  // API security
  api: {
    timeout: 30000,
    maxRetries: 3,
    backoffMultiplier: 2,
    maxPayloadSize: 10 * 1024, // 10KB
  },
  
  // Storage security
  storage: {
    useSecurePrefix: true,
    encryptSensitiveData: true,
    autoCleanup: true,
    expirationCheck: 60 * 60 * 1000, // 1 hour
  },
} as const;

// Common password patterns to block
export const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', '123123', 'admin', 'letmein', 'welcome',
  'monkey', '1234567890', 'dragon', 'master', 'login',
];

// Password strength levels
export type PasswordStrengthLevel = 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;
  feedback: string[];
  isValid: boolean;
}