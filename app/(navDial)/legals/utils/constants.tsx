import { Shield, FileText, RefreshCw } from 'lucide-react'; // Fixed: changed Lock to RefreshCw for refund
import type { Policies } from '../types/legal';

export const POLICIES: Policies = {
  privacy: {
    title: "Privacy Policy",
    icon: Shield,
    description: "Data protection & privacy",
    content: {
      intro:
        "This Privacy Policy explains how we collect, use, and protect your personal information when you use our services. We are committed to maintaining the confidentiality and security of your data.",
      generalTerms: {
        rightsAndResponsibilities:
          "Users have the right to access, modify, and delete their personal data. We are responsible for protecting your information and using it only for the purposes outlined in this policy.",
        redistribution: {
          main: "Your personal data will only be shared under the following circumstances:",
          subPoints: [
            "With your explicit consent for specific purposes.",
            "When required by law or legal proceedings.",
            "To protect our rights and prevent fraud or abuse.",
          ],
        },
        liabilityPolicies:
          "We implement industry-standard security measures to protect your data. However, no system is 100% secure, and users acknowledge the inherent risks of data transmission.",
        modificationTerms: {
          points: [
            "Privacy policy updates will be communicated via email or platform notifications.",
            "Continued use of services constitutes acceptance of privacy policy changes.",
            "Users may request account deletion if they disagree with policy modifications.",
          ],
        },
      },
      additionalLegalItems: [
        "Data retention periods are specified for each type of information collected.",
        "Users have the right to data portability and can request their information in machine-readable format.",
        "We comply with GDPR, CCPA, and other applicable privacy regulations.",
        "Regular security audits are conducted to ensure data protection standards.",
      ],
    },
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    description: "Service terms & conditions",
    content: {
      intro:
        "These Terms of Service govern your use of our platform and establish the legal relationship between you and our company. By using our services, you agree to these terms.",
      generalTerms: {
        rightsAndResponsibilities:
          "Users are granted specific rights to access and use our services subject to compliance with these terms and applicable laws. Users are responsible for maintaining account security.",
        redistribution: {
          main: "Content redistribution is subject to the following restrictions:",
          subPoints: [
            "Commercial use requires explicit written permission from our legal team.",
            "Attribution must be maintained in all derivative works and redistributions.",
            "Modification of our content without permission is strictly prohibited.",
          ],
        },
        liabilityPolicies:
          "Our services are provided 'as is' without warranties. Users assume responsibility for their use of the platform and any consequences thereof.",
        modificationTerms: {
          points: [
            "Terms may be updated with 30 days prior notice to registered users.",
            "Continued use of services constitutes acceptance of term modifications.",
            "Users may terminate their account if they disagree with changes to terms.",
          ],
        },
      },
      additionalLegalItems: [
        "Account termination may occur immediately for violations of these terms.",
        "Dispute resolution shall follow binding arbitration procedures as outlined in our legal framework.",
        "Governing law is determined by user jurisdiction and local regulations.",
        "Intellectual property rights are protected under applicable copyright and trademark laws.",
      ],
    },
  },
  refund: {
    title: "Refund Policy",
    icon: RefreshCw, // Fixed: appropriate icon for refund policy
    description: "Refund terms & conditions",
    content: {
      intro:
        "This Refund Policy explains how we handle refund requests and the conditions under which refunds are granted. We strive to provide fair and transparent refund procedures.",
      generalTerms: {
        rightsAndResponsibilities:
          "Users have the right to request refunds under specific circumstances outlined in this policy. We are responsible for processing legitimate refund requests promptly and fairly.",
        redistribution: {
          main: "Refund requests must include the following information:",
          subPoints: [
            "Order ID or transaction reference number for verification.",
            "Detailed reason for the refund request with supporting documentation.",
            "Contact information for refund processing and communication.",
          ],
        },
        liabilityPolicies: // Fixed: refund-specific content instead of cookie content
          "Refunds are processed according to the original payment method within 5-10 business days. Processing fees may apply depending on the payment provider and refund type.",
        modificationTerms: {
          points: [
            "Refund requests must be submitted within 30 days of the original purchase date.",
            "Digital products and services may have different refund terms based on usage.",
            "Partial refunds may be granted for unused portions of subscription services.",
          ],
        },
      },
      additionalLegalItems: [
        "Refund eligibility varies by product type and is subject to our assessment of each case.",
        "Users may be required to return physical products in original condition for full refund.",
        "Subscription cancellations do not automatically trigger refunds for past billing periods.",
        "Fraudulent refund requests may result in account suspension and legal action.",
      ],
    },
  },
} as const;