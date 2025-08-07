"use client";
import React, { useState, useEffect } from "react";
import { Shield, FileText, Lock, ChevronRight } from "lucide-react";

interface PolicyContent {
  intro: string;
  generalTerms: {
    rightsAndResponsibilities: string;
    redistribution: {
      main: string;
      subPoints: string[];
    };
    liabilityPolicies: string;
    modificationTerms: {
      points: string[];
    };
  };
  additionalLegalItems: string[];
}

interface Policy {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: PolicyContent;
}

interface Policies {
  [key: string]: Policy;
}

export default function LegalsPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<string>("privacy");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handlePolicySelect = (policyKey: string) => {
    setSelectedPolicy(policyKey);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const policies: Policies = {
    privacy: {
      title: "Privacy Policy",
      icon: Shield,
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
            ],
          },
          liabilityPolicies:
            "Liability policies are designed to ensure compliance with the Covered Code. The product is distributed 'as is,' and users assume all risks of use.",
          modificationTerms: {
            points: [
              "Acknowledge are clearly disclaimed.",
              "All instances of this content are included in either Source or Object form.",
              "No changes for this content be original authors and contributors.",
            ],
          },
        },
        additionalLegalItems: [
          "Compliance with export regulations and local legal procedures is required.",
          "Unauthorized solicitation is strictly prohibited.",
          "Failure to adhere to these terms may result in legal action.",
        ],
      },
    },
    terms: {
      title: "Terms of Service",
      icon: FileText,
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
            ],
          },
          liabilityPolicies:
            "NexaLaw provides services 'as is' without warranties. Users assume responsibility for their use of the platform.",
          modificationTerms: {
            points: [
              "Terms may be updated with prior notice to users.",
              "Continued use constitutes acceptance of modifications.",
              "Users may terminate their account if they disagree with changes.",
            ],
          },
        },
        additionalLegalItems: [
          "Account termination may occur for violations of these terms.",
          "Dispute resolution shall follow binding arbitration procedures.",
          "Governing law is determined by user jurisdiction.",
        ],
      },
    },
    cookies: {
      title: "Cookie Policy",
      icon: Lock,
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
            ],
          },
          liabilityPolicies:
            "Users can control cookie preferences through browser settings, though some functionality may be limited.",
          modificationTerms: {
            points: [
              "Cookie preferences can be updated anytime in settings.",
              "Third-party cookies are subject to their respective policies.",
              "We regularly review and update our cookie practices.",
            ],
          },
        },
        additionalLegalItems: [
          "Cookie retention periods vary by type and purpose.",
          "Users have the right to withdraw consent for non-essential cookies.",
          "Regular audits ensure compliance with privacy regulations.",
        ],
      },
    },
  };

  const currentPolicy: Policy = policies[selectedPolicy];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Floating cursor effect */}
      <div
        className="fixed w-4 h-4 pointer-events-none z-50 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-sm transition-all duration-300"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      ></div>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex min-h-screen pt-20">
        {/* Sidebar Navigation - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block fixed left-5 top-20 bottom-0 w-80 bg-zinc-900/30 backdrop-blur-sm border-r border-zinc-800/50 z-30 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">
                Legal Documents
              </h2>
            </div>

            <nav className="space-y-2">
              {Object.entries(policies).map(([key, policy]) => {
                const IconComponent = policy.icon;
                const isActive = selectedPolicy === key;

                return (
                  <button
                    key={key}
                    onClick={() => handlePolicySelect(key)}
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
                          {key === "privacy" && "Data protection & privacy"}
                          {key === "terms" && "Service terms & conditions"}
                          {key === "cookies" && "Cookie usage & preferences"}
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
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Policy Selector */}
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-800/50 p-4">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 bg-zinc-900/50 rounded-xl p-1 border border-zinc-800/50">
              {Object.entries(policies).map(([key, policy]) => {
                const IconComponent = policy.icon;
                const isActive = selectedPolicy === key;

                return (
                  <button
                    key={key}
                    onClick={() => handlePolicySelect(key)}
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

        {/* Main Content - Centered and responsive */}
        <main className="w-full lg:ml-80 px-4 sm:px-6 lg:px-8 py-8 pt-32 lg:pt-8 flex justify-center">
          <div className="w-full max-w-4xl">
            {/* Title Section */}
            <div className="mb-12 md:mb-16 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-400/30">
                  <currentPolicy.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <div className="text-center lg:text-left">
                  <h1
                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent transform transition-all duration-1000 ${
                      isLoaded
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    {currentPolicy.title}
                  </h1>
                  <div className="text-zinc-400 text-sm mt-2">
                    Effective as of{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
            >
              {/* Intro Paragraph */}
              <div className="mb-8 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-zinc-900/30 to-zinc-800/30 rounded-xl border border-zinc-700/50">
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                  {currentPolicy.content.intro}
                </p>
              </div>

              {/* General Terms Section */}
              <section className="mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center">
                  <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-3 md:mr-4"></span>
                  General Terms
                </h2>

                <div className="space-y-6 md:space-y-8">
                  {/* Rights and Responsibilities */}
                  <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
                    <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3 md:mb-4 flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Rights and Responsibilities
                    </h3>
                    <p className="text-zinc-300 leading-relaxed pl-4 md:pl-5 text-sm md:text-base">
                      {
                        currentPolicy.content.generalTerms
                          .rightsAndResponsibilities
                      }
                    </p>
                  </div>

                  {/* Redistribution */}
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

                  {/* Liability Policies */}
                  <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
                    <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3 md:mb-4 flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Liability Policies
                    </h3>
                    <p className="text-zinc-300 leading-relaxed pl-4 md:pl-5 text-sm md:text-base">
                      {currentPolicy.content.generalTerms.liabilityPolicies}
                    </p>
                  </div>

                  {/* Modification Terms */}
                  <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
                    <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3 md:mb-4 flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      Modification Terms
                    </h3>
                    <ul className="space-y-3 pl-4 md:pl-5">
                      {currentPolicy.content.generalTerms.modificationTerms.points.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="text-zinc-300 flex items-start text-sm md:text-base"
                          >
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0"></span>
                            {point}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Additional Legal Items Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center">
                  <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-3 md:mr-4"></span>
                  Additional Legal Items
                </h2>
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
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full lg:ml-80 px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-t from-zinc-900/30 to-transparent border-t border-zinc-800/50 flex justify-center">
        <div className="w-full max-w-4xl text-center">
          <div className="text-zinc-500 text-sm">
            <p>© 2024 Sphinx. All rights reserved.</p>
            <p className="mt-2">
              For questions about these policies, please contact our legal team.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Custom scrollbar for sidebar */
        aside::-webkit-scrollbar {
          width: 4px;
        }

        aside::-webkit-scrollbar-track {
          background: transparent;
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 2px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  );
}
