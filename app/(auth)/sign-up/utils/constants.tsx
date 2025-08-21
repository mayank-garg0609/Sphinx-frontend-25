// app/(auth)/sign-up/utils/constants.tsx (Updated with OTP support)
export interface FormField {
  readonly id: string;
  readonly type: "email" | "password" | "text";
  readonly placeholder: string;
  readonly label: string;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
}

export const FORM_FIELDS: Record<
  "name" | "email" | "password" | "confirmPassword",
  FormField
> = {
  name: {
    id: "name",
    type: "text",
    placeholder: "Enter your full name",
    label: "Full Name",
    required: true,
    autoComplete: "name",
    minLength: 2,
    maxLength: 50,
  },
  email: {
    id: "email",
    type: "email",
    placeholder: "example@email.com",
    label: "Email Address",
    required: true,
    autoComplete: "email",
    maxLength: 254, // RFC 5321 limit
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
  },
  password: {
    id: "password",
    type: "password",
    placeholder: "Create a strong password",
    label: "Password",
    required: true,
    autoComplete: "new-password",
    minLength: 8,
    maxLength: 128,
  },
  confirmPassword: {
    id: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    label: "Confirm Password",
    required: true,
    autoComplete: "new-password",
    minLength: 8,
    maxLength: 128,
  },
} as const;

export const BUTTON_STYLES = {
  primary:
    "w-full bg-white text-black font-semibold py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "w-full flex items-center justify-center border border-white text-white font-medium py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "w-full bg-red-600 text-white font-semibold py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

export const FORM_STYLES = {
  container:
    "bg-black/40 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl border border-white/30 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 font-sans lg:mr-8 xl:mr-16 2xl:mr-24 mx-auto h-auto lg:h-auto xl:h-auto 2xl:h-auto max-h-[90vh] sm:max-h-[85vh] md:max-h-[85vh] lg:max-h-[85vh] xl:max-h-[90vh] 2xl:max-h-[90vh] overflow-y-auto",
  scrollbar: {
    scrollbarWidth: "thin" as const,
    scrollbarColor: "#cbd5e1 #2d2d2d",
  },
} as const;

export const MOBILE_STYLES = {
  container:
    "min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4 lg:px-4 px-6",
  backgroundImage: {
    desktop:
      "h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[750px] 2xl:h-[800px] 3xl:h-[900px] w-auto object-contain absolute bottom-0 left-6 sm:left-8 md:left-12 lg:left-16 xl:left-24 2xl:left-32 3xl:left-40 hidden lg:block",
    mobile: "object-cover lg:hidden",
  },
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-8 lg:py-0",
} as const;

export const ACCESSIBILITY = {
  ARIA_LABELS: {
    SIGNUP_FORM: "Sign up form",
    NAME_INPUT: "Full name input",
    EMAIL_INPUT: "Email address input",
    PASSWORD_INPUT: "Password input",
    CONFIRM_PASSWORD_INPUT: "Confirm password input",
    SIGNUP_BUTTON: "Create your account",
    GOOGLE_SIGNUP_BUTTON: "Continue with Google",
    LOGIN_LINK: "Go to login page",
    LOADING_SPINNER: "Loading, please wait",
    ERROR_MESSAGE: "Error message",
    TERMS_CHECKBOX: "Terms and conditions agreement",
    OTP_INPUT: "OTP verification input",
    VERIFY_OTP_BUTTON: "Verify OTP code",
    RESEND_OTP_BUTTON: "Resend OTP code",
    BACK_TO_SIGNUP_BUTTON: "Go back to sign up form",
  },
  LIVE_REGIONS: {
    POLITE: "polite" as const,
    ASSERTIVE: "assertive" as const,
  },
} as const;

export const SECURITY = {
  INPUT_VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MAX_EMAIL_LENGTH: 254,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    OTP_LENGTH: 6,
    OTP_REGEX: /^\d{6}$/,
  },
  RATE_LIMITING: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
  PASSWORD_STRENGTH: {
    WEAK_SCORE: 2,
    MEDIUM_SCORE: 3,
    STRONG_SCORE: 4,
  },
  OTP: {
    RESEND_COOLDOWN: 60, // seconds
    MAX_ATTEMPTS: 5,
    EXPIRY_TIME: 10 * 60 * 1000, // 10 minutes
  },
} as const;

export const MESSAGES = {
  AUTH: {
    CREATE_ACCOUNT: "Create Your Account",
    SIGNUP_SUBTITLE: "Join Sphinx'25",
    SIGNUP_BUTTON: "Sign Up",
    CREATING_ACCOUNT: "Creating Account...",
    CONTINUE_WITH_GOOGLE: "Continue with Google",
    AUTHENTICATING: "Authenticating...",
    LOGIN_PROMPT: "Already have an account?",
    LOGIN_LINK: "Log In",
    TERMS_AGREEMENT: "I agree to the Terms and Conditions",
  },
  OTP: {
    VERIFY_EMAIL: "Verify Your Email",
    OTP_SENT: "Enter the 6-digit code sent to your email",
    VERIFY_BUTTON: "Verify OTP",
    VERIFYING: "Verifying...",
    RESEND_BUTTON: "Resend OTP",
    SENDING: "Sending...",
    BACK_TO_SIGNUP: "← Back to Sign Up",
    ENTER_COMPLETE_OTP: "Please enter complete 6-digit OTP",
    INVALID_OTP_FORMAT: "OTP must be a 6-digit number",
  },
  SUCCESS: {
    SIGNUP_SUCCESS: "✅ Account created successfully!",
    GOOGLE_SIGNUP_SUCCESS: "✅ Account created successfully with Google!",
    OTP_SENT: "OTP sent successfully to your email",
    OTP_VERIFIED: "✅ OTP verified successfully!",
    EMAIL_VERIFIED: "Email verified successfully!",
    ACCOUNT_VERIFIED: "Account Verified Successfully!",
    REDIRECTING: "Redirecting to complete your profile...",
  },
  ERRORS: {
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    EMAIL_TOO_LONG: "Email address is too long",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    PASSWORD_TOO_LONG: "Password is too long",
    PASSWORDS_DONT_MATCH: "Passwords do not match",
    NAME_TOO_SHORT: "Name must be at least 2 characters",
    NAME_TOO_LONG: "Name is too long",
    TERMS_NOT_AGREED: "You must agree to the terms and conditions",
    GENERIC_ERROR: "Something went wrong. Please try again.",
    USER_EXISTS: "An account with this email already exists. Please log in instead.",
    
    // OTP specific errors
    OTP_INVALID: "Invalid or expired OTP",
    OTP_EXPIRED: "OTP has expired. Please request a new one.",
    OTP_TOO_MANY_ATTEMPTS: "Too many failed attempts. Please request a new OTP.",
    OTP_SEND_FAILED: "Failed to send OTP. Please try again.",
    OTP_VERIFY_FAILED: "Failed to verify OTP. Please try again.",
    USER_NOT_FOUND: "User not found. Please sign up first.",
    USER_ALREADY_VERIFIED: "User already verified",
    USER_DETAILS_INCOMPLETE: "User details not complete",
    AUTH_TOKEN_REQUIRED: "Authentication required. Please sign up first.",
    OTP_RESEND_TOO_SOON: "Please wait before requesting another OTP",
  },
  LOADING: {
    PLEASE_WAIT: "Please wait...",
    PROCESSING: "Processing...",
    AUTHENTICATING: "Authenticating...",
    CREATING_ACCOUNT: "Creating account...",
    SENDING_OTP: "Sending OTP...",
    VERIFYING_OTP: "Verifying OTP...",
    SENDING: "Sending...",
    VERIFYING: "Verifying...",
  },
  PASSWORD_STRENGTH: {
    WEAK: "Password Strength: Weak",
    MEDIUM: "Password Strength: Medium",
    STRONG: "Password Strength: Strong",
    TOO_SHORT: "Password is too short (minimum 8 characters)",
  },
  OTP_COUNTDOWN: {
    RESEND_IN: "Resend in {seconds}s",
    CAN_RESEND: "Resend OTP",
  },
} as const;

export const THEME = {
  COLORS: {
    PRIMARY: "#ffffff",
    SECONDARY: "#000000",
    SUCCESS: "#10b981",
    ERROR: "#ef4444",
    WARNING: "#f59e0b",
    INFO: "#3b82f6",
    BACKGROUND: "rgba(0, 0, 0, 0.4)",
    BORDER: "rgba(255, 255, 255, 0.3)",
    TEXT_PRIMARY: "#ffffff",
    TEXT_SECONDARY: "#d1d5db",
    TEXT_MUTED: "#9ca3af",
    OTP_INPUT_FOCUS: "rgba(255, 255, 255, 0.8)",
    OTP_INPUT_ERROR: "#ef4444",
  },
  SHADOWS: {
    FORM: "0 8px 32px 0 rgba(255, 255, 255, 0.3)",
    BUTTON: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    INPUT_FOCUS: "0 0 0 2px rgba(255, 255, 255, 0.5)",
    OTP_INPUT_FOCUS: "0 0 0 2px rgba(255, 255, 255, 0.8)",
  },
  TRANSITIONS: {
    DEFAULT: "all 0.2s ease",
    SLOW: "all 0.3s ease",
    FAST: "all 0.15s ease",
    OTP_INPUT: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
} as const;

export const BREAKPOINTS = {
  XS: "320px",
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  "2XL": "1536px",
  "3XL": "1920px",
} as const;

export const ANIMATIONS = {
  DURATIONS: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
    OTP_INPUT_TRANSITION: 150,
  },
  EASING: {
    EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
    EASE_OUT: "cubic-bezier(0, 0, 0.2, 1)",
    EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// OTP specific configurations
export const OTP_CONFIG = {
  LENGTH: 6,
  RESEND_COOLDOWN: 60, // seconds
  MAX_ATTEMPTS: 5,
  PASTE_DETECTION: true,
  AUTO_FOCUS_NEXT: true,
  AUTO_SUBMIT_ON_COMPLETE: false, // Set to true if you want auto-submit
} as const;