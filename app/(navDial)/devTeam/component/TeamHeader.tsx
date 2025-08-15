import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";

const TeamHeader: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
    <div className="max-w-[1920px] mx-auto px-12 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src={logo}
            alt="Sphinx 25 Logo"
            width={64}
            height={64}
            className="object-cover"
            priority
          />
        </div>
        <Link 
          className="text-base font-medium tracking-[0.2em] text-white/90 hover:text-white transition-colors" 
          href="/"
        >
          SPHINX/25
        </Link>
      </div>
    </div>
  </header>
);

export default TeamHeader;