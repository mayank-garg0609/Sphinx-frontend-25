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
        className="h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] 2xl:h-[840px] w-auto object-contain absolute bottom-0 left-12 sm:left-16 md:left-24 lg:left-32 xl:left-40 2xl:left-48 hidden lg:block"
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
