"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useMemo, useCallback, memo, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";
import { ReactLenis } from "@studio-freight/react-lenis";

type IconName =
  | "book"
  | "badge"
  | "users"
  | "share"
  | "star"
  | "userCheck"
  | "clipboard";

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

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  side: 'left' | 'right';
  color: string;
}

const iconPaths: Record<IconName, string> = {
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  badge:
    "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z m8.15 3.38l-3-3 1.41-1.42L12 8.17l4.59-4.58L18 4.99l-6 6z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 2017.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  userCheck:
    "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M16 11l2 2 4-4",
  clipboard:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
};

const applicants: Applicant[] = [
  {
    name: "Anurag Sharma",
    college: "IIT Delhi",
    experience:
      "Promoted 50+ events across campus, managed social media campaigns, and successfully coordinated with college administration for fest participation.",
    image: "/image/human.webp",
  },
  {
    name: "Aditya Jain",
    college: "Graphic Era University",
    experience:
      "Led promotional activities for technical events, built strong network with student clubs, and achieved 200+ registrations from campus.",
    image: "/image/human.webp",
  },
  {
    name: "Neha",
    college: "BITS Pilani",
    experience:
      "Organized workshops and seminars, coordinated with multiple departments, and created engaging content for fest promotion.",
    image: "/image/human.webp",
  },
  {
    name: "Kartik Garg",
    college: "VIT Vellore",
    experience:
      "Managed cross-college partnerships, developed promotional strategies, and facilitated participation from 15+ student societies.",
    image: "/image/human.webp",
  },
];

const faqs: FAQ[] = [
  {
    question: "Who can apply for the Campus Ambassador program?",
    answer:
      "Any undergraduate or postgraduate student currently enrolled in a recognized college or university in India can apply. We welcome students from all branches and years of study.",
  },
  {
    question: "What is the duration of the program?",
    answer:
      "The program runs for approximately 2-3 months, starting from the application period and continuing through the fest. Active promotion typically intensifies in the final month before Sphinx.",
  },
  {
    question: "Is this a paid opportunity?",
    answer:
      "While this is an unpaid volunteer role, it offers valuable incentives including certificates, exclusive merchandise, internship opportunities with our sponsors, and networking benefits that can enhance your career prospects.",
  },
  {
    question: "How will I be selected as a Campus Ambassador?",
    answer:
      "Selection is based on your application form, your enthusiasm for event promotion, communication skills, and your ability to engage with your college community. We also consider your past experience in organizing or promoting events.",
  },
  {
    question: "What kind of support will I receive from Team Sphinx?",
    answer:
      "You'll receive comprehensive promotional materials, regular guidance from our team, access to exclusive webinars, and direct communication channels with the organizing committee for any assistance you need.",
  },
];

const Icon = memo<IconProps>(
  ({ name, className = "text-purple-300", size = 18 }) => (
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
  )
);

Icon.displayName = "Icon";

const FAQItem = memo<{
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}>(({ faq, isOpen, onToggle }) => (
  <div className="rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200 border border-yellow-300/20 hover:border-yellow-300/40">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full px-3 sm:px-4 py-3 text-sm sm:text-base font-medium text-white text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 rounded-lg"
      aria-expanded={isOpen}
    >
      <span className="drop-shadow-sm pr-2">{faq.question}</span>
      <svg
        className={`w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 transform transition-transform duration-200 flex-shrink-0 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {isOpen && (
      <div className="px-3 sm:px-4 pb-3 pt-1 text-sm sm:text-base text-gray-200 leading-relaxed">
        {faq.answer}
      </div>
    )}
  </div>
));

FAQItem.displayName = "FAQItem";

const AmbassadorCard = memo<{ applicant: Applicant }>(({ applicant }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-black/50 via-black/40 to-transparent backdrop-blur-md rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl hover:shadow-yellow-300/20 transition-all duration-300 hover:scale-105 border border-yellow-300/20 hover:border-yellow-300/40">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-yellow-300/40 group-hover:border-yellow-300 transition-colors duration-300 shadow-lg">
        <Image
          src={applicant.image}
          alt={applicant.name}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
          quality={60}
        />
      </div>
      <div className="text-center text-base sm:text-lg font-bold text-white mb-1 drop-shadow-lg">
        {applicant.name}
      </div>
      <div className="text-center text-xs sm:text-sm text-yellow-300 mb-2 sm:mb-3 font-medium">
        {applicant.college}
      </div>
      <div className="text-xs sm:text-sm text-center text-gray-200 leading-relaxed line-clamp-4">
        {applicant.experience}
      </div>
    </div>
  </div>
));

AmbassadorCard.displayName = "AmbassadorCard";

const PerksSection = memo(() => (
  <section className="mb-6 sm:mb-8">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
      What You'll Get
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="book" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Free courses & workshops access
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="badge" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Official internship certificate
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="users" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Sponsor internship opportunities
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="share" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Professional networking & endorsements
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="star" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Monthly recognition & shoutouts
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="userCheck" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Letter of recommendation
        </span>
      </div>
    </div>
  </section>
));

PerksSection.displayName = "PerksSection";

const ResponsibilitiesSection = memo(() => (
  <section className="mb-6 sm:mb-8">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
      Your Role & Responsibilities
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="clipboard" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Promote Sphinx events and workshops across your campus
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="clipboard" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Serve as the official Sphinx representative at your institution
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="clipboard" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Coordinate with college administration and student clubs
        </span>
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-md shadow-lg hover:bg-black/50 transition-all duration-200">
        <Icon name="clipboard" className="text-yellow-300 mt-1 flex-shrink-0" size={18} />
        <span className="text-sm lg:text-base text-gray-100">
          Build and share relevant student networks for maximum reach
        </span>
      </div>
    </div>
  </section>
));

ResponsibilitiesSection.displayName = "ResponsibilitiesSection";

export default function CaProgram() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const router = useTransitionRouter();
  const lenisRef = useRef(null);
  const particleIdRef = useRef(0);
  const lastScrollY = useRef(0);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const createParticle = useCallback((scrollVelocity: number): Particle => {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const colors = ['#fbbf24', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    
    return {
      id: particleIdRef.current++,
      x: side === 'left' ? -10 : window.innerWidth + 10,
      y: Math.random() * window.innerHeight,
      vx: side === 'left' ? 
        2 + Math.abs(scrollVelocity) * 0.1 : 
        -2 - Math.abs(scrollVelocity) * 0.1,
      vy: (Math.random() - 0.5) * 2 + scrollVelocity * 0.05,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: 180 + Math.random() * 120,
      side,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, []);

  const updateParticles = useCallback((scrollY: number) => {
    const scrollVelocity = scrollY - lastScrollY.current;
    lastScrollY.current = scrollY;

    setParticles(prev => {
      let newParticles = [...prev];

      // Add new particles based on scroll velocity
      if (Math.abs(scrollVelocity) > 2) {
        const numNewParticles = Math.min(Math.floor(Math.abs(scrollVelocity) / 5), 3);
        for (let i = 0; i < numNewParticles; i++) {
          newParticles.push(createParticle(scrollVelocity));
        }
      }

      // Update existing particles
      newParticles = newParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life + 1,
        opacity: particle.opacity * (1 - particle.life / particle.maxLife),
        vy: particle.vy * 0.98 // Add some drag
      }));

      // Remove dead particles or those that went off screen
      return newParticles.filter(particle => 
        particle.life < particle.maxLife && 
        particle.x > -50 && 
        particle.x < window.innerWidth + 50 &&
        particle.y > -50 && 
        particle.y < window.innerHeight + 50
      );
    });
  }, [createParticle]);

  const faqItems = useMemo(
    () =>
      faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggleFAQ(index)}
        />
      )),
    [openIndex, toggleFAQ]
  );

  const ambassadorCards = useMemo(
    () =>
      applicants.map((applicant, index) => (
        <AmbassadorCard key={index} applicant={applicant} />
      )),
    []
  );

  useEffect(() => {
    const canvas = document.getElementById("fluid-bg") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouse = { x: w / 2, y: h / 2 };

    if (!canvas || !ctx) return;

    const updateCanvasSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    updateCanvasSize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      updateCanvasSize();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, Math.min(w, h) / 1.5
      );
      grad.addColorStop(0, "rgba(20, 20, 50, 0.8)");
      grad.addColorStop(0.3, "rgba(50, 10, 40, 0.5)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Scroll listener for particles
  useEffect(() => {
    const handleScroll = () => {
      updateParticles(window.scrollY);
    };

    const handleWheel = (e: WheelEvent) => {
      // Create particles on wheel scroll
      const scrollVelocity = e.deltaY * 0.1;
      updateParticles(window.scrollY + scrollVelocity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [updateParticles]);

  return (
    <ReactLenis root ref={lenisRef}>
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Fluid interactive background */}
        <canvas
          id="fluid-bg"
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ touchAction: 'none' }}
        />

        {/* Scroll particles */}
        <div className="fixed inset-0 pointer-events-none z-20">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
                transform: `scale(${1 - particle.life / particle.maxLife})`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide leading-tight text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow-2xl px-2">
                Campus Ambassador Program
              </h1>
              <p className="text-gray-100 text-sm xs:text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto drop-shadow-lg px-2">
                Join our nationwide network of student leaders and become the
                voice of{" "}
                <span className="text-yellow-300 font-semibold">Sphinx</span> at
                your campus
              </p>
            </div>

            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
              {/* About Section */}
              <section className="bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-300 drop-shadow-lg">
                  About the Program
                </h2>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-100">
                  <p>
                    <span className="text-yellow-300 font-semibold">
                      Sphinx
                    </span>
                    , MNIT Jaipur's flagship technical festival, brings together
                    thousands of students from across India. Our Campus
                    Ambassador Program (CAP) is the backbone of this nationwide
                    reach, connecting passionate students who help promote and
                    coordinate fest activities at their respective institutions.
                  </p>
                  <p>
                    As a Campus Ambassador, you'll work directly with Team
                    Sphinx, gaining invaluable experience in event management,
                    marketing, and leadership while building connections that
                    last beyond college.
                  </p>
                </div>
              </section>

              <PerksSection />
              <ResponsibilitiesSection />

              {/* Ambassadors Showcase */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-yellow-300 drop-shadow-lg text-center">
                  Meet Our Top Ambassadors
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {ambassadorCards}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-yellow-300 drop-shadow-lg text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-2 sm:space-y-3 max-w-4xl mx-auto">{faqItems}</div>
              </section>

              {/* Call to Action Info */}
              <section className="bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl text-center border border-yellow-300/20">
                <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 drop-shadow-lg">
                  Ready to Make an Impact?
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto">
                  Join hundreds of students who are already making a difference
                  at their campuses. Applications are reviewed on a rolling
                  basis, so apply early to secure your spot!
                </p>

                {/* Apply Button */}
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/caProgram/register", {
                      onTransitionReady: slideInOut,
                    });
                  }}
                  href="/caProgram/register"
                  className="inline-block"
                >
                  <button className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm sm:text-base border border-yellow-400">
                    Apply Now →
                  </button>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}