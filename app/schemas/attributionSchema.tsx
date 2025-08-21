import { z } from "zod";

export const registerSchema = z.object({
  refCode: z.string().min(2, "Enter the referral code.").optional(),
  source: z.string().min(2, "Where did u hear about us (LinkedIn, Instagram, etc).").optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
