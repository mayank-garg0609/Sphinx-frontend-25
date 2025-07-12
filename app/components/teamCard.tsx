import Image from "next/image";
import type { StaticImageData } from "next/image";
import React from "react";

interface cardProps {
  id: number;
  title: string;
  subtitle: string;
  imageData: StaticImageData;
}

interface cardContentType {
  title: string;
  subtitle: string;
}

const CardContent: React.FC<cardContentType> = ({ title, subtitle }) => (
  <div className="text-center px-4 pt-4 space-y-1 min-h-[70px]">
    <h3 className="text-lg sm:text-xl font-semibold text-[#fdf5e6] tracking-wider">
      {title}
    </h3>
    <h4 className="text-sm sm:text-md font-medium text-[#e0c187] tracking-wide italic">
      {subtitle}
    </h4>
  </div>
);

const TeamsCard: React.FC<cardProps> = ({ title, subtitle, imageData }) => {
  return (
    <div className="relative group transition-all duration-300 w-full max-w-[300px] mx-auto min-h-[420px]">
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br from-yellow-900/20 via-orange-400/10 to-amber-100/10 z-0" />

      <div className="relative z-10 h-full w-full flex flex-col justify-between backdrop-blur-sm bg-[#2a1f14]/70 rounded-2xl p-5 border border-[#c6a96f]/30 shadow-md group-hover:shadow-[0_0_20px_2px_rgba(198,169,111,0.2)] transition-all duration-300 hover:scale-[1.02]">
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-xl border border-[#c6a96f]/20 bg-[#3a2b1b]/50 shadow-inner">
            <Image
              src={imageData}
              alt="Team image"
              width={300}
              height={300}
              loading="lazy"
              className="w-[300px] h-[300px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <CardContent title={title} subtitle={subtitle} />
      </div>
    </div>
  );
};

export default TeamsCard;
