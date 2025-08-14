import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const fileSchema = z
  .any()
  .refine((files) => {
    return files && files.length > 0;
  }, "Resume is required")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    return files[0]?.size <= MAX_FILE_SIZE;
  }, "File size should be less than 5MB")
  .refine((files) => {
    if (!files || files.length === 0) return false;
    return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
  }, "Only PDF files are allowed");

export const CAregisterSchema = z.object({
  how_did_you_find_us: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters allowed"),
  
  why_should_we_choose_you: z
    .string()
    .min(20, "Please provide at least 20 characters")
    .max(1000, "Maximum 1000 characters allowed"),
  
  past_experience: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(1000, "Maximum 1000 characters allowed"),
  
  your_strengths: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters allowed"),
  
  your_expectations: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters allowed"),
    
  resume: fileSchema,
});

export type CARegisterFormData = z.infer<typeof CAregisterSchema>;