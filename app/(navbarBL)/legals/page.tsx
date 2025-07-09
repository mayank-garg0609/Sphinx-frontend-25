"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useCallback, memo } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/app/animations/pageTrans";

type ContentItem = {
  heading: string;
  text: string;
};

type LegalSection = {
  title: string;
  icon: string;
  content: ContentItem[];
};

const LEGAL_SECTIONS: Record<string, LegalSection> = {
  privacy: {
    title: "Privacy Policy",
    icon: "shield",
    content: [
      {
        heading: "Information Collection",
        text: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.",
      },
      {
        heading: "Use of Information",
        text: "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.",
      },
      {
        heading: "Information Sharing",
        text: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
      },
      {
        heading: "Data Security",
        text: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
      },
      {
        heading: "Cookies",
        text: "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    icon: "refresh",
    content: [
      {
        heading: "Refund Eligibility",
        text: "Refunds are available within 30 days of purchase for digital products and 14 days for physical products, subject to our terms and conditions.",
      },
      {
        heading: "Refund Process",
        text: "To request a refund, contact our support team with your order number and reason for the refund request. We will process eligible refunds within 5-10 business days.",
      },
      {
        heading: "Non-Refundable Items",
        text: "Certain items are non-refundable, including personalized products, downloadable software, and services that have been fully rendered.",
      },
      {
        heading: "Partial Refunds",
        text: "In some cases, partial refunds may be granted for damaged or defective items, or when only part of an order is eligible for return.",
      },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    icon: "file",
    content: [
      {
        heading: "User Conduct",
        text: "You agree not to reverse engineer, hack, or disrupt any part of the Services. You must not interfere with usage by other users or access parts of the Services not intended for you.",
      },
      {
        heading: "Prohibited Behavior",
        text: "Do not impersonate others, misrepresent yourself, solicit personal data, or attempt to harm, harass, or intimidate other users or staff.",
      },
      {
        heading: "Security & Privacy",
        text: "You may not introduce malware, spyware, or other malicious software. Any attempt to compromise the platform's integrity will lead to access revocation.",
      },
      {
        heading: "Information Disclosure",
        text: "Cognizance may disclose personal data when legally required or during investigations in cooperation with law enforcement.",
      },
      {
        heading: "Service Availability",
        text: "We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.",
      },
    ],
  },
};

const SECTION_KEYS = Object.keys(LEGAL_SECTIONS);

const iconStyles = {
  base: "w-5 h-5 text-white/90 flex-shrink-0",
  shield: "relative",
  refresh: "relative",
  file: "relative",
  home: "relative",
  chevron: "relative transition-transform",
};

const getIconPath = (iconType: string): string => {
  const paths = {
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    refresh:
      "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
    file: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z",
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0-11l7 7-7-7m7 7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    chevron: "M6 9l6 6 6-6",
  };
  return paths[iconType as keyof typeof paths] || paths.file;
};

const CSSIcon = memo(
  ({
    type,
    className,
    rotate = false,
  }: {
    type: string;
    className?: string;
    rotate?: boolean;
  }) => (
    <svg
      className={`${iconStyles.base} ${className || ""} ${
        rotate ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={getIconPath(type)}
      />
    </svg>
  )
);

CSSIcon.displayName = "CSSIcon";

const ContentSection = memo(({ content }: { content: ContentItem[] }) => (
  <div className="space-y-5">
    {content.map((section, index) => (
      <section key={index}>
        <h3 className="text-lg font-semibold mb-2 text-white/90">
          {section.heading}
        </h3>
        <p className="text-white/80 leading-relaxed">{section.text}</p>
      </section>
    ))}
  </div>
));

ContentSection.displayName = "ContentSection";

const NavButton = memo(
  ({
    section,
    isActive,
    onClick,
  }: {
    section: string;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const sectionData = LEGAL_SECTIONS[section];

    return (
      <button
        onClick={onClick}
        className={`
        w-full p-4 rounded-lg transition-all duration-200 text-left
        border border-white/20 backdrop-blur-sm
        hover:bg-white/10 hover:border-white/30
        focus:outline-none focus:ring-2 focus:ring-white/50
        ${isActive ? "bg-white/20 border-white/40 shadow-lg" : "bg-white/5"}
      `}
      >
        <div className="flex items-center gap-3">
          <CSSIcon type={sectionData.icon} />
          <span className="font-medium text-white/90">{sectionData.title}</span>
          <CSSIcon
            type="chevron"
            className="w-4 h-4 text-white/60 ml-auto"
            rotate={isActive}
          />
        </div>
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

const MobileDropdown = memo(
  ({
    activeSection,
    onSectionChange,
    isOpen,
    onToggle,
  }: {
    activeSection: string;
    onSectionChange: (section: string) => void;
    isOpen: boolean;
    onToggle: () => void;
  }) => {
    const activeSectionData = LEGAL_SECTIONS[activeSection];

    return (
      <div className="relative ">
        <button
          onClick={onToggle}
          className="w-full p-4 rounded-lg transition-all duration-200 text-left
        border border-black/20 backdrop-blur-sm bg-black/30
        hover:bg-black/40 hover:border-black/30
        focus:outline-none focus:ring-2 focus:ring-black/50"
        >
          <div className="flex items-center gap-3">
            <CSSIcon type={activeSectionData.icon} />
            <span className="font-medium text-white/90">
              {activeSectionData.title}
            </span>
            <CSSIcon
              type="chevron"
              className="w-4 h-4 text-white/60 ml-auto"
              rotate={isOpen}
            />
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 
    backdrop-blur-lg bg-black/80 rounded-lg border border-black/20 
    shadow-xl overflow-hidden z-[9999]"
          >
            {SECTION_KEYS.map((section) => {
              const sectionData = LEGAL_SECTIONS[section];
              const isActive = activeSection === section;

              return (
                <button
                  key={section}
                  onClick={() => {
                    onSectionChange(section);
                    onToggle();
                  }}
                  className={`
                  w-full p-4 text-left transition-all duration-200 z-20
                  hover:bg-black/10 focus:outline-none focus:bg-white/10 
                  ${isActive ? "bg-black/15" : ""}
                  ${
                    section !== SECTION_KEYS[SECTION_KEYS.length - 1]
                      ? "border-b border-black/10"
                      : ""
                  }
                `}
                >
                  <div className="flex items-center gap-3">
                    <CSSIcon type={sectionData.icon} />
                    <span className="font-medium text-white/90">
                      {sectionData.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

MobileDropdown.displayName = "MobileDropdown";
const HomeButton = memo(() => {
  const router = useTransitionRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/", { onTransitionReady: slideInOut });
  };

  return (
    <div className="mt-4 text-center">
      <Link href="/" onClick={handleClick}>
        <button className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 border border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-md shadow-lg transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm lg:text-base">
          <CSSIcon type="home" className="w-4 h-4" />
          Return to Home
        </button>
      </Link>
    </div>
  );
});

HomeButton.displayName = "HomeButton";

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState<string>("privacy");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSectionClick = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const activeContent = useMemo(
    () => LEGAL_SECTIONS[activeSection],
    [activeSection]
  );

  const navigationButtons = useMemo(
    () =>
      SECTION_KEYS.map((section) => (
        <NavButton
          key={section}
          section={section}
          isActive={activeSection === section}
          onClick={() => handleSectionClick(section)}
        />
      )),
    [activeSection, handleSectionClick]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image
        src="/image/legalsBG.webp"
        alt="Legal page background"
        fill
        priority
        className="object-cover object-left lg:object-center z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end px-4 lg:px-4">
        <div className="w-full max-w-sm lg:max-w-6xl h-full max-h-[90vh] flex flex-col lg:flex-row gap-4 lg:gap-6 mt-16 lg:mt-24 lg:mr-24">
          <div className="w-full lg:w-1/3 h-auto lg:h-1/3 flex flex-col">
            <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-xl p-4 lg:p-6 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 text-center">
                Legal Information
              </h1>

              <div className="lg:hidden">
                <MobileDropdown
                  activeSection={activeSection}
                  onSectionChange={handleSectionClick}
                  isOpen={isDropdownOpen}
                  onToggle={handleDropdownToggle}
                />
              </div>

              <nav className="hidden lg:block space-y-4">
                {navigationButtons}
              </nav>
            </div>

            <HomeButton />
          </div>

          <div className="w-full lg:w-2/3 h-[60vh] lg:h-[80vh] flex flex-col z-10">
            <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-xl p-4 lg:p-6 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <CSSIcon
                  type={activeContent.icon}
                  className="w-5 h-5 lg:w-6 lg:h-6"
                />
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {activeContent.title}
                </h2>
              </div>

              <div className="h-full overflow-y-auto pr-2 lg:pr-3 text-sm leading-relaxed tracking-wide scroll-smooth scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
                <ContentSection content={activeContent.content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
