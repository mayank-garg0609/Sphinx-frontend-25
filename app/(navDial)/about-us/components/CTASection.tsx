import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import CTAbg from "@/public/image/CTAbg.jpeg";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

const CTASection: React.FC = React.memo(() => {
  const router = useTransitionRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/", { onTransitionReady: slideInOut });
  };

  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-16 overflow-hidden shadow-2xl">
          <Image
            src={CTAbg}
            alt="CTA Background"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl"
            priority
          ></Image>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-zinc-500/5 rounded-full blur-2xl"></div>
          <div className="relative text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-12 leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Join the Technical Revolution at <br />
              <span className="text-yellow-400">SPHINX, MNIT Jaipur</span>
            </h2>
            <button
              className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-12 py-4 rounded-full font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/25 inline-flex items-center transform hover:scale-105 hover:-translate-y-1"
              onClick={handleClick}
            >
              Get Started
              <ChevronRight className="w-6 h-6 ml-3 transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
