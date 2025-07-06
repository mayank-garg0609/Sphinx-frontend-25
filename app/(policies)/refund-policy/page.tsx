"use client";

import Image from "next/image";
import Link from "next/link";
import policyBG from "@/public/image/legalsBG.webp";
import { useTransitionRouter } from "next-view-transitions";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function RefundPage() {
  const router = useTransitionRouter();

  function slideInOut() {
    document.documentElement.animate(
      [
        { opacity: 1, transform: "translateY(0%)" },
        { opacity: 0.2, transform: "translateY(-50%)" },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100% 100% 100% 100% 100% 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100% 100% 100% 100% 0% 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative h-screen w-screen overflow-hidden"
    >
      <Image
        src={policyBG}
        alt="Background"
        fill
        priority
        placeholder="blur"
        className="object-cover z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div className="p-6 rounded-xl text-white max-w-4xl w-full max-h-[85vh] h-full flex flex-col backdrop-blur shadow-xl border border-white/20">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Refund Policy
          </h1>

          <article
            className="overflow-y-auto flex-1 pr-3 text-sm leading-relaxed tracking-wide space-y-5 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#6b7280 #1f2937",
            }}
          >
            <section>
              <h2 className="text-lg font-semibold mb-1">User Conduct</h2>
              <p>
                You agree not to reverse engineer, hack, or disrupt any part of
                the Services. You must not interfere with usage by other users
                or access parts of the Services not intended for you.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1">Prohibited Behavior</h2>
              <p>
                Do not impersonate others, misrepresent yourself, solicit
                personal data, or attempt to harm, harass, or intimidate other
                users or staff.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1">Security & Privacy</h2>
              <p>
                You may not introduce malware, spyware, or other malicious
                software. Any attempt to compromise the platform’s integrity
                will lead to access revocation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1">Information Disclosure</h2>
              <p>
                Cognizance may disclose personal data when legally required or
                during investigations in cooperation with law enforcement.
              </p>
            </section>
          </article>

          <div className="mt-6 text-center">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (document.startViewTransition) {
                  document
                    .startViewTransition(() => {
                      router.push("/");
                    })
                    .ready.then(() => {
                      slideInOut();
                    });
                } else {
                  router.push("/");
                }
              }}
            >
              <button className="inline-flex items-center gap-2 px-5 py-2 border border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-md shadow-lg transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                <Home className="w-4 h-4" />
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
