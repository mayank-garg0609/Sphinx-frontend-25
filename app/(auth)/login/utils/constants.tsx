export const FORM_FIELDS = {
  email: {
    id: "email",
    type: "email" as const,
    placeholder: "example@email.com",
    label: "Email Address",
  },
  password: {
    id: "password",
    type: "password" as const,
    placeholder: "Enter your password",
    label: "Password",
  },
} as const;

export const BUTTON_STYLES = {
  primary:
    "w-full bg-white text-black font-semibold py-2 lg:py-3 rounded-lg hover:bg-gray-200 transition text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "w-full flex items-center justify-center border border-white text-white font-medium py-2 lg:py-3 rounded-lg hover:bg-white hover:text-black transition text-sm lg:text-base gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

export const MOBILE_STYLES = {
  container:
    "min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4 lg:px-4 px-6",
  backgroundImage: {
    desktop:
      "h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] 2xl:h-[840px] w-auto object-contain justify-start absolute bottom-0 left-12 sm:left-16 md:left-24 lg:left-32 xl:left-40 2xl:left-48 hidden lg:block",
    mobile: "absolute inset-0 w-full h-full object-cover lg:hidden",
  },
  form: "bg-black/40 backdrop-blur-md text-white p-6 lg:p-8 rounded-2xl lg:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-sm lg:max-w-md border border-white/30 space-y-4 lg:space-y-6 font-main lg:mr-36 mx-auto h-auto lg:h-[70vh] max-h-[85vh] overflow-y-auto",
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-8 lg:py-0",
} as const;

export const FORM_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const MAX_RETRIES = 3;
export const GOOGLE_POPUP_TIMEOUT = 30000;
