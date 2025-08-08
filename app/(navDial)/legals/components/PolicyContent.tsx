import React, { memo } from 'react';
import { PolicySection, PolicySubSection } from './PolicySection';
import type { PolicyContent as PolicyContentType } from '../types/legal';

interface PolicyContentProps {
  readonly content: PolicyContentType;
  readonly isLoaded: boolean;
}

export const PolicyContent: React.FC<PolicyContentProps> = memo(({ content, isLoaded }) => (
  <div
    className={`transform transition-all duration-1000 delay-300 ${
      isLoaded
        ? "translate-y-0 opacity-100"
        : "translate-y-8 opacity-0"
    }`}
  >
    
    <div className="mb-8 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-zinc-900/30 to-zinc-800/30 rounded-xl border border-zinc-700/50">
      <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
        {content.intro}
      </p>
    </div>

    <PolicySection title="General Terms">
      
      <div className="space-y-6 md:space-y-8">
        <PolicySubSection title="Rights and Responsibilities">
          <p className="text-zinc-300 leading-relaxed pl-4 md:pl-5 text-sm md:text-base">
            {content.generalTerms.rightsAndResponsibilities}
          </p>
        </PolicySubSection>

        <PolicySubSection title="Redistribution">
          <p className="text-zinc-300 leading-relaxed mb-4 pl-4 md:pl-5 text-sm md:text-base">
            {content.generalTerms.redistribution.main}
          </p>
          <ul className="space-y-3 pl-6 md:pl-8">
            {content.generalTerms.redistribution.subPoints.map((point, index) => (
              <li
                key={index}
                className="text-zinc-400 flex items-start text-sm md:text-base"
              >
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </PolicySubSection>

        <PolicySubSection title="Liability Policies">
          <p className="text-zinc-300 leading-relaxed pl-4 md:pl-5 text-sm md:text-base">
            {content.generalTerms.liabilityPolicies}
          </p>
        </PolicySubSection>

        <PolicySubSection title="Modification Terms" dotColor="purple">
          <ul className="space-y-3 pl-4 md:pl-5">
            {content.generalTerms.modificationTerms.points.map((point, index) => (
              <li
                key={index}
                className="text-zinc-300 flex items-start text-sm md:text-base"
              >
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </PolicySubSection>
      </div>
    </PolicySection>

    <PolicySection title="Additional Legal Items" className="">
      <div className="bg-zinc-900/20 rounded-xl p-4 md:p-6 border border-zinc-800/50">
        <ul className="space-y-4">
          {content.additionalLegalItems.map((item, index) => (
            <li
              key={index}
              className="text-zinc-300 flex items-start leading-relaxed text-sm md:text-base"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2.5 mr-3 md:mr-4 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </PolicySection>
  </div>
));

PolicyContent.displayName = 'PolicyContent';