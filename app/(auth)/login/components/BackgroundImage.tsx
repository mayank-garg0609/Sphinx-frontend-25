import Image from "next/image";
import { memo } from "react";
import ascended from "@/public/image/ascended.webp";

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      <Image
        src={ascended}
        alt=""
        placeholder="blur"
        className="h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[750px] 2xl:h-[800px] 3xl:h-[900px] w-auto object-contain absolute bottom-0 left-6 sm:left-8 md:left-12 lg:left-16 xl:left-24 2xl:left-32 3xl:left-40 hidden lg:block"
        priority
        sizes="(min-width: 1024px) 50vw, 0px"
      />

      <Image
        src={ascended}
        alt=""
        placeholder="blur"
        fill
        className="object-cover lg:hidden"
        priority
        sizes="100vw"
      />
    </>
  );
});