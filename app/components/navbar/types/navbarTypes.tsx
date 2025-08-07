import { ComponentType } from 'react';

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly link: string;
  readonly icon: ComponentType<{ size?: number; className?: string }>;
  readonly external?: boolean;
}

export interface ButtonPosition {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  readonly zIndex: number;
}

export interface TooltipProps {
  readonly content: string;
  readonly show: boolean;
}