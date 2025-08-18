export interface StatItemProps {
  value: string;
  label: string;
  delay?: number;
}

export interface SkillBarProps {
  skill: string;
  percentage: number;
  delay?: number;
}

export interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

export interface StatData {
  value: string;
  label: string;
}

export interface SkillData {
  skill: string;
  percentage: number;
}

export interface HeroSectionProps {
  isLoaded: boolean;
}

export interface AboutSectionProps {
  isLoaded: boolean;
}

export interface SkillsSectionProps {
  skills: SkillData[];
  stats: StatData[];
}

export const ANIMATION_CONFIG = {
  COUNTER_INCREMENT_STEPS: 60,
  COUNTER_INTERVAL: 25,
  COUNTER_DELAY: 200,
  SKILL_BAR_DELAY: 200,
  SKILL_BAR_DURATION: 1500,
} as const;

export const SKILLS_DATA: SkillData[] = [
  { skill: "Technology", percentage: 85 },
  { skill: "Management", percentage: 90 },
  { skill: "Robotics", percentage: 75 },
];

export const STATS_DATA: StatData[] = [
  { value: "20k+", label: "Foot Fall" },
  { value: "10L+", label: "Prize Pool" },
  { value: "6+", label: "Flagship Event" },
  { value: "50+", label: "Events" },
  
];