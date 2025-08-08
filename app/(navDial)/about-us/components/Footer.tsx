import React from "react";
import { Zap } from "lucide-react";

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="px-6 py-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            SPHINX
          </h3>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            SPHINX is MNIT Jaipur's annual cultural festival — a celebration
            of creativity, energy, and artistic excellence that brings
            students from across the nation together.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-6 text-white">
            Get In Touch
          </h4>
          <div className="space-y-3 text-zinc-400">
            <p className="hover:text-white transition-colors duration-300">
              3443 Oak Ridge Omaha, GA 45065
            </p>
            <p className="hover:text-white transition-colors duration-300">
              800-625-4125
            </p>
            <p className="hover:text-white transition-colors duration-300">
              402-245-7543
            </p>
            <p className="hover:text-white transition-colors duration-300">
              hello@digita.com
            </p>
          </div>
        </div>

        <div>
          <button className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-8 py-3 rounded-full font-bold transition-all duration-500 inline-flex items-center transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-yellow-400/25">
            Explore
            <Zap className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:rotate-12" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500">
        <p>Copyright © 2024 SPHINX | MNIT Jaipur</p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;