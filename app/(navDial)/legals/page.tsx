"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Lazy load icons to reduce initial bundle size
const Shield = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Shield })), {
  loading: () => <div className="w-5 h-5 bg-zinc-700 rounded animate-pulse" />
});
const FileText = dynamic(() => import("lucide-react").then(mod => ({ default: mod.FileText })), {
  loading: () => <div className="w-5 h-5 bg-zinc-700 rounded animate-pulse" />
});
const Lock = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Lock })), {
  loading: () => <div className="w-5 h-5 bg-zinc-700 rounded animate-pulse" />
});
const ChevronRight = dynamic(() => import("lucide-react").then(mod => ({ default: mod.ChevronRight })), {
  loading: () => <div className="w-4 h-4 bg-zinc-700 rounded animate-pulse" />
});

// Optimized interfaces with readonly for better performance
interface PolicyContent {
  readonly intro: string;
  readonly generalTerms: {
    readonly rightsAndResponsibilities: string;
    readonly redistribution: {
      readonly main: string;
      readonly subPoints: readonly string[];
    };
    readonly liabilityPolicies: string;
    readonly modificationTerms: {
      readonly points: readonly string[];
    };
  };
  readonly additionalLegalItems: readonly string[];
}

interface Policy {
  readonly title: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly content: PolicyContent;
  readonly description: string;
}

type PolicyKey = 'privacy' | 'terms' | 'cookies';

interface Policies {
  readonly [K in PolicyKey]: Policy;
}

// Memoized cursor component to prevent unnecessary re-renders
const FloatingCursor = React.memo(({ mousePosition }: { mousePosition: { x: number; y: number } }) => (
  <div
    className="fixed w-4 h-4 pointer-events-none z-50 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-sm transition-all duration-300"
    style={{
      left: mousePosition.x - 8,
      top: mousePosition.y - 8,
      transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
    }}
  />
));
FloatingCursor.displayName = 'FloatingCursor';

// Memoized policy button to prevent re-renders
const PolicyButton = React.memo(({ 
  policyKey, 
  policy, 
  isActive, 
  onSelect 
}: {
  policyKey: PolicyKey;
  policy: Policy;
  isActive: boolean;
  onSelect: (key: PolicyKey) => void;
}) => {
  const IconComponent = policy.icon;
  
  const handleClick = useCallback(() => {
    onSelect(policyKey);
  }, [policyKey, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={`w-full group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 text-left ${
        isActive
          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-white shadow-lg shadow-cyan-500/10"
          : "hover:bg-zinc-800/50 text-zinc-300 hover:text-white border border-transparent hover:border-zinc-700/50"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-cyan-400"
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div
            className={`font-semibold transition-colors duration-300 ${
              isActive
                ? "text-white"
                : "text-zinc-300 group-hover:text-white"
            }`}
          >
            {policy.title}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {policy.description}
          </div>
        </div>
      </div>
      <ChevronRight
        className={`w-4 h-4 transition-all duration-300 ${
          isActive
            ? "text-cyan-400 transform rotate-90"
            : "text-zinc-500 group-hover:text-zinc-400"
        }`}
      />
    </button>
  );
});
PolicyButton.displayName = 'PolicyButton';

// Memoized mobile policy selector
const MobilePolicySelector = React.memo(({ 
  policies, 
  selectedPolicy, 
  onPolicySelect 
}: {
  policies: Policies;
  selectedPolicy: PolicyKey;
  onPolicySelect: (key: PolicyKey) => void;
}) => (
  <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800/50 p-4">
    <div className="flex items-center justify-center">
      <div className="flex space-x-1 bg-zinc-900/50 rounded-xl p-1 border border-zinc-800/50">
        {Object.entries(policies).map(([key, policy]) => {
          const IconComponent = policy.icon;
          const isActive = selectedPolicy === key;

          return (
            <button
              key={key}
              onClick={() => onPolicySelect(key as PolicyKey)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {policy.title.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
));
MobilePolicySelector.displayName = 'MobilePolicySelector';

// Memoized content section to prevent unnecessary re-renders
const ContentSection = React.memo(({ 
  title, 
  children, 
  className = "" 
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`mb-12 md:mb-16 ${className}`}>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center">
      <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-3 md:mr-4"></span>
      {title}
    </h2>
    {children}
  </section>
));
ContentSection.displayName = 'ContentSection';

// Optimized policy content component
const PolicyContentItem = React.memo(({ 
  title, 
  content, 
  bulletColor = "cyan-400" 
}: {
  title: string;
  content: string | readonly string[];
  bulletColor?: string;
}) => {
  const titleColorClass = bulletColor === "purple-400" ? "text-purple-400" : "text-cyan-400";
  const dotColorClass = bulletColor === "purple-400" ? "bg-purple-400" : "bg-cyan-400";

  return (
    <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
      <h3 className={`text-lg md:text-xl font-semibold ${titleColorClass} mb-3 md:mb-4 flex items-center`}>
        <div className={`w-2 h-2 ${dotColorClass} rounded-full mr-3`}></div>
        {title}
      </h3>
      {typeof content === 'string' ? (
        <p className="text-zinc-300 leading-relaxed pl-4 md:pl-5 text-sm md:text-base">
          {content}
        </p>
      ) : (
        <ul className="space-y-3 pl-4 md:pl-5">
          {content.map((point, index) => (
            <li
              key={index}
              className="text-zinc-300 flex items-start text-sm md:text-base"
            >
              <span className={`w-1.5 h-1.5 ${dotColorClass} rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0`}></span>
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
PolicyContentItem.displayName = 'PolicyContentItem';

export default function LegalsPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyKey>("privacy");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Memoized policy selection handler
  const handlePolicySelect = useCallback((policyKey: PolicyKey) => {
    setSelectedPolicy(policyKey);
  }, []);

  // Optimized mount effect
  useEffect(() => {
    // Use requestAnimationFrame for smoother loading animation
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Throttled mouse move handler for better performance
  useEffect(() => {
    let rafId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Skip if animation frame is already queued
      
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Memoized policies data to prevent recreation on every render
  const policies: Policies = useMemo(() => ({
    privacy: {
      title: "Privacy Policy",
      icon: Shield,
      description: "Data protection & privacy",
      content: {
        intro:
          "This manual follows third-party trademark guidelines to ensure legal compliance. Use of trademarks requires adherence to the Agreement and proper attribution. Reach out to us for service to the highest Licensed Prices.",
        generalTerms: {
          rightsAndResponsibilities:
            "Code for Agreement should ensure rights to the Covered Code under this Agreement, and you are granted limited rights to use and distribute the code under specific conditions that assume all data associated with its use.",
          redistribution: {
            main: "Distribution within are closed to accordance with this Agreement, including adherence to the following:",
            subPoints: [
              "All derivative must prominently clearly distributed the original content.",
              "Redistribution must include all licensing forms to ensure transparency.",
            ] as const,
          },
          liabilityPolicies:
            "Liability policies are designed to ensure compliance with the Covered Code. The product is distributed 'as is,' and users assume all risks of use.",
          modificationTerms: {
            points: [
              "Acknowledge are clearly disclaimed.",
              "All instances of this content are included in either Source or Object form.",
              "No changes for this content be original authors and contributors.",
            ] as const,
          },
        },
        additionalLegalItems: [
          "Compliance with export regulations and local legal procedures is required.",
          "Unauthorized solicitation is strictly prohibited.",
          "Failure to adhere to these terms may result in legal action.",
        ] as const,
      },
    },
    terms: {
      title: "Terms of Service",
      icon: FileText,
      description: "Service terms & conditions",
      content: {
        intro:
          "These Terms of Service govern your use of NexaLaw services and establish the legal relationship between you and our platform.",
        generalTerms: {
          rightsAndResponsibilities:
            "Users are granted specific rights to access and use NexaLaw services subject to compliance with these terms and applicable laws.",
          redistribution: {
            main: "Content redistribution is subject to the following restrictions:",
            subPoints: [
              "Commercial use requires explicit written permission.",
              "Attribution must be maintained in all derivative works.",
            ] as const,
          },
          liabilityPolicies:
            "NexaLaw provides services 'as is' without warranties. Users assume responsibility for their use of the platform.",
          modificationTerms: {
            points: [
              "Terms may be updated with prior notice to users.",
              "Continued use constitutes acceptance of modifications.",
              "Users may terminate their account if they disagree with changes.",
            ] as const,
          },
        },
        additionalLegalItems: [
          "Account termination may occur for violations of these terms.",
          "Dispute resolution shall follow binding arbitration procedures.",
          "Governing law is determined by user jurisdiction.",
        ] as const,
      },
    },
    cookies: {
      title: "Cookie Policy",
      icon: Lock,
      description: "Cookie usage & preferences",
      content: {
        intro:
          "This Cookie Policy explains how NexaLaw uses cookies and similar technologies to enhance your browsing experience and improve our services.",
        generalTerms: {
          rightsAndResponsibilities:
            "We use cookies to provide, secure, and improve our services, including authentication, preferences, and analytics.",
          redistribution: {
            main: "Cookie data handling follows these principles:",
            subPoints: [
              "Essential cookies are required for basic functionality.",
              "Analytics cookies help us understand user behavior patterns.",
            ] as const,
          },
          liabilityPolicies:
            "Users can control cookie preferences through browser settings, though some functionality may be limited.",
          modificationTerms: {
            points: [
              "Cookie preferences can be updated anytime in settings.",
              "Third-party cookies are subject to their respective policies.",
              "We regularly review and update our cookie practices.",
            ] as const,
          },
        },
        additionalLegalItems: [
          "Cookie retention periods vary by type and purpose.",
          "Users have the right to withdraw consent for non-essential cookies.",
          "Regular audits ensure compliance with privacy regulations.",
        ] as const,
      },
    },
  }), []);

  // Memoized current policy to prevent object recreation
  const currentPolicy: Policy = useMemo(() => policies[selectedPolicy], [policies, selectedPolicy]);

  // Memoized formatted date to prevent recalculation
  const formattedDate = useMemo(() => 
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    []
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Floating cursor effect */}
      <FloatingCursor mousePosition={mousePosition} />

      {/* Background Effects - Will-change for better animation performance */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ willChange: 'transform' }}
        ></div>
        <div 
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ willChange: 'transform' }}
        ></div>
      </div>

      <div className="flex min-h-screen pt-20">
        {/* Sidebar Navigation - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block fixed left-10 top-15 bottom-0 w-80 bg-zinc-900/30 backdrop-blur-sm border-r border-zinc-800/50 z-30 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">
                Legal Documents
              </h2>
            </div>

            <nav className="space-y-2">
              {Object.entries(policies).map(([key, policy]) => (
                <PolicyButton
                  key={key}
                  policyKey={key as PolicyKey}
                  policy={policy}
                  isActive={selectedPolicy === key}
                  onSelect={handlePolicySelect}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Policy Selector */}
        <MobilePolicySelector
          policies={policies}
          selectedPolicy={selectedPolicy}
          onPolicySelect={handlePolicySelect}
        />

        {/* Main Content - Properly centered on desktop, full width on mobile */}
        <main className="w-full lg:flex lg:justify-center lg:items-start px-4 sm:px-6 lg:px-8 py-8 pt-32 lg:pt-8">
          <div className="w-full max-w-4xl lg:mx-auto">
            {/* Title Section */}
            <div className="mb-12 md:mb-16 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-400/30">
                  {React.createElement(currentPolicy.icon, { className: "w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" })}
                </div>
                <div className="text-center lg:text-left">
                  <h1
                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent transform transition-all duration-1000 ${
                      isLoaded
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {currentPolicy.title}
                  </h1>
                  <div className="text-zinc-400 text-sm mt-2">
                    Effective as of {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Intro Paragraph */}
              <div className="mb-8 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-zinc-900/30 to-zinc-800/30 rounded-xl border border-zinc-700/50">
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                  {currentPolicy.content.intro}
                </p>
              </div>

              {/* General Terms Section */}
              <ContentSection title="General Terms">
                <div className="space-y-6 md:space-y-8">
                  <PolicyContentItem
                    title="Rights and Responsibilities"
                    content={currentPolicy.content.generalTerms.rightsAndResponsibilities}
                  />

                  <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
                    <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3 md:mb-4 flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Redistribution
                    </h3>
                    <p className="text-zinc-300 leading-relaxed mb-4 pl-4 md:pl-5 text-sm md:text-base">
                      {currentPolicy.content.generalTerms.redistribution.main}
                    </p>
                    <ul className="space-y-3 pl-6 md:pl-8">
                      {currentPolicy.content.generalTerms.redistribution.subPoints.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="text-zinc-400 flex items-start text-sm md:text-base"
                          >
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0"></span>
                            {point}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <PolicyContentItem
                    title="Liability Policies"
                    content={currentPolicy.content.generalTerms.liabilityPolicies}
                  />

                  <PolicyContentItem
                    title="Modification Terms"
                    content={currentPolicy.content.generalTerms.modificationTerms.points}
                    bulletColor="purple-400"
                  />
                </div>
              </ContentSection>

              {/* Additional Legal Items Section */}
              <ContentSection title="Additional Legal Items">
                <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
                  <ul className="space-y-4">
                    {currentPolicy.content.additionalLegalItems.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-zinc-300 flex items-start leading-relaxed text-sm md:text-base"
                        >
                          <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0"></span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </ContentSection>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-t from-zinc-900/30 to-transparent border-t border-zinc-800/50 flex justify-center">
        <div className="w-full max-w-4xl text-center">
          <div className="text-zinc-500 text-sm">
            <p>© 2024 Sphinx. All rights reserved.</p>
            <p className="mt-2">
              For questions about these policies, please contact our legal team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}