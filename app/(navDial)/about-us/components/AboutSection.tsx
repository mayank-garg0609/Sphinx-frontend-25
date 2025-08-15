import React, { useMemo } from "react";
import { Camera, Play } from "lucide-react";
import { AboutSectionProps } from "../types/aboutUs";

const AboutSection: React.FC<AboutSectionProps> = React.memo(({ isLoaded }) => {
  const leftColumnClasses = useMemo(
    () =>
      `transform transition-all duration-1500 delay-300 ease-out ${
        isLoaded ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
      }`,
    [isLoaded]
  );

  const rightColumnClasses = useMemo(
    () =>
      `transform transition-all duration-1500 delay-700 ease-out ${
        isLoaded ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
      }`,
    [isLoaded]
  );

  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className={leftColumnClasses}>
          <div className="relative group">
            <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:shadow-yellow-500/10">
              <div className="w-full h-full bg-gradient-to-br from-yellow-900/10 to-transparent flex items-center justify-center relative">
                <div className="text-center p-8 transform transition-all duration-500 group-hover:scale-110">
                  <Camera className="w-20 h-20 text-yellow-400 mx-auto mb-6 transform transition-all duration-500 group-hover:rotate-12" />
                  <p className="text-zinc-300 text-lg font-medium">
                    Technical Festival
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              <Play className="w-10 h-10 text-black ml-1 font-bold" />
            </div>
          </div>
        </div>

        <div className={rightColumnClasses}>
          <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-6 font-bold">
            MNIT Jaipur
          </h3>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Celebrating Culture & Creativity <br />
            <span className="text-yellow-400">The Best</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light">
            SPHINX, MNIT Jaipur's crown jewel, is Rajasthan’s largest
            Techno-Management fest, attracting 60,000+ innovators and
            problem-solvers from IITs, NITs, and across India. By day, it drives
            breakthroughs with high-intensity Hackathons, Robowars, and
            cutting-edge challenges; by night, it captivates with icons like
            Mithoon and Jubin Nautiyal — a grand fusion of technology,
            creativity, and unforgettable experiences.
          </p>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
