import { memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/app/schemas/registerSchema";
import { FORM_FIELDS } from "../utils/constants";
import { formClasses, buttonClasses } from "../utils/constants";
import { useRegistration } from "../hooks/useRegistrations";
import { FormField } from "./FormField";
import { LoadingSpinner } from "./LoadingSpinner";
import { FormHeader } from "./FormHeader";
import {useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
interface RegistrationFormProps {
  logo: any;
}

export const RegistrationForm = memo<RegistrationFormProps>(({ logo }) => {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleRegistration } = useRegistration(reset);

  const memoizedFormFields = useMemo(
    () =>
      FORM_FIELDS.map((field) => (
        <FormField
          key={field.key}
          field={field}
          register={register}
          error={errors[field.key]}
        />
      )),
    [register, errors]
  );

  return (
    <form
      onSubmit={handleSubmit(handleRegistration)}
      className={formClasses}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #2d2d2d",
        position: "relative",
        zIndex: 10,
        isolation: "isolate",
      }}
    >
      <div className="flex flex-col gap-3 mt-2">
        <FormHeader logo={logo} />

        <div className="space-y-4 pt-1">{memoizedFormFields}</div>

        <div className="space-y-3 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonClasses}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Registering...
              </span>
            ) : (
              "Update your Profile"
            )}
          </button>
          {redirectedFrom === "/sign-up" && (
            <button
              type="button"
              className="w-full mt-2 text-md text-blue-500 underline hover:text-blue-700 transition"
              onClick={() => router.push("/" , {onTransitionReady:slideInOut})}
            >
              SKip for now
            </button>
          )}
        </div>
      </div>
    </form>
  );
});

RegistrationForm.displayName = "RegistrationForm";
