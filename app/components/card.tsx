import Image from "next/image";
import type { StaticImageData } from "next/image";
import React from "react";
import eventImage from "@/public/image/legalsBG.webp";

interface cardProps {
  id: number;
  title: string;
  description: string;
  prizes_worth: string;
  isCenter?: boolean;
  imageData: StaticImageData;
}
interface cardContentType {
  title: string;
  description: string;
  prizes_worth: string;
}

const CardContent: React.FC<cardContentType> = ({
  title,
  description,
  prizes_worth,
}) => (
  <div className="text-center px-4 py-5 rounded-lg  space-y-3">
    <h3 className="text-xl font-bold text-white">{title}</h3>

    <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>

    <div className="flex items-center justify-center">
      <span className="text-xs text-white font-medium px-4 py-1 rounded-full">
        Prizes Worth: {prizes_worth}
      </span>
    </div>
  </div>
);

const Card: React.FC<cardProps> = ({
  title,
  description,
  prizes_worth,
  isCenter = false,
  imageData,
}) => {
  return (
    <div
      className={`relative group transition-transform duration-300 h-[75h] w-[35vh] ${
        isCenter ? "scale-110 z-10" : "z-0"
      }`}
    >
      <div className="absolute inset-0 rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300 bg-gradient-to-br from-purple-700/30 via-pink-500/30 to-indigo-600/30" />

      <div className="relative h-full w-full flex flex-col justify-between backdrop-blur-sm bg-zinc-950/35 rounded-xl p-6 border border-white/20 shadow-xl hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 ">
        <div className="flex justify-center ">
          <div className="p-2 rounded-xl border border-purple-400/50 bg-black/30 shadow-[0_0_12px_rgba(192,132,252,0.6)] hover:shadow-[0_0_24px_rgba(192,132,252,0.8)] transition-shadow duration-300">
            <Image
              src={imageData}
              alt="Event image"
              width={300}
              height={400}
              loading="lazy"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="flex-grow" />

        <CardContent
          title={title}
          description={description}
          prizes_worth={prizes_worth}
        />
      </div>
    </div>
  );
};



export default Card;
