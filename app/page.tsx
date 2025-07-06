import Navbar from "./components/navbar";
import Image from "next/image";
import homeBG from "@/public/image/homeBG.webp"; 

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#0f1b1d] text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">PLACEHOLDER</h1>
          </div>
        </div>
      </div>
      <div className="relative h-screen w-screen overflow-hidden">
        <Image
          src={homeBG}
          alt="Background"
          fill
          loading="lazy"
          placeholder="blur"
          className="object-cover z-0"
          quality={60}
          sizes="100vw"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-20" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3fe0b2]">Text</h1>
            <h1> lorem ipsum</h1>
          </div>
        </div>
      </div>
    </main>
  );
}
