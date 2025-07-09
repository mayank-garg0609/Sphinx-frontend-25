"use client";

import Image from "next/image";
import Link from "next/link";
import caProgramBG from "@/public/image/caBG.webp";
import { useState, useMemo, useCallback, memo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

type IconName = "book" | "badge" | "users" | "share" | "star" | "userCheck" | "clipboard";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

interface Applicant {
  name: string;
  college: string;
  experience: string;
  image: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const iconPaths: Record<IconName, string> = {
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  badge: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z m8.15 3.38l-3-3 1.41-1.42L12 8.17l4.59-4.58L18 4.99l-6 6z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 2017.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  userCheck: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M16 11l2 2 4-4",
  clipboard: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
};

const applicants: Applicant[] = [
  {
    name: "Anurag Sharma",
    college: "IIT Delhi",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lectus tincidunt, venenatis ex vitae, maximus purus. Mauris auctor eget diam in suscipit.",
    image: "/image/human.webp"
  },
  {
    name: "Aditya Jain",
    college: "Graphic Era University",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lectus tincidunt, venenatis ex vitae, maximus purus. Mauris auctor eget diam in suscipit.",
    image: "/image/human.webp"
  },
  {
    name: "Neha",
    college: "BITS Pilani",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lectus tincidunt, venenatis ex vitae, maximus purus. Mauris auctor eget diam in suscipit.",
    image: "/image/human.webp"
  },
  {
    name: "Kartik Garg",
    college: "VIT Vellore",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lectus tincidunt, venenatis ex vitae, maximus purus. Mauris auctor eget diam in suscipit.",
    image: "/image/human.webp"
  }
];

const faqs: FAQ[] = [
  {
    question: "Who can apply for the Campus Ambassador program?",
    answer: "Any student currently enrolled in a college/university in India is eligible to apply."
  },
  {
    question: "What is the duration of the program?",
    answer: "The program typically runs for 1-2 months leading up to the Sphinx Fest."
  },
  {
    question: "Is it a paid opportunity?",
    answer: "This is an unpaid role, but offers multiple incentives like certificates, merchandise, and internships."
  },
  {
    question: "How will I be selected?",
    answer: "Selection is based on your application and enthusiasm to promote the fest in your college."
  }
];

const Icon = memo<IconProps>(({ name, className = "text-purple-300", size = 18 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={iconPaths[name]} />
  </svg>
));

Icon.displayName = "Icon";

const FAQItem = memo<{
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}>(({ faq, isOpen, onToggle }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-colors duration-200">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-white text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 rounded-lg"
      aria-expanded={isOpen}
    >
      <span>{faq.question}</span>
      <svg
        className={`w-4 h-4 text-purple-300 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-3 pb-2 pt-1 sm:px-4 sm:pb-3 text-sm text-purple-200 leading-relaxed">
        {faq.answer}
      </div>
    )}
  </div>
));

FAQItem.displayName = "FAQItem";

const AmbassadorCard = memo<{ applicant: Applicant }>(({ applicant }) => (
  <div className="w-[180px] lg:w-[200px] flex-shrink-0 bg-white/10 border border-white/10 rounded-xl p-3 lg:p-4 backdrop-blur-md text-white shadow-md">
    <div className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2 rounded-full overflow-hidden border border-white/20">
      <Image
        src={applicant.image}
        alt={applicant.name}
        fill
        className="object-cover"
        loading="lazy"
        sizes="(max-width: 1024px) 64px, 80px"
        quality={60}
      />
    </div>
    <div className="text-center text-sm font-semibold">{applicant.name}</div>
    <div className="text-center text-xs text-purple-300">{applicant.college}</div>
    <div className="mt-1 text-xs text-center text-zinc-200 line-clamp-3">
      {applicant.experience}
    </div>
  </div>
));

AmbassadorCard.displayName = "AmbassadorCard";

const PerksSection = memo(() => (
  <section>
    <h2 className="text-lg font-semibold mb-1 underline underline-offset-4">
      Perks & Incentives
    </h2>
    <ul className="list-none space-y-2">
      <li className="flex items-start gap-2">
        <Icon name="book" /> Access to free courses, workshops, and merchandise
      </li>
      <li className="flex items-start gap-2">
        <Icon name="badge" /> PR Internship Certificate from Sphinx, MNIT Jaipur
      </li>
      <li className="flex items-start gap-2">
        <Icon name="users" /> Internship opportunities with our sponsors
      </li>
      <li className="flex items-start gap-2">
        <Icon name="share" /> Networking and LinkedIn endorsements
      </li>
      <li className="flex items-start gap-2">
        <Icon name="star" /> Monthly shoutouts and recognitions
      </li>
      <li className="flex items-start gap-2">
        <Icon name="userCheck" /> Letter of Recommendation (performance-based)
      </li>
    </ul>
  </section>
));

PerksSection.displayName = "PerksSection";

const ResponsibilitiesSection = memo(() => (
  <section>
    <h2 className="text-lg font-semibrel mb-1 underline underline-offset-4">
      Responsibilities
    </h2>
    <ul className="list-none space-y-2">
      <li className="flex items-start gap-2">
        <Icon name="clipboard" /> Promote Sphinx in your college
      </li>
      <li className="flex items-start gap-2">
        <Icon name="clipboard" /> Act as our representative in your institution
      </li>
      <li className="flex items-start gap-2">
        <Icon name="clipboard" /> Liaise with college administration and clubs
      </li>
      <li className="flex items-start gap-2">
        <Icon name="clipboard" /> Share relevant student networks/databases
      </li>
    </ul>
  </section>
));

ResponsibilitiesSection.displayName = "ResponsibilitiesSection";

export default function CaProgram() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
    const router = useTransitionRouter();

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  const faqItems = useMemo(() => 
    faqs.map((faq, index) => (
      <FAQItem
        key={index}
        faq={faq}
        isOpen={openIndex === index}
        onToggle={() => toggleFAQ(index)}
      />
    )), [openIndex, toggleFAQ]);

  const ambassadorCards = useMemo(() => 
    applicants.map((applicant, index) => (
      <AmbassadorCard key={index} applicant={applicant} />
    )), []);

  return (
    
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={caProgramBG}
          alt="Campus Ambassador Program Background"
          fill
          priority
          className="object-cover lg:object-center object-[center_right] scale-110 lg:scale-100"
          quality={80}
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20 lg:from-black/80 lg:via-black/60 lg:to-transparent z-1" />

      <div className="relative z-10 min-h-screen flex items-center justify-center lg:justify-start">
        <div className="w-full max-w-sm mx-4 lg:ml-6 xl:ml-10 lg:max-w-2xl xl:max-w-3xl p-4 lg:p-6 xl:p-8 rounded-2xl text-purple-300 bg-white/10 backdrop-blur-lg border border-white/10 shadow-2xl">
          
          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide leading-tight text-white mb-4 lg:mb-6 text-center lg:text-left">
            Campus Ambassador Program
          </div>

          <div className="overflow-y-auto max-h-[60vh] lg:max-h-[70vh] pr-2 lg:pr-3 space-y-4 lg:space-y-6 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800">
            
                        <section>
              <p className="text-center lg:text-left">
                As Campus Ambassadors (CAs), our student partners act as an extension of Team Sphinx, 
                helping promote our fest and expand its reach across campuses nationwide.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 underline underline-offset-4 text-center lg:text-left">
                About the Program
              </h2>
              <p className="text-center lg:text-left">
                MNIT Jaipur's annual technical fest, <span className="text-purple-300 font-semibold">Sphinx</span>, 
                garners participation from colleges across the country. To coordinate this, Team Sphinx runs the{" "}
                <span className="font-semibold">Campus Ambassador Programme (CAP)</span>, selecting students 
                from each college to represent the fest. These ambassadors help organize and manage promotional 
                activities at their institutions in collaboration with Team Cognizance. In return, they gain 
                direct exposure to the organizing team, along with exclusive perks and recognitions.
              </p>
            </section>

            <PerksSection />
            <ResponsibilitiesSection />

            <section className="hidden sm:block">
              <h2 className="text-lg font-semibold mb-2 underline underline-offset-4">
                Meet Our Top Ambassadors
              </h2>
              <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
                {ambassadorCards}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 underline underline-offset-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqItems}
              </div>
            </section>
          </div>

          <div className="flex justify-center mt-4 lg:mt-6">
            <Link onClick={(e)=>{
              e.preventDefault();
              router.push("/caProgram/register" ,{onTransitionReady:slideInOut})
            }}
            href="/caProgram/register" className="inline-block">
              <button className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg backdrop-blur-sm font-medium">
                Apply Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}