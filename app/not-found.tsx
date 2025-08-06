"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col justify-center items-center font-mono px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-900 to-black opacity-20 animate-pulse-slow z-0" />

      <div
        className="flex items-center gap-3 text-emerald-400 mb-4 z-10"
        aria-label="Multiverse Error Icon"
        role="img"
      >
        <Terminal className="w-6 h-6 animate-ping-slow text-emerald-400" />
        <span className="text-md uppercase tracking-widest">
          Multiverse Breach
        </span>
      </div>

      <h1 className="text-8xl font-extrabold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 text-transparent bg-clip-text drop-shadow-lg animate-glow z-10">
        404
      </h1>

      <h2 className="text-2xl mt-4 text-emerald-200 z-10">
        This timeline does not contain the page you seek.
      </h2>
      <p className="text-sm text-zinc-400 mt-3 text-center max-w-xl z-10">
        You've slipped into a fractured universe where this page never existed.
        Perhaps it was consumed by a wormhole, or lost during a timeline shift.
      </p>

      <Link href="/" className="mt-8 z-10" passHref>
        <button
          className="px-6 py-2 border border-emerald-500 text-emerald-400 rounded hover:bg-emerald-500 hover:text-black transition duration-300 shadow-lg shadow-emerald-500/30"
          aria-label="Return to Prime Universe"
        >
          Return to Home
        </button>
      </Link>

      <div className="absolute w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full animate-pulse-slow -z-10" />
    </main>
  );
}
