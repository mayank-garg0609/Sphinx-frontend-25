export type IconName =
  | "book"
  | "badge" 
  | "users"
  | "share"
  | "star"
  | "userCheck"
  | "clipboard"

export interface IconProps {
  name: IconName
  className?: string
  size?: number
}

export interface Applicant {
  readonly id: string
  readonly name: string
  readonly college: string
  readonly experience: string
  readonly image: string
}

export interface FAQ {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export interface Particle {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly vx: number
  readonly vy: number
  readonly size: number
  readonly opacity: number
  readonly life: number
  readonly maxLife: number
  readonly side: 'left' | 'right'
  readonly color: string
}

export interface PerkItem {
  readonly id: string
  readonly icon: IconName
  readonly title: string
}

export interface ResponsibilityItem {
  readonly id: string
  readonly description: string
}

export interface ContactPerson {
  readonly id: string
  readonly name: string
  readonly designation: string
  readonly phone: string
}
