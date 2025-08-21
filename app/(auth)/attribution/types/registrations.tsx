export interface RegisterFormData {
  refCode: string;
  source: string;
}

export interface FormField {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
}
