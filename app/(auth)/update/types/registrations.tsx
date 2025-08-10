export interface RegisterFormData {
  phone_no: string;
  college_name: string;
  city: string;
  state: string;
  college_id: string;
  college_branch: string;
  gender: string;
}

export interface FormField {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
}