"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col justify-center items-center font-mono px-4">
      <div
        className="flex items-center gap-3 text-neon-pink mb-4"
        aria-label="Error Icon"
        role="img"
      >
        <Terminal className="w-6 h-6 animate-pulse" />
        <span className="text-md uppercase tracking-widest">System Error</span>
      </div>

      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text drop-shadow-md animate-glow">
        404
      </h1>

      <h2 className="text-2xl mt-4 text-gray-400">
        Page not found in the system matrix.
      </h2>
      <p className="text-sm text-gray-500 mt-2 text-center max-w-xl">
        The page you're looking for was either deleted, lost in cyberspace, or never existed in this reality.
      </p>

      <Link href="/" className="mt-8" passHref>
        <button
          className="px-6 py-2 border border-neon-pink text-neon-pink rounded hover:bg-neon-pink hover:text-black transition duration-300"
          aria-label="Return to homepage"
        >
          Return to Mainframe
        </button>
      </Link>
    </main>
  );
}
