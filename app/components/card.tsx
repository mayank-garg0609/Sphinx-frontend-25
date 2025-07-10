import Image from "next/image";
import type { StaticImageData } from "next/image";
import React from "react";
import eventImage from "@/public/image/human.webp";

interface cardProps {
  id: number;
  title: string;
  description: string;
  prizes_worth: string;
  isCenter?: boolean;
  imageData: StaticImageData;
}

const cards: cardProps[] = [
  {
    id: 1,
    title: "Meshmerize",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    imageData: eventImage,
  },
  {
    id: 2,
    title: "CosmClench",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    isCenter: true,
    imageData: eventImage,
  },
  {
    id: 3,
    title: "CoDecode",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac fermentum metus. Pellentesque diam lorem, consequat at maximus eget, tempus vel erat.",
    prizes_worth: "$100000",
    imageData: eventImage,
  },
];

const CardContent: React.FC<{
  title: string;
  description: string;
  prizes_worth: string;
}> = ({ title, description, prizes_worth }) => (
  <div className="text-center px-4 py-5 rounded-lg border border-purple-500/30 bg-black/20 space-y-3">
    <h3 className="text-xl font-bold text-white">{title}</h3>

    <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>

    <div className="flex items-center justify-center">
      <span className="text-xs text-white font-medium px-4 py-1 rounded-full border border-fuchsia-500/50 bg-black/30">
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
      className={`relative group transition-transform duration-300 h-full ${
        isCenter ? "scale-110 z-10" : "z-0"
      }`}
    >
      <div className="absolute inset-0 rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300 bg-gradient-to-br from-purple-700/30 via-pink-500/30 to-indigo-600/30" />

      <div className="relative h-full w-full flex flex-col justify-between backdrop-blur-sm bg-black/40 rounded-xl p-6 border border-white/20 shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
        <div className="flex justify-center">
          <div className="p-2 rounded-xl border border-purple-400/50 bg-black/30">
            <Image
              src={imageData}
              alt="Event image"
              width={300}
              height={300}
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

const CardLayout: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl mx-auto">
          {cards.map((card) => (
            <div key={card.id} className="w-full max-w-[320px] h-[480px] gap-6">
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CardLayout;
