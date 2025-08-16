import React from "react";
import Image from "next/image";
import teamsBG from "@/public/image/teamsBG.webp";

const FixedBackgroundImage: React.FC = React.memo(() => {
  return (
    <>
      {/* Desktop Background */}
      <div
        className="fixed inset-0 z-[-10] pointer-events-none will-change-transform hidden md:block"
        style={{ transform: "translateZ(0)" }}
      >
        <Image
          src={teamsBG}
          alt="Teams Background - Desktop view showing team workspace"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
          quality={85}
        />
      </div>

      {/* Mobile Background */}
      <div
        className="fixed inset-0 z-[-10] pointer-events-none will-change-transform md:hidden"
        style={{
          transform: "translateZ(0)",
          minHeight: "100vh",
        }}
      >
        <Image
          src={teamsBG}
          alt="Teams Background - Mobile view showing team workspace"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          quality={75}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-[-9] bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
    </>
  );
});

FixedBackgroundImage.displayName = "FixedBackgroundImage";

export default FixedBackgroundImage;