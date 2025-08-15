import { memo } from "react";
import Image from "next/image";

interface FormHeaderProps {
  logo: any;
}

export const FormHeader = memo<FormHeaderProps>(({ logo }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3 justify-center">
      <Image
        src={logo}
        alt="Sphinx Logo"
        width={32} // slightly smaller than text
        height={32}
        className=" animate-pulse rounded-full  sm:w-7 sm:h-7 lg:w-9 lg:h-9"
        placeholder="blur"
        blurDataURL={logo.blurDataURL}
        priority={true}
        quality={90}
      />
      <h1 className="text-3xl lg:text-4xl font-bold">Sphinx'25</h1>
    </div>

    <div className="text-center pt-2 sm:pt-4 lg:pt-0">
      <h2 className="text-xl lg:text-2xl font-bold leading-tight">
        CA Program Registration Form
      </h2>
    </div>
  </div>
));

FormHeader.displayName = "FormHeader";
