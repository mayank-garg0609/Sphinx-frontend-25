export interface NavbarItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface NavbarSection {
  items: NavbarItem[];
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className: string;
  includeSignUp: boolean;
}