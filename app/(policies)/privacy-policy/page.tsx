"use client";

import Image from "next/image";
import Link from "next/link";
import policyBG from "@/public/image/legalsBG.webp";
import { Home } from "lucide-react";
import { useMemo, memo } from "react";
import type { CSSProperties } from "react";

const SCROLL_STYLES: CSSProperties = {
  scrollbarWidth: "thin",
  scrollbarColor: "#6b7280 #1f2937",
} as const;

interface PolicySection {
  readonly title: string;
  readonly content: string;
}

const POLICY_SECTIONS: readonly PolicySection[] = [
  {
    title: "User Conduct",
    content:
      "You agree not to reverse engineer, hack, or disrupt any part of the Services. You must not interfere with usage by other users or access parts of the Services not intended for you.",
  },
  {
    title: "Prohibited Behavior",
    content:
      "Do not impersonate others, misrepresent yourself, solicit personal data, or attempt to harm, harass, or intimidate other users or staff.",
  },
  {
    title: "Security & Privacy",
    content:
      "You may not introduce malware, spyware, or other malicious software. Any attempt to compromise the platform's integrity will lead to access revocation.",
  },
  {
    title: "Information Disclosure",
    content:
      "Cognizance may disclose personal data when legally required or during investigations in cooperation with law enforcement.",
  },
] as const;

const CSS_CLASSES = {
  container: "absolute inset-0 z-10 flex items-center justify-center px-4",
  contentBox:
    "p-6 rounded-xl text-white max-w-4xl w-full max-h-[85vh] h-full flex flex-col backdrop-blur shadow-xl border border-white/20",
  title: "text-3xl font-bold mb-4 text-center",
  article:
    "overflow-y-auto flex-1 pr-3 text-sm leading-relaxed tracking-wide space-y-5 scroll-smooth",
  sectionTitle: "text-lg font-semibold mb-1",
  buttonContainer: "mt-6 text-center",
  button:
    "inline-flex items-center gap-2 px-5 py-2 border border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-md shadow-lg transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
  gradient:
    "absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-0",
} as const;

const PolicySectionComponent = memo(({ title, content }: PolicySection) => (
  <section>
    <h2 className={CSS_CLASSES.sectionTitle}>{title}</h2>
    <p>{content}</p>
  </section>
));

PolicySectionComponent.displayName = "PolicySectionComponent";

const PolicyContent = memo(() => {
  const renderedSections = useMemo(
    () =>
      POLICY_SECTIONS.map((section, index) => (
        <PolicySectionComponent
          key={`policy-section-${index}`}
          title={section.title}
          content={section.content}
        />
      )),
    []
  );

  return (
    <article className={CSS_CLASSES.article} style={SCROLL_STYLES}>
      {renderedSections}
    </article>
  );
});

PolicyContent.displayName = "PolicyContent";

const HomeButton = memo(() => (
  <Link href="/">
    <button
      type="button"
      className={CSS_CLASSES.button}
      aria-label="Return to Home"
    >
      <Home className="w-4 h-4" aria-hidden="true" />
      Return to Home
    </button>
  </Link>
));

HomeButton.displayName = "HomeButton";

const BackgroundLayer = memo(() => (
  <>
    <Image
      src={policyBG}
      alt="Privacy Policy Background"
      fill
      priority
      placeholder="blur"
      className="object-cover z-0"
      sizes="100vw"
    />
    <div className={CSS_CLASSES.gradient} />
  </>
));

BackgroundLayer.displayName = "BackgroundLayer";

export default function PrivacyPage() {
  const pageTitle = useMemo(() => "Privacy Policy", []);

  const containerClasses = useMemo(
    () => "relative h-screen w-screen overflow-hidden",
    []
  );

  return (
    <div className={containerClasses}>
      <BackgroundLayer />

      <div className={CSS_CLASSES.container}>
        <div className={CSS_CLASSES.contentBox}>
          <h1 className={CSS_CLASSES.title}>{pageTitle}</h1>

          <PolicyContent />

          <div className={CSS_CLASSES.buttonContainer}>
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
