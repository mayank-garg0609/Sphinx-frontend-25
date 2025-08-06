import { z } from "zod";

export const CAregisterSchema = z.object({
  how_did_you_find_us: z
    .string()
    .min(2, "Please tell us how you found out about us."),
  why_should_we_choose_you: z
    .string()
    .min(10, "Please explain why we should choose you."),
  past_experience: z
    .string()
    .min(10, "Please mention any relevant past experience."),
  your_strengths: z
    .string()
    .min(5, "Please describe your strengths."),
  your_expectations: z
    .string()
    .min(5, "Please share your expectations from the program."),
});

export type CARegisterFormData = z.infer<typeof CAregisterSchema>;
