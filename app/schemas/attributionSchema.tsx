import { z } from "zod";

export const attributionSchema = z.object({
  refCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^SPH[A-Z0-9]{4}$/i.test(val),
      {
        message: "Referral code should be in format: SPH**** (e.g., SPHA123)",
      }
    ),
  source: z
    .string()
    .min(1, "Please select how you heard about us")
    .refine(
      (val) => [
        "publicity_team",
        "friend", 
        "student_mnit",
        "campus_ambassador",
        "social_media",
        "previous_edition",
        "event_listing"
      ].includes(val),
      {
        message: "Please select a valid source option",
      }
    ),
});

export type AttributionFormData = z.infer<typeof attributionSchema>;