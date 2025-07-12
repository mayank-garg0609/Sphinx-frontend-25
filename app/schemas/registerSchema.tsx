import { z } from "zod";

export const registerSchema = z.object({
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is required." }),
  }),
  phone_no: z
    .string()
    .min(10, "Phone number should contain 10 digits.")
    .max(10),
  college_name: z.string().min(2, "College name must be at least 2 characters."),
  city: z.string().min(2, "Please enter your college city."),
  state: z.string().min(2, "Please enter your college state."),
  college_id: z
    .string()
    .min(5, "College ID is required.")
    .max(20, "College ID is too long."),
  college_branch: z.string().min(2, "Branch is required."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
