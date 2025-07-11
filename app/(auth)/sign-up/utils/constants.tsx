export const FORM_FIELDS = {
  name: {
    id: "name" as const,
    type: "text" as const,
    placeholder: "John Doe",
    label: "Full Name",
  },
  email: {
    id: "email" as const,
    type: "email" as const,
    placeholder: "example@email.com",
    label: "Email Address",
  },
  password: {
    id: "password" as const,
    type: "password" as const,
    placeholder: "Enter a secure password",
    label: "Password",
  },
  confirmPassword: {
    id: "confirmPassword" as const,
    type: "password" as const,
    placeholder: "Re-enter password",
    label: "Confirm Password",
  },
} as const;

export const BUTTON_STYLES = {
  primary:
    "w-full bg-white text-black font-semibold py-2 lg:py-2 py-3 rounded-lg hover:bg-gray-200 transition text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "w-full flex items-center justify-center border border-white text-white font-medium py-2 lg:py-2 py-3 rounded-lg hover:bg-white hover:text-black transition text-sm lg:text-base gap-2",
} as const;

export const FORM_CONTAINER_STYLES = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: "#cbd5e1 #2d2d2d",
} as const;

export const MOBILE_STYLES = {
  container:
    "min-h-screen w-full flex bg-black bg-cover bg-center bg-no-repeat px-4 lg:px-4 px-6",
  backgroundImage: {
    desktop:
      "h-[840px] w-auto object-contain justify-start absolute bottom-0 left-48 hidden lg:block",
    mobile: "absolute inset-0 w-full h-full object-cover lg:hidden",
  },
  form: "bg-black/40 backdrop-blur-md text-white p-6 lg:p-8 rounded-2xl lg:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] w-full max-w-sm lg:max-w-md border border-white/30 space-y-4 lg:space-y-6 font-main lg:mr-36 mx-auto h-full lg:h-[86vh] max-h-[100vh] overflow-y-auto",
  formWrapper:
    "relative z-10 flex justify-center lg:justify-end w-full items-center min-h-screen py-6 lg:py-0",
} as const;

export const MAX_RETRIES = 3;
export const GOOGLE_POPUP_TIMEOUT = 30000;
export const AUTH_SUCCESS_DELAY = 500;