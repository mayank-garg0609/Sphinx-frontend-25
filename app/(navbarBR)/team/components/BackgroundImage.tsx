import Image from "next/image";
import teamsBG from "@/public/image/teamsBG.webp";

export default function FixedBackgroundImage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none will-change-transform hidden md:block"
        style={{ transform: "translateZ(0)" }}
      >
        <Image
          src={teamsBG}
          alt="Teams Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div
        className="fixed inset-0 -z-10 pointer-events-none will-change-transform md:hidden"
        style={{
          transform: "translateZ(0)",
          minHeight: "100vh",
        }}
      >
        <Image
          src={teamsBG}
          alt="Teams Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
    </>
  );
}
