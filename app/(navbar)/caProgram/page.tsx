"use client";

import Image from "next/image";
import Link from "next/link";
import caProgramBG from "@/public/image/caBG.webp";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  Users,
  Share2,
  Star,
  UserCheck,
  ClipboardList,
} from "lucide-react";

export default function CaProgram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative h-screen w-screen overflow-hidden"
    >
      <Image
        src={caProgramBG}
        alt="Background"
        fill
        priority
        placeholder="blur"
        className="object-cover z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-start">
        <div className="ml-6 md:ml-10 p-6 md:p-8 rounded-2xl text-purple-300 max-w-6xl w-full md:w-[70%] lg:w-[50%] xl:w-[40%] h-[85%] flex flex-col bg-white/10 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden space-y-6">
          <div className="text-3xl md:text-4xl font-bold tracking-wide leading-snug text-white">
            Campus Ambassador Program
          </div>

          <div className="overflow-y-auto flex-1 pr-3 space-y-6 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800">
            <section>
              <p>
                As Campus Ambassadors (CAs), our student partners act as an
                extension of Team Sphinx, helping promote our fest and expand
                its reach across campuses nationwide.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 underline underline-offset-4">
                About the Program
              </h2>
              <p>
                NIT Jaipur's annual technical fest,{" "}
                <span className="text-purple-300 font-semibold">Sphinx</span>,
                garners participation from colleges across the country. To
                coordinate this, Team Sphinx runs the{" "}
                <span className="font-semibold">
                  Campus Ambassador Programme (CAP)
                </span>
                , selecting students from each college to represent the fest.
                These ambassadors help organize and manage promotional
                activities at their institutions in collaboration with Team
                Cognizance. In return, they gain direct exposure to the
                organizing team, along with exclusive perks and recognitions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 underline underline-offset-4">
                Perks & Incentives
              </h2>
              <ul className="list-none space-y-2">
                <li className="flex items-start gap-2">
                  <BookOpen className="text-purple-300" size={18} /> Access to
                  free courses, workshops, and merchandise
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="text-purple-300" size={18} /> PR
                  Internship Certificate from Sphinx, MNIT Jaipur
                </li>
                <li className="flex items-start gap-2">
                  <Users className="text-purple-300" size={18} /> Internship
                  opportunities with our sponsors
                </li>
                <li className="flex items-start gap-2">
                  <Share2 className="text-purple-300" size={18} /> Networking
                  and LinkedIn endorsements
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-purple-300" size={18} /> Monthly
                  shoutouts and recognitions
                </li>
                <li className="flex items-start gap-2">
                  <UserCheck className="text-purple-300" size={18} /> Letter of
                  Recommendation (performance-based)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-1 underline underline-offset-4">
                Responsibilities
              </h2>
              <ul className="list-none space-y-2">
                <li className="flex items-start gap-2">
                  <ClipboardList className="text-purple-300" size={18} />{" "}
                  Promote Sphinx in your college
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardList className="text-purple-300" size={18} /> Act as
                  our representative in your institution
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardList className="text-purple-300" size={18} /> Liaise
                  with college administration and clubs
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardList className="text-purple-300" size={18} /> Share
                  relevant student networks/databases
                </li>
              </ul>
            </section>
          </div>

          <div className="flex justify-center">
            <Link href="/caProgram/register-ca">
              <button className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition duration-200 shadow-lg backdrop-blur-sm">
                Register for CA
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
