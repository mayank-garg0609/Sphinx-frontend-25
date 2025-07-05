import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  age: z.string().min(1, "Age is required."),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is required." }),
  }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(13, "Phone number is too long."),
  email: z.string().email("Enter a valid email address."),
  college: z.string().min(2, "College name must be at least 2 characters."),
  college_city: z.string().min(2, "Please enter your college city."),
  college_state: z.string().min(2, "Please enter your college state."),
  collegeId: z
    .string()
    .min(2, "College ID is required.")
    .max(20, "College ID is too long."),
  branch: z.string().min(2, "Branch is required."),
  graduation_year: z.string().min(4, "Year of graduation is required."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
