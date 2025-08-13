export interface FormField {
  readonly id: string;
  readonly type: 'email' | 'password' | 'text';
  readonly placeholder: string;
  readonly label: string;
  readonly required?: boolean;
}

export const FORM_FIELDS: Record<'name' | 'email' | 'password' | 'confirmPassword', FormField> = {
  name: {
    id: 'name',
    type: 'text',
    placeholder: 'John Doe',
    label: 'Full Name',
    required: true,
  },
  email: {
    id: 'email',
    type: 'email',
    placeholder: 'example@email.com',
    label: 'Email Address',
    required: true,
  },
  password: {
    id: 'password',
    type: 'password',
    placeholder: 'Enter a secure password',
    label: 'Password',
    required: true,
  },
  confirmPassword: {
    id: 'confirmPassword',
    type: 'password',
    placeholder: 'Re-enter password',
    label: 'Confirm Password',
    required: true,
  },
} as const;

export const BUTTON_STYLES = {
  primary:
    'w-full bg-white text-black font-semibold py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'w-full flex items-center justify-center border border-white text-white font-medium py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

export const FORM_STYLES = {
  container:
    'bg-black/40 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl border border-white/30 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 font-sans lg:mr-8 xl:mr-16 2xl:mr-24 mx-auto h-auto lg:h-auto xl:h-auto 2xl:h-auto max-h-[90vh] sm:max-h-[85vh] md:max-h-[85vh] lg:max-h-[85vh] xl:max-h-[90vh] 2xl:max-h-[90vh] overflow-y-auto',
  scrollbar: {
    scrollbarWidth: 'thin' as const,
    scrollbarColor: '#cbd5e1 #2d2d2d',
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
  form: "bg-black/40 backdrop-blur-md text-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl border border-white/30 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 font-sans lg:mr-8 xl:mr-16 2xl:mr-24 mx-auto h-auto lg:h-auto xl:h-auto 2xl:h-auto max-h-[90vh] sm:max-h-[85vh] md:max-h-[85vh] lg:max-h-[85vh] xl:max-h-[90vh] 2xl:max-h-[90vh] overflow-y-auto",
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-8 lg:py-0",
} as const;

export const FORM_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

export const MAX_RETRIES = 3;
export const GOOGLE_POPUP_TIMEOUT = 30000;
export const AUTH_SUCCESS_DELAY = 500;
