import { LucideIcon } from 'lucide-react';

export interface PolicyContent {
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

export interface Policy {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly content: PolicyContent;
  readonly description: string;
}

export interface Policies {
  readonly [key: string]: Policy;
}

export type PolicyKey = 'privacy' | 'terms' | 'cookies';

export interface MousePosition {
  readonly x: number;
  readonly y: number;
}