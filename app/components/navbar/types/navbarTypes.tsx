export interface NavItem {
  id: string;
  label: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  external?: boolean;
}

export interface ButtonPosition {
  x: number;
  y: number;
  angle: number;
  zIndex: number;
}