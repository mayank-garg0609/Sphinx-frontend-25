import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is mandatory'),
  gender: z.enum(["male", "female", "other"]).nullable(),
  applied_ca: z.boolean(),
  is_verified: z.boolean(),
  role: z.string(),
  sphinx_id: z.string(),

  college_name: z.string().nullable(),
  college_id: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  eventsRegisteredIn: z.array(z.string()).optional(),
  ticketID: z.string().optional(),
});


export type ProfileData = z.infer<typeof ProfileSchema>;