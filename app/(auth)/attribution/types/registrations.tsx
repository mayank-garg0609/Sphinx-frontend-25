export interface RegisterFormData {
  refCode: string;
  source: string;
}

export interface FormField {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}