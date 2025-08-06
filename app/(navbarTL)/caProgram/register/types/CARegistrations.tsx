export interface CaRegisterFormData {
  how_did_you_find_us: string;
  why_should_we_choose_you: string;
  past_experience: string;
  your_strengths: string;
  your_expectations: string;
}
export interface FormField {
  key: keyof CaRegisterFormData;
  label: string;
  placeholder: string;
}
