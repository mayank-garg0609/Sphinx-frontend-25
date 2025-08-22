// Optimized constants with reduced class bloat and better organization
export interface FormField {
  readonly id: string;
  readonly type: 'email' | 'password' | 'text';
  readonly placeholder: string;
  readonly label: string;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
}

export const FORM_FIELDS: Record<'email' | 'password', FormField> = {
  email: {
    id: 'email',
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    required: true,
    autoComplete: 'email',
    maxLength: 254,
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  },
  password: {
    id: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    required: true,
    autoComplete: 'current-password',
    minLength: 8,
    maxLength: 128,
  },
} as const;

// Simplified button styles - removed excessive responsive variants
export const BUTTON_STYLES = {
  primary: 'w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'w-full flex items-center justify-center border border-white text-white font-medium py-3 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-sm gap-3 disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

export const MOBILE_STYLES = {
  container: "min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4 lg:px-8",
  formWrapper: "relative z-10 flex justify-center lg:justify-center xl:justify-end w-full items-center min-h-screen py-8 lg:py-0 lg:pr-16 xl:pr-24 2xl:pr-32",
} as const;

// Enhanced form styles with better sizing
export const FORM_STYLES = {
  container: 'bg-black/40 backdrop-blur-md text-white p-6 lg:p-8 rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-sm lg:max-w-md xl:max-w-lg border border-white/30 space-y-6 font-sans mx-auto max-h-[90vh] overflow-y-auto lg:mx-0',
  scrollbar: {
    scrollbarWidth: 'thin' as const,
    scrollbarColor: '#cbd5e1 #2d2d2d',
  },
} as const;

// Accessibility constants
export const ACCESSIBILITY = {
  ARIA_LABELS: {
    LOGIN_FORM: 'Login form',
    EMAIL_INPUT: 'Email address input',
    PASSWORD_INPUT: 'Password input', 
    LOGIN_BUTTON: 'Log in to your account',
    GOOGLE_LOGIN_BUTTON: 'Continue with Google',
    LOADING_SPINNER: 'Loading, please wait',
  },
  LIVE_REGIONS: {
    POLITE: 'polite' as const,
    ASSERTIVE: 'assertive' as const,
  },
} as const;

// Security constants
export const SECURITY = {
  INPUT_VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MAX_EMAIL_LENGTH: 254,
  },
  RATE_LIMITING: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// Message constants - grouped for better tree-shaking
export const MESSAGES = {
  AUTH: {
    LOG_IN_BUTTON: 'Log In',
    LOGGING_IN: 'Logging In...',
    CONTINUE_WITH_GOOGLE: 'Continue with Google', 
    AUTHENTICATING: 'Authenticating...',
  },
  ERRORS: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    EMAIL_TOO_LONG: 'Email address is too long',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_TOO_LONG: 'Password is too long',
  },
  LOADING: {
    PROCESSING: 'Processing...',
    AUTHENTICATING: 'Authenticating...',
  },
} as const;