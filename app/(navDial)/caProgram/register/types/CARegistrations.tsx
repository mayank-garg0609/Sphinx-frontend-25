export type { CARegisterFormData } from "@/app/schemas/CARegisterSchema";

export interface FormField {
  key: keyof import("@/app/schemas/CARegisterSchema").CARegisterFormData;
  label: string;
  placeholder: string;
  type?: 'text' | 'file'; 
  accept?: string; 
}