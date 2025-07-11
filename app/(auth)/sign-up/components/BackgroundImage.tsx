// components/BackgroundImage.tsx
import { memo } from "react";
import Image from "next/image";
import ascended from "@/public/image/ascended.webp";
import { MOBILE_STYLES } from "../utils/constants";

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className={MOBILE_STYLES.backgroundImage.desktop}
        priority
      />

      <Image
        src={ascended}
        alt="ascended human image"
        placeholder="blur"
        blurDataURL={ascended.blurDataURL}
        className={MOBILE_STYLES.backgroundImage.mobile}
        priority
        fill
      />
    </>
  );
});