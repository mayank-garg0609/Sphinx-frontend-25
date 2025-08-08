import { Shield, FileText, Lock } from 'lucide-react';
import type { Policies } from '../types/legal';

export const POLICIES: Policies = {
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
  refund: {
    title: "Refund Policy",
    icon: Lock,
    description: "Refund terms & conditions",
    content: {
      intro:
        "This Refund Policy explains how NexaLaw handles refund requests and the conditions under which refunds are granted.",
      generalTerms: {
        rightsAndResponsibilities:
          "Users have the right to request refunds under specific circumstances outlined in this policy.",
        redistribution: {
          main: "Refund requests must include the following information:",
          subPoints: [
            "Order ID or transaction details.",
            "Reason for the refund request  .",
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
} as const;